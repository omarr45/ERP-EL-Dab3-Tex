const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNo: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    type:{
        type:String,
        required:true
    },
    currentDepartment:{
        type:String,
        required:true
    },
    Dep1:{
        type:Boolean,
        required:true
    },
    Dep2:{
        type:Boolean,
        required:true
    },
    Dep3:{
        type:Boolean,
        required:true
    }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;