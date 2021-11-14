import React, { createContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';

import firebaseApp from '../firebaseConfig';
import firebase from 'firebase/app';
import { checkUser, getUserProfile } from '../APIs/apiRequests';
import { postSignup } from '../APIs/apiRequests';
import uuid from 'react-uuid'


const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [isAuth, setIsAuth] = useState(undefined);

    const [userProfile, setUserProfile] = useState();
    const [stripMessage, setStripMessage] = useState("");
    const [openStrip, setOpenStrip] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [Number, setNumber] = useState("");
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
        else if (isAuth && userProfile) {
            linkStack.replace('/')
        };
    }, [isAuth, userProfile])





    const handleOnboardSubmit = async (e, user) => {
        e.preventDefault();
        if (user.name.trim().length < 1) {
            setOpenStrip(true)
            setStripMessage("Please enter a valid name");
            return;
        }
        try {

            setIsLoading(true)
            const profileImagePath = await storageOnComplete("images" ,user.file);
            const response = await postSignup(user.name, profileImagePath);
            if (response.status !== 201) {
                console.error("Login: handleOnboardSubmit()", response);
                setOpenStrip(true)
                setStripMessage("Error creating your profile! Please try again.")
                return;
            }
            setOpenStrip(true)
            setStripMessage("Your are successfully registered with us!");
            getUserProfile().then(data => {
                console.log(data);
                setIsAuth(true);
                setUserProfile({ ...data.userObj })
                setIsLoading(false);
            });

        } catch (error) {
            console.log(error);
            setOpenStrip(true);
            setStripMessage(error);
        }
    }


    const storageOnComplete = async ( mediaFolder ,file) => {
        // The file param would be a File object from a file selection event in the browser.
        // See:
        // - https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
        // - https://developer.mozilla.org/en-US/docs/Web/API/File

        const metadata = {
            'contentType': file.type
        };

        // [START storage_on_complete]
        const storageRef = firebase.storage().ref();
        const snapshot = await storageRef.child(`${mediaFolder}/${uuid()}${file.name}`).put(file, metadata);

        const url = await snapshot.ref.getDownloadURL();
        return url;
    }





return <AppContext.Provider value={
    {
        isAuth, setIsAuth, user,
        userProfile, setUserProfile,
        stripMessage, setStripMessage, openStrip, setOpenStrip,
        isLoading, setIsLoading,
        Number, setNumber, handleOnboardSubmit,
        storageOnComplete
    }
} > {props.children} </AppContext.Provider>

}

export default AppContext;