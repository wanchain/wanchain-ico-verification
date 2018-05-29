### WIP 101: Wanchain Smart Contract Source Code Submission and Verification
Developer: Harry Ward

Version 0.1

### Background

When a smart contract is deployed into blockchain, only the compiled bytecode resides in the blockchain.  Although smart contract owners do publish their ICO source code on their websites, there is no user-friendly and reliable method for users to correlate a source code with the actual running program.  In this specification, we propose a method to build a web utility to submit the verified source code to Wanchain blockchain.

### Specification

First, an ICO smart contract owner will write a source code, securely scan and compile source code and deploy the source code to Wanchain testnet or mainnet.  The owner will get a contract address back and will go to source code verification tool to provide the following information:
1. The contract address of the deployed smart contract
2. The smart contract source code
3. The solidity version that is used to compile the source code
4. The compiled bytecode
5. The abi (Application Binary Interface) of the compiled source code
6. The network wherer the smart contract is deployed to

For ico smart contract, the following information should be provided and be consistent with the smart contract source code and deployed bytecode:
The name of the ico

1. Symbol 
2. Decimal 
3. Owner of the ico smart contract
4. Authority
5. Description
6. Contract start date
7. Contract end date
8. Wanport:  This is the address where the ICO funds will go to.
9. Icon:  The icon image for the ico in PNG or JPEG format.   Should not exceed 300k.

When an ico smart contract owner submits the verification request to web utility, the verification tool will perform the following tasks:
1. Verify the solidity version specified is the same as in the source code
2. Verify the contract address exists in the specified blockchain
3. Compare the bytecode provided by the user with the bytecode deployed to the blockchain for any discrepancy
4. Compiled the source code with the same solidity version and compare the result with the supplied bytecode
5. Compiled the source code with the same solidity version and compare the result with the supplied ABI code
6. Compare the meta data specified in the submission with value obtained from the function specified in the deployed smart contract.  
7. If there is any discrepancy, the verification is either rejected or manually inspected by Wanchain foundation to ensure the source code and byte code are consistent.

For the contract that is submitted and verified, the following artifacts will be generated:

1. Contract_address.json:  This file stores the meta data of the contract such as name, symbol, owner, descriptions, total supply, etc.
2. Contract_address.sol:  The source code of the smart contract
3. Contract_address.byte:  The bytecode of the smart contract
4. Contract_address.png or contract_address.jpg:  The ico icon image
5. Contract_address.abi:  The ABI (Application Binary Interface) of a smart contract
6. These artifacts will be used by Wanchain tools such as explorer and wallet.



