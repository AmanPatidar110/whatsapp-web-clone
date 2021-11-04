import { createContext, React, useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';


import './Login.css';


import 'react-phone-input-2/lib/style.css'

import AppContext from '../../Contexts/app-context';

import firebase from 'firebase/app';
import 'firebase/auth';

import OTPInput from './OTPInput/OTPInput';
import PhoneNumberInput from './PhoneNumberInput/PhoneNumberInput';
import { postConvo, postSignup } from '../../APIs/apiRequests';
import Onboard from '../Onboard/Onboard';



export const AuthLoadingContext = createContext();

function Login() {
    const { setOpenStrip, setStripMessage, isAuth, isProfileComplete } = useContext(AppContext);
    const { Number, setNumber } = useContext(AppContext)
    const { setIsAuth, setIsProfileComplete } = useContext(AppContext);

    const [authLoading, setAuthLoading] = useState(false);
    const confirmationResultRef = useRef();


    const linkStack = useHistory();

    // const inputRef = useRef();

    const window = {
        recaptchaVerifier: undefined
    }

    const captcha = () => {

        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                onPhoneSubmitHandler();
            },
            defaultCountry: 'IN'
        });

    }


    const onPhoneSubmitHandler = (e) => {
        e.preventDefault();
        console.log(Number);
        if (Number === "") {
            setStripMessage("Enter a valid phone number.")
            setOpenStrip(true);
            setAuthLoading(false)
            return;
        }

        captcha()
        const phoneNumber = Number;
        firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
            .then((result) => {
                console.log("code sent");
                confirmationResultRef.current = result;
                linkStack.push("/login/otp");
            }).catch((error) => {
                // Error; SMS not sent
                // ...
                setNumber(null)
                console.log(error);
            });
    }


    const onSubmitOtp = async (otp) => {

        confirmationResultRef.current.confirm(otp).then((result) => {
            setIsAuth(true);
        })
            .catch((error) => {
                console.log(error);
                alert("Incorrect OTP");
            });
    };



    return (
        <div className="login">
            <div className="login_card">


                <AuthLoadingContext.Provider value={[authLoading, setAuthLoading]} >
                    <Switch>
                        <Route exact={true} path="/login/otp"> <OTPInput onSubmitOtp={onSubmitOtp} onPhoneSubmitHandler={onPhoneSubmitHandler} /> </Route>
                        <Route path="/login"> <PhoneNumberInput onPhoneSubmitHandler={onPhoneSubmitHandler} /> </Route>
                       
                    </Switch>
                </AuthLoadingContext.Provider>


            </div>
        </div>
    )
}

export default Login;
