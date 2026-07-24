import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/verify'
import MyOrders from './pages/MyOrders/MyOrders'

const App = () => {
  const [showLogin,setShowLogin]=useState(true)  //is line me showLogin ek state variable hai jo ye track karta hai ki login popup dikhana hai ya nahi. Initially, iski value false hai, matlab login popup nahi dikh raha hai. Jab user sign in button pe click karega, to setShowLogin(true) call hoga, jisse showLogin ki value true ho jayegi aur login popup dikhne lagega. Jab user login popup ko close karega (cross icon pe click karke), to setShowLogin(false) call hoga, jisse showLogin ki value false ho jayegi aur login popup chhup jayega.
console.log("showLogin state:", showLogin);  //is line me console.log statement hai jo "showLogin state:" ke saath current value of showLogin ko browser ke console me print karega. Ye statement har baar execute hoga jab App component render hoga, chahe wo initial render ho ya kisi state update ke baad. Iska use debugging ke liye kiya jata hai, taaki developer ko pata chale ki showLogin state kab change ho rahi hai aur uski current value kya hai.
  console.log("App component rendered");   //is line me console.log statement hai jo "App component rendered" message ko browser ke console me print karega. Ye statement har baar execute hoga jab App component render hoga, chahe wo initial render ho ya kisi state update ke baad. Iska use debugging ke liye kiya jata hai, taaki developer ko pata chale ki component kab render ho raha hai.
  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}  
    
     <div className="app">
      <Navbar setShowLogin={setShowLogin}/> 
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/place-order' element={<PlaceOrder/>} />
        <Route path='/verify' element={<Verify/>} />
        <Route path='/myorders' element={<MyOrders/>} />
      </Routes>
    </div>
    <Footer/>
    </>
  //upar ki saari lines me React Fragment (<></>) ka use kiya gaya hai, jiska matlab hai ki ye multiple elements ko ek single parent element ke andar wrap kar raha hai bina kisi extra DOM element ko create kiye. Is case me, LoginPopup component aur main app content (Navbar, Routes, Footer) ko ek saath wrap kiya gaya hai taaki dono ko conditionally render kiya ja sake based on showLogin state. Jab showLogin true hoga, to LoginPopup dikhai dega, aur jab false hoga, to LoginPopup chhup jayega.
  )
}

export default App
