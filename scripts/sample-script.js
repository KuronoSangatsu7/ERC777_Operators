const { web3, ethers } = require("hardhat");
const cheapATokenObject = require('../artifacts/contracts/CheapAToken.sol/CheapAToken.json');
const bulkSenderObject = require('../artifacts/contracts/BulkSender.sol/BulkSender.json');
const { singletons } = require("@openzeppelin/test-helpers");

async function main() {

  let signers = await ethers.getSigners();
  let accounts = signers.map(x => x.address);

  this.erc1820 = await singletons.ERC1820Registry(accounts[0]);

  const cheapATokenAddress = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0';
  const cheapATokenAbi = cheapATokenObject.abi;
  const cheapATokenContract = new web3.eth.Contract(cheapATokenAbi, cheapATokenAddress);
  await cheapATokenContract.methods.isOperatorFor('0x610178dA211FEF7D417bC0e6FeD39F05609AD788', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266').call()
  .then(console.log)

  const bulkSenderAddress = '0x610178dA211FEF7D417bC0e6FeD39F05609AD788';
  const bulkSenderAbi = bulkSenderObject.abi;
  const bulkSenderContract = new web3.eth.Contract(bulkSenderAbi, bulkSenderAddress);
  console.log(bulkSenderContract);

  let recipientAddresses = await ethers.getSigners();
  recipientAddresses.shift();
  recipientAddresses = recipientAddresses.map(x => x.address);
  console.log(recipientAddresses);
  
  let sum = 0;

  await cheapATokenContract.methods.balanceOf("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266").call()
  .then(console.log);

  for(const address of recipientAddresses) {
    await cheapATokenContract.methods.balanceOf(address).call()
    .then(console.log);
  }

  /*await bulkSenderContract.methods.send(cheapATokenAddress, recipientAddresses, '1', []).send({from: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"})
    .then(console.log)*/

  for(const address of recipientAddresses) {
    await cheapATokenContract.methods.balanceOf(address).call()
    .then(console.log);
  }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
