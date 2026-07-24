import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// placing user order for frontend, when user click on place order button then this api will be called and we will save the order in database and then we will redirect user to payment page, where user will do payment and then we will update the payment status in database and then we will show the order history to user in profile section
const placeOrder = async (req,res) =>{
    const frontend_url = "http://localhost:5174";

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    try{
        const newOrder = new orderModel({
            userId: req.body.userId,
            items:req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name,
        
                },
                unit_amount:item.price*100*80,  // here we are multiplying by 100 because stripe accept amount in paise and we are multiplying by 80 because we are giving 20% discount to user
            },
            quantity:item.quantity
        }))
        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges",    
            },
            unit_amount:2*100*80,  // here we are multiplying by 100 because stripe accept amount in paise
        },
        quantity:1
        })
        const session = await stripe.checkout.sessions.create({  // here we are creating a checkout session for stripe payment gateway
             line_items:line_items,
                mode:"payment",
                success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,  // here we are redirecting user to frontend url with order id and success status after successful payment, so that we can verify the payment and update the payment status in database
                cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,  // here we are redirecting user to frontend url with order id and success status after failed payment, so that we can verify the payment and update the payment status in database
        })
        res.json({
            success:true,
            session_url:session.url
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"})
    }
}

const verifyOrder = async (req,res) =>{
const {orderId,success} = req.body;
try{
    if(success=="true"){
        await orderModel.findByIdAndUpdate(orderId,{payment:true});
        res.json({message:"Payment successful"})
    }
    else{
        await orderModel.findByIdAndDelete(orderId);
        res.json({message:"Payment failed"})
    }
}
    catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"})
    }
}
// user order for frontend 
const userOrders = async (req,res) =>{
    try{
        const orders = await orderModel.find({userId:req.body.userId});  //what does this line do? it will find all the orders of the user from the database and return it to the frontend
        res.json({
            success:true,data:orders
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"})
    }
}
//Listing orders for admin panel 
const listOrders = async (req,res) =>{
    try{
        const orders = await orderModel.find({});  //what does this line do? it will find all the orders from the database and return it to the frontendres
        res.json({
            success:true,data:orders
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"})
    }
}
//api for updsitng order status for admin panel
const updateStatus = async (req,res) =>{
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Order status updated successfully"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Something went wrong"})
    }
}


export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}