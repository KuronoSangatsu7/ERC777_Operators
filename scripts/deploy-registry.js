const hre = require("hardhat");

async function main() {
    const ERC1820Registry = await hre.ethers.getContractFactory("ERC1820Registry");
    const registry = await ERC1820Registry.deploy();

    await registry.deployed();

    console.log("Registry has been deployed to:", registry.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });