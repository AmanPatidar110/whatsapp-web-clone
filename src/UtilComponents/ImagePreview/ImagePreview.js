import React, { useContext, useEffect, useRef, useState } from 'react'
import './ImagePreview.css';

import TextField from '@material-ui/core/TextField';
import ClearIcon from '@material-ui/icons/Clear';
import SendIcon from '@material-ui/icons/Send';
import CircularProgress from '@mui/material/CircularProgress';


function ImagePreview(props) {



    const inpRef = useRef();
    const sendRef = useRef();

    const [isSending, setisSending] = useState(false);

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        inpRef.current.focus();
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const sendMessage = async (event) => {
        event.preventDefault();
        if (event.key === 'Enter') {
            setisSending(true);
            props.uploadType === "STATUS" ? await props.handleSend(inpRef.current.value) : await props.handleSend(inpRef.current.value, "image");
            setisSending(false);       
        }
    }


    const handleClick = async (e) => {
        console.log("triggered");
        if (sendRef?.current?.contains(e.target)) {
            setisSending(true);
            if (props.uploadType === "STATUS") {
                await props.handleSend(inpRef.current.value)
            } else {
                await props.handleSend(inpRef.current.value, "image");
            }
            setisSending(false);
        }
    };

    return (
        <div className={`image_preview  ${props.uploadType === "STATUS" ? "STATUS" : null}`} >
            <header style={{ backgroundColor: props.uploadType === "STATUS" ? "#2c2c2cf1" : "" }} >
                <ClearIcon onClick={() => props.uploadType === "STATUS" ? props.setMyStatusFile(undefined) : props.setSelectedFile(undefined)} />
                <h3>Preview</h3>
            </header>
            <section className="preview_Section">
                <img src={props.preview} alt="msgImg" className="msgImage" ></img>
                <TextField inputRef={inpRef} onKeyUp={(event) => sendMessage(event)} placeholder="Add a caption..." id="standard-search" />
                <div className="preview_sendIcon" style={{ backgroundColor: props.uploadType === "STATUS" ? "#2c2c2cf1" : "", border: props.uploadType === "STATUS" ? "1px solid grey" : "" }} ref={sendRef} >
                    {!isSending ?
                        <SendIcon />
                        :
                        <CircularProgress thickness={5} size={"1.6rem"} style={{color:"white" }}/>
                    }
                </div>
                {/* <input  className="img_Caption" type="text" /> */}
            </section>
        </div>
    )
}

export default ImagePreview
