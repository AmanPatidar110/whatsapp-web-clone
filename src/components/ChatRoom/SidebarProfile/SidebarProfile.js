import React, { useContext, useRef, useState } from 'react';
import './SidebarProfile.css';

import me from '../../../Assests/images/me.jpg';

import { IconButton } from '@material-ui/core';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@material-ui/core/TextField';
import DoneIcon from '@mui/icons-material/Done';

import PersonIcon from '@material-ui/icons/Person';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { putAbout, putProfileImage, putUsername } from '../../../APIs/apiRequests';
import AppContext from '../../../Contexts/app-context';


function SidebarProfile(props) {
    const fileInputRef = useRef();
    const nameInpRef = useRef();
    const aboutInpRef = useRef();

    const [selectedFile, setSelectedFile] = useState();
    const [editName, seteditName] = useState(false);
    const [editAbout, seteditAbout] = useState(false)

    const {userProfile, setUserProfile, setOpenStrip, setStripMessage} = useContext(AppContext);

    const onFileChange = async (e) => {

        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(e.target.files[0])
        try {
            const response = await putProfileImage(e.target.files[0]);
            if (response.status === 200) {
                setUserProfile(prev => {
                    return { ...prev, profileImagePath: response.data.profileImagePath }
                });
            } else {
                throw new Error("Something went worng!") 
            }
        } catch (error) {
            console.log(error);
            setOpenStrip(true);
            setStripMessage(error);
        }  
    }

    const saveName = async () => {
        try {
            const response = await putUsername(nameInpRef.current.value);
    
            if (response.status === 200) {
                console.log("saving name");
                setUserProfile(prev => {
                    return { ...prev, userName: response.data.name }
                });
                seteditName(false);
            } else {
                throw new Error("Something went worng!") 
            }
            
        } catch (error) {
            console.log(error);
            setOpenStrip(true);
            setStripMessage(error); 
        }
    }

    const saveAbout = async () => {
       
        try {
            const response = await putAbout(aboutInpRef.current.value);
    
            if (response.status === 200) {
                
                setUserProfile(prev => {
                    return { ...prev, about: response.data.about }
                });
                seteditAbout(false);
            } else {
                throw new Error("Something went worng!") 
            }
            
        } catch (error) {
            console.log(error);
            setOpenStrip(true);
            setStripMessage(error);
        }
    }


    return (
        <div className="SidebarProfile" >
            <div className="SidebarProfile_Header">
                <ArrowBackIcon className="BackButton" onClick={() => { props.setShowSidebarProfile(false) }} />
                <h3>Profile</h3>
            </div>
            <div className="myImage">
                <div className="signup_cardLogo">
                    <div className="hoverEffect"></div>
                    <input ref={fileInputRef} className="file-upload" hidden={true} type="file" onChange={(e) => onFileChange(e)} />

                    {!userProfile?.profileImagePath ? (<PersonIcon className="personIcon" />) : (<img src={userProfile.profileImagePath} alt="profileImg" className="profileImg" ></img>)}

                    <div className="uploader" onClick={() => { fileInputRef.current.click() }} >
                        <PhotoCameraIcon />
                        <p>CHANGE PROFILE PHOTO</p>

                    </div>
                </div>

            </div>
            <div className="NameSection">
                <p>Your Name</p>

                <div>
                    <p>{!editName ? userProfile.userName : null}</p>

                    {editName ?
                        <div className="nameTextField">
                            <TextField inputRef={nameInpRef} defaultValue={userProfile.userName} id="standard-search" />
                            <div className="doneButton" onClick={saveName}>
                                <DoneIcon />
                            </div>
                        </div>
                        :
                        <Tooltip title="Click to edit">
                            <IconButton onClick={() => seteditName(true)} >
                                <ModeEditIcon />
                            </IconButton>
                        </Tooltip>
                    }
                </div>

            </div>
            <p className="Note">
                This is not your username or pin. This name will be visible to your WhatsApp contacts.
            </p>
            <div className="NameSection">
                <p>About</p>

                <div>
                <p>{!editAbout ? userProfile.about : null}</p>

                
                {editAbout ?
                        <div className="nameTextField">
                            <TextField inputRef={aboutInpRef} defaultValue={userProfile.about} id="standard-search" />
                            <div className="doneButton" onClick={saveAbout}>
                                <DoneIcon />
                            </div>
                        </div>
                        :
                        <Tooltip title="Click to edit">
                            <IconButton onClick={() => seteditAbout(true)} >
                                <ModeEditIcon />
                            </IconButton>
                        </Tooltip>
                    }
                </div>

            </div>
        </div>
    )
}

export default SidebarProfile
