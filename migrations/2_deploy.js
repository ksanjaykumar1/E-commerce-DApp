const Dai = artifacts.require("Dai")
const PaymentProcessor = artifacts.require("PaymentProcessor");

module.exports = async function(deployer,network,address){

    const [admin, payer, _]=address;
    //adresss are adress from ganache 
    //admin is address[0], payer is address[1], rest address are ignored 

    if(network === 'develop'){

        await deployer.deploy(Dai);
        const dai = await Dai.deployed()
        await dai.faucet(payer,web3.utils.toWei('1000'))
        //1 dai = 1*10^18 dai wei , in ethereum blockchain transaction we only talk in wei ,not whole ether 
        //here web3 will be injected by ganache

        await deployer.deploy(PaymentProcessor,admin,dai.address);
    }
    else {
        const Admin_Address ="";
        const Dai_Address="";
        await deployer.deploy(PaymentProcessor,Admin_Address,Dai_Address);
    }

   
}