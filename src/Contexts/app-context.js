import React, { createContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';

import firebaseApp from '../firebaseConfig';
import firebase from 'firebase/app';
import { checkUser, getUserProfile, postConvo } from '../APIs/apiRequests';
import { postSignup } from '../APIs/apiRequests'
import { linkClasses } from '@mui/material';

const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [isAuth, setIsAuth] = useState(undefined);

    const [userProfile, setUserProfile] = useState();
    const [stripMessage, setStripMessage] = useState("");
    const [openStrip, setOpenStrip] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [Number, setNumber] = useState();
    const [user, setuser] = useState();


    const linkStack = useHistory();


    useEffect(() => {

        setIsLoading(true);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                if (!user) setuser(user);
                setIsAuth(true);
            }
            else {
                setIsAuth(false);
                setIsLoading(false)
            }
        });
    }, []);
    
    useEffect(() => {
        if (isAuth) {
            setIsLoading(true);
            checkUser()
            .then((data) => {
                if (!data.isProfileComplete || data.isNewUser) {
                    linkStack.replace('/onboard');
                }
                    else if (data.isProfileComplete) {
                        
                        getUserProfile().then(data => {
                            console.log(data);
                            setUserProfile({ ...data.userObj })
                            
                        });
                    }
                })
                .catch(async (err) => {
                    console.log(err);
                    setNumber(null);
                    await firebase.auth().signOut();
                    setIsAuth(false);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }  
    }, [isAuth, user])

    
    useEffect(() => {
        if (isAuth !== undefined && !isAuth) linkStack.replace('/login');
        // else if (isAuth  && !userProfile && !isProfileComplete) linkStack.replace('/onboard');
        else if (isAuth && userProfile){ 
            linkStack.replace('/')  
        };
    }, [isAuth, userProfile])





    const handleOnboardSubmit = async (e, user) => {
        e.preventDefault();
        try {

            const response = await postSignup(user);

            if (response.status !== 201) {
                console.error("Login: handleOnboardSubmit()", response);
                setOpenStrip(true)
                setStripMessage("Error creating your profile! Please try again.")
                return;
            }
            setOpenStrip(true)
            setStripMessage("Your are successfully registered with us!");
            setIsLoading(true)
            getUserProfile().then(data => {
                console.log(data);
                setIsAuth(true);
                setUserProfile({ ...data.userObj })
                
            });

        } catch (error) {
            console.log(error);
            setOpenStrip(true);
            setStripMessage(error);
        }
    }




    return <AppContext.Provider value={
        {
            isAuth, setIsAuth, user,
            userProfile, setUserProfile,
            stripMessage, setStripMessage, openStrip, setOpenStrip,
            isLoading, setIsLoading,
            Number, setNumber, handleOnboardSubmit
        }
    } > {props.children} </AppContext.Provider>

}

export default AppContext;