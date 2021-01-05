const Koa = require('koa');
const Router = require('@koa/router');
const cors = require("@koa/cors");
const PaymentProcessor = require('../frontend/src/contracts/PaymentProcessor.json')
const {Payment} =require('./db.js');
const { ethers } = require('ethers');

const app = new Koa();

const router = new Router();

const item = {
    '1':{id:1 , url: 'http://UrlToDownloadItem1'},
    '2':{id:2 , url: 'http://UrlToDownloadItem2'}
}

router.get('/api/getPaymentId/:itemId',async ctx =>{
    //generating random payment id between 1 to 10000 , tofixed(0) implies no decimal 
    const paymentId = (Math.random()*10000).toFixed(0);
    // payment entry in our mongodb
    await Payment.create({
        id: paymentId,
        itemId: ctx.params.itemId,
        paid :false
     });

    ctx.body ={
        paymentId
    };

});

router.get('/api/getItemUrl/:paymentId', async ctx =>{
    const payment = await Payment.findOne({id: ctx.params.paymentId});
    if(payment && payment.paid === true) {
        ctx.body = {
            url: items[payment.itemId].url
        }
    }
    else {
        ctx.body = {
            url:''
        };
    }
})

app
.use(cors())
.use(router.routes())
.use(router.allowedMethods());

app.listen(4000,()=>{
    console.log('Server running on port 4000')
});

const listenToEvents = ()=> {
    const provider =new ethers.providers.JsonRpcProvider('http://localhost:9545');
    const networkId = '5777';

    const paymentProcessor = new ethers.Contract(PaymentProcessor.networks[networkId].address , PaymentProcessor.abi,provider)

    paymentProcessor.on('PaymentDone',async (payer,amount,paymentId , date)=>{
        console.log(`from ${payer} 
        amount ${amount} 
        paymentId ${paymentId} 
        date ${(new Date(date.toNumber()*10000)).toLocaleString()}`);

        const payment = await Payment.findOne({id: paymentId});
    if(payment) {
        payment.paid = true;
        await payment.save();
    }
    });

    
}
listenToEvents();