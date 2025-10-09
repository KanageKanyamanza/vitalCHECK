import React from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

const PayPalButton = ({ planId, planName, amount, currency = 'USD', onSuccess, onError }) => {
  const { t } = useTranslation()

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: `VitalCheck - ${planName}`,
          amount: {
            currency_code: currency,
            value: amount.toString()
          }
        }
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING'
      }
    })
  }

  const onApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture()
      console.log('PayPal order captured:', order)
      
      toast.success(t('payment.success'))
      
      if (onSuccess) {
        onSuccess(order, planId)
      }
    } catch (error) {
      console.error('Error capturing PayPal order:', error)
      toast.error(t('payment.error'))
      
      if (onError) {
        onError(error)
      }
    }
  }

  const onErrorHandler = (err) => {
    console.error('PayPal error:', err)
    toast.error(t('payment.error'))
    
    if (onError) {
      onError(err)
    }
  }

  return (
    <div className="w-full">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal'
        }}
      />
    </div>
  )
}

export default PayPalButton

