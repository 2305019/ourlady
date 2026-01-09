import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import {useNavigate} from 'react-router-dom'
const EmailVerify = () => {

  axios.defaults.withCredentials=true
  const {backendUrl, isLoggedin, userData, getUserData}=useContext(AppContext);
  const navigate = useNavigate()
  const inputRefs = React.useRef([])
  const handleInput = (e,index)=>{
    if(e.target.value.length>0 && index < inputRefs.current.length-1){
      inputRefs.current[index+1].focus();
    }
  }

  const handleKeyDown = (e, index)=>{
    if(e.key === 'Backspace' && e.target.value === '' && index>0){
      inputRefs.current[index -1].focus();
    }
  }


  const handlePaste=(e)=>{
    const paste=e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value=char;
      }
    })
  }

  const onSubmitHandler=async(e)=>{
    try {
      e.preventDefault();
      const otpArray=inputRefs.current.map(e=>e.value);
      const otp=otpArray.join('');
      const {data}=await axios.post(backendUrl+'/api/auth/verify-account',{otp})
      if(data.success){
        toast.success(data.message)
        getUserData()
        navigate('/')
        
      }else{
        toast.message(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    isLoggedin && userData && userData.isVerified && navigate('/')
  },[isLoggedin , userData])

  return (
    <div className="auth-page">
      <div className="auth-card">
        <form onSubmit={onSubmitHandler} className="auth-form">
          <h1 className="auth-title">Verify Email</h1>
          <p className="auth-subtitle">Enter the 6‑digit code we sent to your email.</p>
          <div className="otp-row" onPaste={handlePaste}>
            {Array(6).fill(0).map((_,index)=>(
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                ref={e=>inputRefs.current[index]=e}
                onInput={((e)=>handleInput(e,index))}
                onKeyDown={(e)=> handleKeyDown(e,index)}
                className="otp-input"
              />
            ))}
          </div>
          <button className="auth-button">Verify Email</button>
        </form> 
      </div>
    </div>
  )
}

export default EmailVerify
