import React, {useContext, useEffect, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"
const LoginPopup = ({setShowLogin}) => {

const {url, token, setToken} = useContext(StoreContext)

    const [currState,setCurrState] = useState("Login")
    const [data,setData]=useState({
      name:"",
      email:"",
      password:""
    })



    const onChangeHandler = (event)=>{   //event.target.name is the name of the input field and event.target.value is the value entered by the user in that input field. The setData function is then called to update the data state with the new value for the corresponding field.
      const name = event.target.name;   //event.target.name is the name of the input field that triggered the onChange event. This allows us to identify which field is being updated (e.g., "name", "email", or "password").
      const value=event.target.value;     //event.target.value is the current value entered by the user in the input field. This value will be used to update the corresponding property in the data state.
      setData(data=>({...data,[name]:value}))   //The setData function is called to update the data state. It takes a callback function that receives the previous state (data) as an argument. The callback function returns a new object that is created by spreading the previous state (...data) and then updating the specific field (identified by [name]) with the new value (value). This way, only the field that triggered the onChange event will be updated in the data state, while the other fields will remain unchanged.
    }

    const onLogin = async(event)=>{
            event.preventDefault()   // is line me 
            //api calls 
            let newUrl = url;
            if(currState==="Login"){
              newUrl +="/api/user/login"
            }
            else{
              newUrl +="/api/user/register"
            }
               //aPI CALLing using axios
            try {
              console.log("API Payload:", data);
              console.log("API URL:", newUrl);
              const response = await axios.post(newUrl, data);
              console.log("API Response:", response.data);
              if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                setToken(response.data.token);
                setShowLogin(false);
                alert("Account created successfully!");
              } else {
                alert(response.data.message);
              }
            } catch (error) {
              console.error("Registration/Login Error:", error);
              alert("Error: " + (error.response?.data?.message || error.message));
            }

           
              
    }


  return (
    <div className='login-popup'>
     <form onSubmit={onLogin} className="login-popup-container" >
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt=""/>

        </div>
        <div className="login-popup-inputs">
          {currState==="Login"?<></>:<input name='name' onChange ={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />}
            <input name='email' onChange={onChangeHandler} value ={data.email} type="email" placeholder='Email address' required />
            <input name ='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
        </div>
        <button type="submit">{currState==="Sign Up"?"Create account":"Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState==="Login"
        ?<p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
        :<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span> </p>
}
     </form> 
    </div>
  )
}

export default LoginPopup
