const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNo: {
        type: String,
        required: true
    },
    time: {
        type: String,
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
    },
    email:{
        type:String,
        default:false
    },
    password:{
        type:String,
        default:false
    },
    visitedDeps:{
        type:String,
        default:false
    },
    Dep1EntryTime:{
        type:String,
        default:false
    },
    Dep1ExitTime:{
        type:String,
        default:false
    },
    Dep2EntryTime:{
        type:String,
        default:false
    },
    Dep2ExitTime:{
        type:String,
        default:false
    },
    Dep3EntryTime:{
        type:String,
        default:false
    },
    Dep3ExitTime:{
        type:String,
        default:false
    },
    Dep4EntryTime:{
        type:String,
        default:false
    },
    Dep4ExitTime:{
        type:String,
        default:false
    },
    Dep5EntryTime:{
        type:String,
        default:false
    },
    Dep5ExitTime:{
        type:String,
        default:false
    },
    Dep6EntryTime:{
        type:String,
        default:false
    },
    Dep6ExitTime:{
        type:String,
        default:false
    },
    DepNo:{
        type:Number,
        default:false
    }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;