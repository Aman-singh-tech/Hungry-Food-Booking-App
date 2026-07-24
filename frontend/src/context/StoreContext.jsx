import { createContext, useState, useEffect } from 'react';
import axios from "axios";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems,setCartItems]= useState({});

    const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [token,setToken] =useState("");
    const [food_list,setFoodlist]= useState([])

    const addToCart=async (itemId) => {
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
    }
    else{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
    }
    if(token){
await axios.post(
            url+"/api/cart/add",
            { itemId },
            { headers: { Authorization: `Bearer ${token}` } }
        )
    }
}

const removeFromCart= async (itemId) => {
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
    if(token){
await axios.post(
            url+"/api/cart/remove",
            { itemId },
            { headers: { Authorization: `Bearer ${token}` } }
        )
    }
}

   const getTotalCartAmount = ()=>{
    let totalAmount = 0;
    for(const item in cartItems){
        if(cartItems[item]>0){
            let itemInfo = food_list.find((product)=> product._id === item);
            totalAmount += itemInfo.price* cartItems[item];
        }
    }
    return totalAmount;
}

const fetchFoodList = async ()=>{
    const response = await axios.get(url+"/api/food/list");
    setFoodlist(response.data.data)
}
const loadCartData = async (token) => {
    console.log("StoreContext: Loading cart data with token:", token ? `${token.substring(0, 10)}...` : "undefined");
    const response = await axios.post(
        url+"/api/cart/get",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    setCartItems(response.data.cartData);
}

useEffect(()=>{
    async function loadData(){
        await fetchFoodList();
        const storedToken = localStorage.getItem("token");
        console.log("StoreContext: token from localStorage:", storedToken ? `${storedToken.substring(0, 10)}...` : "undefined");
        if(storedToken){
            setToken(storedToken);
            await loadCartData(storedToken);
        }
    }
    loadData();
},[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
