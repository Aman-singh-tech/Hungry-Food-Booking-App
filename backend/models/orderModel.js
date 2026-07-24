import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    items:{type:Array,required:true},
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String,default:"Food Processing"},
    date:{type:Date,default:Date.now()},  //Whenever we do payment we will save the date and time of order, so that we can show the order history to user in profile section
    payment:{type:Boolean,default:false},  // when new order is placed, payment is false, when user do payment then we will update the payment to true, so that we can show the order history to user in profile section
})

const orderModel = mongoose.models.order || mongoose.model("order",orderSchema)
export default orderModel;