const mongoose = require('mongoose');

mongoose.connect(
    'mongodb+srv://00000:00000@cluster0.mzgqt.mongodb.net/commerce?retryWrites=true&w=majority',
    {
        useNewUrlParser:true, useCreateIndex : true ,useUnifiedTopology: true 
    }
);

const paymentSchema = new mongoose.Schema({
    id: String,
    itemId: String,
    paid: Boolean
});

const Payment = mongoose.model('Payment',paymentSchema);
module.exports ={
    Payment
};
