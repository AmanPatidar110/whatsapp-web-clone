import React, { useContext, useEffect, useRef } from 'react'
import './ImagePreview.css';

import TextField from '@material-ui/core/TextField';
import ClearIcon from '@material-ui/icons/Clear';
import SendIcon from '@material-ui/icons/Send';


function ImagePreview(props) {

   
    
    const inpRef = useRef();
    const sendRef = useRef();

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        inpRef.current.focus();
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
        if (event.key === 'Enter') {
            props.uploadType==="STATUS"? props.handleSend(inpRef.current.value) : props.handleSend(inpRef.current.value, "image");
            inpRef.current.value = "";
        }
    }
    
    
    const handleClick = e => {
        console.log("triggered");
        if (sendRef?.current?.contains(e.target)) {
            props.uploadType==="STATUS"? props.handleSend(inpRef.current.value) : props.handleSend(inpRef.current.value, "image");
            inpRef.current.value = "";
        }   
    };

    return (
        <div className="image_preview" style={{width:  props.uploadType==="STATUS" ? "95%" : "100%"}}>
            <header style={{backgroundColor:  props.uploadType==="STATUS" ?  "#2c2c2cf1": ""}} >
                <ClearIcon onClick={() => props.uploadType==="STATUS" ? props.setMyStatusFile(undefined) : props.setSelectedFile(undefined)} />
                <h3>Preview</h3>
            </header>
            <section className="preview_Section">
                <img src={ props.preview} alt="msgImg" className="msgImage" ></img>
                <TextField inputRef={inpRef}  onKeyUp={(event) => sendMessage(event)} placeholder="Add a caption..." id="standard-search" />
                <div className="preview_sendIcon" style={{backgroundColor:  props.uploadType==="STATUS" ?  "#2c2c2cf1": "", border:  props.uploadType==="STATUS" ?  "1px solid grey": ""}} ref={sendRef} >
                    <SendIcon />
                </div>
                {/* <input  className="img_Caption" type="text" /> */}
            </section>
        </div>
    )
}

export default ImagePreview
