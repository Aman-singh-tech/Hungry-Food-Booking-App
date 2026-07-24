import userModel from "../models/userModel.js"

//add items to user cart
const addToCart = async (req, res) => {
  try {
    const userData = await userModel.findOne({_id: req.body.userId});
    let cartData = userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, {cartData});
    res.json({success: true, message: "Item added to cart successfully"})
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error while adding item to cart"})
  }
}

//remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    if (cartData[req.body.itemId] === 0) {
      delete cartData[req.body.itemId];
    }
    await userModel.findByIdAndUpdate(req.body.userId, {cartData});
    res.json({success: true, message: "Item removed from cart successfully"})
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error while removing item from cart"})
  }
}

//get user cart details
const getCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    const cartData = userData.cartData;
    res.json({success: true, cartData});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error while fetching cart details"})
  }
}

export {addToCart, removeFromCart, getCart}
