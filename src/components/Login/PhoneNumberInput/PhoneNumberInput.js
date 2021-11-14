import React, { Fragment, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';

import logo from "../../../Assests/images/whlogo.png";
import  AppContext from '../../../Contexts/app-context';
import { useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';



function PhoneNumberInput(props) {


   const {Number, setNumber} = useContext(AppContext);

    return (
        <Fragment>

            <div className="login_cardLogo">
                <img src={logo} alt="" />
            </div>

            <form onSubmit={(e) => props.onPhoneSubmitHandler(e)} className="login_cardForm" >

                <div id={"sign-in-button"}></div>
                <PhoneInput
                    country={'in'}
                    value={Number}
                    onKeyDown={(e) => { if (e.key === "Enter") props.onPhoneSubmitHandler(e) }}
                    onChange={(phone) => { setNumber('+' + phone)}}
                />


                <button type="submit" className="login_cardButton" disabled={props.isLoading} >{ props.isLoading ? <CircularProgress  size={"1.1rem"}  style={{ color: "green"}}/> : "GET OTP"}</button>
            </form>
        </Fragment>
    )
}

export default PhoneNumberInput
