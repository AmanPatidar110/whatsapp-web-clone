import React, { useState, useEffect, useContext } from 'react';
import './SidebarChat.css';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { Avatar } from '@material-ui/core';

import CameraAltIcon from '@material-ui/icons/CameraAlt';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MicIcon from '@mui/icons-material/Mic';
import ChatRoomContext from '../../../../Contexts/chatRoom-context';
import { postClearUnseenCount } from '../../../../APIs/apiRequests';



function SidebarChat(props) {
    const { selectedConvo, setSelectedConvo, setisChatLoading, requestMessages, chatList, setMessages } = useContext(ChatRoomContext);

    const [you, setYou] = useState();
    const [lastMessage, setLastMessage] = useState();
    let background;


    useEffect(() => {
        if (props.chat.lastMessage)
            setLastMessage(props.chat.lastMessage)

        console.log(props.chat);

        const temp = props.chat.members;
        const y = temp?.find((mem) => mem._id !== props.me);
        setYou(y);

    }, [chatList])

    useEffect(() => {
        setLastMessage({ ...props.chat.lastMessage })
        // console.log(selectedConvo, lastMessage, selectedConvo?._id, lastMessage?.conversationId)
        // if (selectedConvo && lastMessage && selectedConvo._id === lastMessage.conversationId) {
        //     setLastMessage({ ...selectedConvo?.lastMessage})
        // }
        // else if (selectedConvo && selectedConvo.lastMessage?.text && !(lastMessage?.text) && selectedConvo._id === lastMessage?.conversationId) {
        //     setLastMessage({ ...selectedConvo?.lastMessage })
        // }
        // else if (selectedConvo && selectedConvo.lastMessage?.text && !(lastMessage)) {
        //     setLastMessage({ ...selectedConvo?.lastMessage })

        // }
    }, [selectedConvo])

    if (selectedConvo?._id === props.chat._id) {
        background = "#ebebeb";
    }


    const handleClick = async () => {
        setMessages([]);
        setisChatLoading(true)
        requestMessages(props.chat._id).then(() => { setisChatLoading(false) })
        setSelectedConvo({ ...props.chat });
        postClearUnseenCount(props.chat._id);
    }


    let updatedAt;
    if (lastMessage?.createdAt) {
        let d = new Date(lastMessage?.createdAt);

        let hours = d?.getHours();
        let minutes = d?.getMinutes() < 10 ? `0${d?.getMinutes()}` : d?.getMinutes();

        if (d.getDay() !== (new Date()).getDay()) updatedAt = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
        else updatedAt = ((hours < 12) ? `${hours}:${minutes} AM` : `${hours - 12}:${minutes} PM`);
    }

    return (
        <div className="sidebarChat" onClick={handleClick} style={{ backgroundColor: background }}>
            {you && you.profileImagePath ? <img src={you?.profileImagePath} alt="You"></img> : <Avatar />}
            <div className="sidebarChat_info">
                <h2>{you?.name}</h2>
                <p>
                    {lastMessage?.by === props.me ? <span>
                        {lastMessage?.messageStatus === "SENT" ? <CheckIcon color={"disabled"} /> : null}
                        {lastMessage?.messageStatus === "RECEIVED" ? <DoneAllIcon color={"disabled"} /> : null}
                        {lastMessage?.messageStatus === "SEEN" ? <DoneAllIcon style={{ color: "#4FC3F7" }} color={"primary"} /> : null}
                    </span> : null}

                    {lastMessage?.type === "text" ? <span className={"msgText"}>{lastMessage?.text.substring(0, 35)}</span> : null}
                    {lastMessage?.type === "image" ? <span><CameraAltIcon />Photo</span> : null}
                    {lastMessage?.type === "audio" ? <span ><MicIcon />{lastMessage?.audioDuration}s</span> : null}
                </p>
            </div>
            <div className="sidebarChar_Right">

                <div className="sidebarChat_time">
                    {updatedAt}
                </div>

                <div className="popUpBox" >
                    {props.chat.unseenCount ? <span className="UnreadMessages" >{props.chat.unseenCount}</span> : null}
                    <KeyboardArrowDownIcon className="ArrowDownIcon" />
                </div>
            </div>
        </div>
    )
}

export default SidebarChat;
