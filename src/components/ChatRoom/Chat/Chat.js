import React, { useContext, useRef, useEffect, useState, createContext } from 'react';

import { Avatar, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import CircularProgress from '@mui/material/CircularProgress';


import './Chat.css';
import ChatForm from './ChatForm/ChatForm';
import MessageSnippet from './MessageSnippet/MessageSnippet.js';


import ImagePreview from '../../../UtilComponents/ImagePreview/ImagePreview';
import LongMenu from '../../../UtilComponents/Menu/Menu';

import ChatContext from '../../../Contexts/chat-context';
import ChatRoomContext from '../../../Contexts/chatRoom-context';


const Chat = (props) => {

    const {
        y, render, status, selectedFile,
        setSelectedFile, preview, chatBodyRef, handleSend
    } = useContext(ChatContext)

    const { isChatLoading } = useContext(ChatRoomContext);

    return (
        <div className="chat">
            <div className="chat_header">
                {y && y.profileImagePath ? <img src={y.profileImagePath} onClick={() => props.setShowSidebarFriendProfile(true)} alt="You"></img> : <Avatar onClick={() => props.setShowSidebarFriendProfile(true)} />}

                <section className="chat_headerInfo" onClick={() => props.setShowSidebarFriendProfile(true)} >
                    <h3>{y ? y.name : ""}</h3>
                    <p>{status ? status : ""}</p>
                </section>

                <section className="chat_headerIcons">
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <LongMenu setShowSidebarFriendProfile={props.setShowSidebarFriendProfile} />
                        {/* <MoreVertIcon /> */}
                    </IconButton>
                </section>

                {isChatLoading ?

                    <div className="chatCircularLoader">
                        <CircularProgress thickness={5} size={"1.6rem"} color="success" />
                    </div>
                    : null
                }
            </div>

            {!selectedFile ? <div ref={chatBodyRef} className="chat_body">
                {render ? render : null}
            </div> : null}

            {selectedFile ? <ImagePreview handleSend={handleSend} setSelectedFile={setSelectedFile} preview={preview} /> : null}
            <ChatForm handleSend={handleSend} />

        </div>
    )
}

export default Chat;