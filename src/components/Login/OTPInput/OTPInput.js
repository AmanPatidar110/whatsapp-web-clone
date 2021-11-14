import { Fragment, React, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import logo from "../../../Assests/images/whlogo.png";
import './OTPInput.css';

// import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppContext  from '../../../Contexts/app-context';
import CircularProgress from '@mui/material/CircularProgress';



function OTPinput(props) {

    const [otp, setOtp] = useState()
    const {Number} = useContext(AppContext)

    const linkStack = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(otp);
        props.onSubmitOtp(otp)
    }

    const backClicked = () => {
        console.log("triggered back");
        linkStack.replace('/login');
    }


    return (

        <Fragment>
            {Number ? <span className={'ArrowBack'} onClick={backClicked} >  <ArrowBackIcon /> </span> : null}
            <div className="login_cardLogo OTPinput">
                <img src={logo} alt="" />
            </div>

            <form onSubmit={e => handleSubmit(e)} className="login_cardForm OTPinput" >

                <div id={"sign-in-button"}></div>

                    <p>Enter the 6-digit OTP sent to you on: {Number} </p>
                
                <div className="login_cardInput OTPinput">
                    <VpnKeyIcon />
                    <input type="password" autoFocus={true} placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
                </div>
                    <p onClick={(e) => {props.onPhoneSubmitHandler(e)}} >Resend OTP</p>

                <button type="submit" className="login_cardButton" disabled={props.isLoading} >{ props.isLoading ? <CircularProgress size={"1.1rem"}  style={{ color: "green"}}/> : "Continue"}</button>
            </form>
        </Fragment>
    )
}

export default OTPinput
