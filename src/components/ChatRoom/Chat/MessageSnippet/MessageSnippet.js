import React, { useContext } from 'react';
import './MessageSnippet.css'

import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MessageDropdownMenu from '../../../../UtilComponents/MessageDropdownMenu/MessageDropdownMenu';
import ChatRoomContext from '../../../../Contexts/chatRoom-context';


function MessageSnippet(props) {
    const {setShowCarousel,  setCarouselImg} = useContext(ChatRoomContext)

    let timeStamp = new Date(props.msg.createdAt);
    let hours = timeStamp.getHours();
    let minutes = timeStamp.getMinutes() < 10 ? `0${timeStamp.getMinutes()}` : timeStamp.getMinutes();


    return (

        <div className={props.className + " chat_message MessageSnippet"} >
            {props.msg.imgPath ? <div className="msgImg"><img src={props.msg.imgPath} alt="msgImg" onClick={() => { setShowCarousel(true); setCarouselImg(props.msg.imgPath) }} /> </div> : null}
            <p className="message">
                {props.msg.text}
            </p>
            <p className="chat_timestamp">
                {(hours < 12) ? `${hours}:${minutes} AM` : `${hours - 12}:${minutes} PM`}
                <span>
                    {props.msg && props.msg.messageStatus === "SENT" ? <CheckIcon /> : null}
                    {props.msg && props.msg.messageStatus === "RECEIVED" ? <DoneAllIcon /> : null}
                    {props.msg && props.msg.messageStatus === "SEEN" ? <DoneAllIcon style={{color: "#4FC3F7"}} /> : null}
                </span>
            </p>


            <span className="sender_svg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"></path><path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"></path></svg>
            </span>
            <MessageDropdownMenu chatBodyRef={props.chatBodyRef}  uuid={props.msg.uuid} />
        </div>

    )
}

export default MessageSnippet;
