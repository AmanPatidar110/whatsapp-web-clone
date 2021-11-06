import { React, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import './Onboard.css';


// import logo from "../../Assests/images/whlogo.png";

import PersonIcon from '@material-ui/icons/Person';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import AppContext from '../../Contexts/app-context';


function Onboard(props) {

    const linkStack = useHistory();

    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()


    const { setOpenStrip, stripMessage, setStripMessage, storageOnComplete} = useContext(AppContext)

    const [user, setUser] = useState({
        name: "",
        file: ""
    })

    useEffect(() => {
        // if(isProfileComplete) return linkStack.push('/')
        // else {
        //     setOpenStrip(true);
        //     setStripMessage("You are not registered with us! Please upload your DP and enter name");
        // }
    }, [])


    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile]);





    const handleNameChange = (e) => {
        setUser({ ...user, name: e.target.value });
    }

    const onFileChange = (e) => {
        setUser({ ...user, file: e.target.files[0] });

        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        
        const typeArray = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            
        ]
        const fileType = e.target.files[0].type;

        if (!typeArray.includes(fileType)) {
            setOpenStrip(true);
            setStripMessage("Please select appropriate image file type");
            return;
        } 
        
        setSelectedFile(e.target.files[0])
    }


    return (
        <form className="signup_cardForm" onSubmit={(e) => props.handleOnboardSubmit(e, user)} >
            <div className="signup_cardLogo">
                <input className="file-upload" type="file" onChange={(e) => onFileChange(e)} />
                {!user.file ? (<PersonIcon className="personIcon" />) : (<img src={preview} alt="profileImg" className="profileImg" ></img>)}
                <PhotoCameraIcon className="uploader" />
            </div>

            <div className="signup_cardInput">
                <PersonIcon />
                <input type="text" placeholder="Your name" name="contact" onChange={(e) => handleNameChange(e)} />
            </div>

            <button className="signup_cardButton" type="submit" >Join Now!</button>
        </form>
    )
}

export default Onboard
