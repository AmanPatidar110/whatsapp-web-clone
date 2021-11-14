import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import './Sidebar.css';
import SidebarChat from './SidebarChat/SidebarChat';

import { IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import Tooltip from '@mui/material/Tooltip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import ChatRoomContext from '../../../Contexts/chatRoom-context';
import { useHistory } from 'react-router';
import AppContext from '../../../Contexts/app-context';

import firebase from 'firebase/app';
import 'firebase/auth';
import { color } from '@mui/system';



const Sidebar = () => {


    const { setIsAuth } = useContext(AppContext);

    const { userProfile, setUserProfile, setOpenStrip, setStripMessage } = useContext(AppContext);
    const { chatList, setChatList } = useContext(ChatRoomContext);
    const { setNumber } = useContext(AppContext)
    const { setShowSidebarProfile, setShowModalAddConvo, setShowStatusPage } = useContext(ChatRoomContext);
    const [recoveryChatList, setrecoveryChatList] = useState([]);
    const [count, setcount] = useState(0);
    const [showBackArrow, setshowBackArrow] = useState()

    const linkStack = useHistory();
    const [image, setImage] = useState(<PersonIcon />);

const searchInputRef = useRef();

    useEffect(() => {

        if (userProfile) {
            if (userProfile.profileImagePath) setImage(<img src={userProfile.profileImagePath} alt={""} />);
        }
    }, [userProfile]);


    const logoutHandler = async () => {
        setIsAuth(false);
        setNumber(null)
        try {
            await firebase.auth().signOut();
            linkStack.replace('/login');
            setUserProfile(null)

        } catch (error) {
            console.log(error);
            setOpenStrip(true);
            setStripMessage(error);
        }
    }

    const onSearchChange = (e) => {
        console.log("Target", e.target.value, count)
        let List = []
        if (count === 0) {
            setrecoveryChatList([...chatList]);
            List = [...chatList];
        } else {
            List = [...recoveryChatList];
        }
        if (e.target.value.length === 0) {
            setcount(0);
            setChatList([...recoveryChatList])
            return
        }
        setChatList(prev => {

            const newChatList = List.filter(chat => {
                let y = chat.members.find((mem) => mem._id !== userProfile.userId);
                const regex = new RegExp(e.target.value, "i")
                console.log("youname", y.name)
                return y.name.search(regex) >= 0 ? true : false;
            })

            setcount(prev => prev + 1);

            return newChatList;
        })
    }

    const onBackArrowClicked = () => {
        console.log("BACKARROW CLICKED")
        console.log(recoveryChatList)
        searchInputRef.current.value = ""; 
        setshowBackArrow(false);
        setChatList([...recoveryChatList]);
    }

    return (
        <div className="sidebar">

            <div className="sidebar_header">
                <section className="sidebar_headerLeft" onClick={() => { setShowSidebarProfile(true) }} >
                    {image}
                </section>
                <section className="sidebar_headerRight">
                    <Tooltip title="Status">
                        <IconButton onClick={() => { setShowStatusPage(true) }}>
                            <DonutLargeIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="New Chat">
                        <IconButton onClick={() => { setShowModalAddConvo(prev => (!prev)) }} >
                            <ChatIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Logout">
                        <IconButton onClick={logoutHandler}>
                            <ExitToAppIcon />
                        </IconButton>
                    </Tooltip>

                </section>
            </div>

            <div className="sidebar_search">
                <div className="sidebar_searchContainer">
                    {showBackArrow ?
                        <span onClick={onBackArrowClicked} >
                            <ArrowBackIcon style={{color: '#33B7F6'}} />
                        </span>
                        :
                        <SearchIcon />
                    }
                    <input type="text" ref={searchInputRef} onFocus={() => setshowBackArrow(true)} onBlur={(e) => {
                        if (!e.target.value)
                            setshowBackArrow(false)
                    }}
                        onChange={onSearchChange} placeholder="Search or start new chat" />

                </div>
            </div>


            <div className="sidebar_chats">
                {chatList ? chatList.map((single, index) => (<SidebarChat key={single._id + index} chat={single} me={userProfile.userId} />)) : null}
            </div>
        </div>
    )
}

export default Sidebar;