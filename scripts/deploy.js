async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Get the contract factory for LendingProtocol
    const LendingProtocol = await ethers.getContractFactory("LendingProtocol");

    // Deploy the contract
    const lendingProtocol = await LendingProtocol.deploy();

    console.log("LendingProtocol contract deployed to:", lendingProtocol.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
