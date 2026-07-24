import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import './verify.css'

const Verify = () => {
  const [searchParams] = useSearchParams()

  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')

  const { url } = useContext(StoreContext)
  const navigate = useNavigate()

  const verifyPayment = async () => {
    try {
      const response = await axios.post(url + '/api/order/verify', { orderId, success })

      // backend returns: { message: "Payment successful" | "Payment failed" }
      const message = response?.data?.message || ''

      if (message === 'Payment successful') navigate('/myorders')
      else navigate('/')
    } catch { 
      navigate('/')
    }
  }

  useEffect(() => {
    verifyPayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='verify'>
      <div className='spinner'></div>
    </div>
  )
}

export default Verify

