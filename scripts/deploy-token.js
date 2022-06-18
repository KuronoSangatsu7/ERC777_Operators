const hre = require("hardhat");

async function main() {
    let initialSupply = 1000;
    let defaultOperators = ['0x610178dA211FEF7D417bC0e6FeD39F05609AD788', '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e'];

    const CheapAToken = await hre.ethers.getContractFactory("CheapAToken");
    const token = await CheapAToken.deploy(initialSupply, defaultOperators);

    await token.deployed();

    console.log("Your token has been deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
