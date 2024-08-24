import { viem } from "hardhat";
// import { parseEther } from "hardhat";


const MINT_VALUE = 100n; // minting 0.000...<100 times> 1 Ether



async function main() {
    const publicClient = await viem.getPublicClient();
    const [deployer, acc1, acc2, acc3] = await viem.getWalletClients();
    const contract = await viem.deployContract("MyToken");
    console.log(`MyToken contract deployed at ${contract.address}\n`);

    // Minting
    const mintTx = await contract.write.mint([acc1.account.address, MINT_VALUE]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log(
      `Minted ${MINT_VALUE.toString()} decimal units to account ${
        acc1.account.address
      }\n`
    );
    const balanceBN = await contract.read.balanceOf([acc1.account.address]);
    console.log(
      `Account-1 ${
        acc1.account.address
      } has ${balanceBN.toString()} decimal units of MyToken\n`
    );
    
    // check voting power: it should be 0, as self-delegation not done
    const votes = await contract.read.getVotes([acc1.account.address]);
    console.log(
      `Account-1 ${
        acc1.account.address
      } has ${votes.toString()} units of voting power before self delegating\n`
    );

    // -- self delegate to have voting power
    // note: even though 100 tokens are there, still voting power is 0
    // hence, self-delegation is needed
    const delegateTx = await contract.write.delegate([acc1.account.address], {
        account: acc1.account,
      });
      await publicClient.waitForTransactionReceipt({ hash: delegateTx });
      const votesAfter = await contract.read.getVotes([acc1.account.address]);
      console.log(
        `Account-1 ${
          acc1.account.address
        } has ${votesAfter.toString()} units of voting power after self delegating\n`
      );

      // check voting power, after self-delegation
      /*await contract.read.getVotes([acc1.account.address]);
      console.log(
        `Account-1 ${
          acc1.account.address
        } has ${votes.toString()} units of voting power after self delegating\n`
      ); */

      // transfer half of my tokens from account1 to account2
      const transferTx = await contract.write.transfer(
        [acc2.account.address, MINT_VALUE / 2n],
        {
          account: acc1.account,
        }
      );
      await publicClient.waitForTransactionReceipt({ hash: transferTx });
      const votes1AfterTransfer = await contract.read.getVotes([
        acc1.account.address,
      ]);
      console.log(
        `Account-1 ${
          acc1.account.address
        } has ${votes1AfterTransfer.toString()} units of voting power after transferring\n`
      );
      const votes2AfterTransfer = await contract.read.getVotes([
        acc2.account.address,
      ]);
      console.log(
        `Account-2 ${
          acc2.account.address
        } has ${votes2AfterTransfer.toString()} units of voting power after receiving a transfer\n`
      );

      // get voting history
      const lastBlockNumber = await publicClient.getBlockNumber();
      for (let index = lastBlockNumber - 1n; index > 0n; index--) {
        const pastVotes = await contract.read.getPastVotes([
          acc1.account.address,
          index,
        ]);
        console.log(
          `Account-1 ${
            acc1.account.address
          } had ${pastVotes.toString()} units of voting power at block ${index}\n`
        );
      }

}

main().catch( (error) => {
    console.error(error);
    process.exitCode = 1;
});
