import React, { useState, useEffect } from 'react';
import './Payment.css';
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import {Link,useHistory} from 'react-router-dom';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import {getBasketTotal} from './Reducer';
import axios from './axios';
import {db} from './firebase';

function Payment() {
    const [{basket,user},dispatch] = useStateValue();
    const history = useHistory(); 
    const [error, seterror] = useState(null);
    const [disabled, setdisabled] = useState(true);
    const [succeeded, setsucceeded] = useState(false)
    const [processing, setprocessing] = useState("")
    const [clientSecret, setclientSecret] = useState(true)

    useEffect(()=>{
        const getClientSecret = async () =>{
            const response = await axios({
                method:'post',
                url:`/payments/create?total=${getBasketTotal(basket)*100}`
            });
            setclientSecret(response.data.clientSecret);
        }

        getClientSecret();
    },[basket])

    console.log("THE SECRET IS >>> ", clientSecret)

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setprocessing(true);
        const payload = await stripe.confirmCardPayment(clientSecret, {payment_method:{
            card:elements.getElement(CardElement)
        }}).then(({paymentIntent})=>{
            // paymentIntent = 
            console.log(paymentIntent)
            db.collection('users')
            .doc(user?.uid)
            .collection('orders')
            .doc(paymentIntent.id)
            .set({
                basket: basket,
                amount:paymentIntent.amount,
                created:paymentIntent.created
            })

            setsucceeded(true);
            seterror(null);
            setprocessing(false);

            dispatch({
                type:'EMPTY_BASKET'
            })

            history.replace('./orders')
        })
    }

    const handleChange = e =>{
        setdisabled(e.empty)
        seterror(e.error?e.error.message:"")
    }

    return (
        <div className="payment">
            <div className="payment__container">
                <h1>
                    Checkout {<Link to="/checkout">({basket?.length}item)</Link>}
                </h1>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment__address">
                        <p>{user?.email}</p>
                        <p>Address</p>
                        <p>Country</p>
                    </div>
                </div>
                <div className="payment__section">
                    <div className="payment__title">
                            <h3>Review Items and Delivery</h3>
                    </div>
                    <div className="payment__items">
                        {basket.map(item=>(
                            <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating} 
                            />
                        ))}
                    </div>
                </div>
                <div className="payment__section">
                    <div className="payment__title">
                            <h3>Payment Method</h3>
                    </div>
                    <div className="payment__details">
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange} />
                            <div className="payment__priceContainer">
                            <CurrencyFormat
                                renderText={(value)=>(
                                    <>
                                        <h3>Order Total: {value}</h3>
                                    </>
                                )}
                                decimalScale={2}
                                value={getBasketTotal(basket)}
                                displayType={"text"}
                                thousandSeperator={true}
                                prefix={"$"}
                            />
                            <button disabled={processing || disabled|| succeeded}>
                                <span>
                                    {processing? <p>Processing</p>:"Buy Now"}
                                </span>
                            </button>
                            </div>
                            {error && <div>{error}</div>}
                        </form>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Payment
