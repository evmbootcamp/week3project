const MINT_VALUE = BigInt(10000);

// Function to mint ERC20 tokens for a user
async function mintERC20TokensForThisUser(myERC20TokenContract: any, voter: any, tokenDeployer: any, publicClient: any) {
    const mintTx = await myERC20TokenContract.write.mint([voter.account.address, MINT_VALUE], { account: tokenDeployer.account });
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    return mintTx;
}

// Function for self-delegation
async function selfDelegate(myERC20TokenContract: any, voter: any, publicClient: any) {
    const delegateTx = await myERC20TokenContract.write.delegate([voter.account.address], { account: voter.account });
    await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    return delegateTx;
}

// Function for voting on a proposal
async function voteForAProposalOnTokenizedBallotContract(tokenizedBallotContract: any, proposalIndex: any, tokenCount: any, voter: any, publicClient: any) {
    const voteTx = await tokenizedBallotContract.write.vote([proposalIndex, tokenCount], { account: voter.account });
    await publicClient.waitForTransactionReceipt({ hash: voteTx });
    return voteTx;
}

// Function to get voter's voting power
async function getVotersVotingPower(tokenizedBallotContract: any, voter: any) {
    const voterVotingPower = await tokenizedBallotContract.read.getVotePower([voter.account.address]);
    return voterVotingPower;
}

export {
    MINT_VALUE,
    mintERC20TokensForThisUser,
    selfDelegate,
    voteForAProposalOnTokenizedBallotContract,
    getVotersVotingPower    
};
