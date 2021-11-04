import React, { useContext, useEffect, useState } from 'react';
import './Sidebar.css';
import SidebarChat from './SidebarChat/SidebarChat';

import { IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import Tooltip from '@mui/material/Tooltip';

import ChatRoomContext from '../../../Contexts/chatRoom-context';
import { useHistory } from 'react-router';
import AppContext from '../../../Contexts/app-context';

import firebase from 'firebase/app';
import 'firebase/auth';



const Sidebar = () => {

    
    const { setIsAuth} = useContext(AppContext);
    
    const {userProfile, setUserProfile, setOpenStrip, setStripMessage} = useContext(AppContext);
    const {chatList} = useContext(ChatRoomContext);
    const {setNumber} = useContext(AppContext)
    const { setShowSidebarProfile, setShowModalAddConvo, setShowStatusPage} = useContext(ChatRoomContext);
    
    const linkStack = useHistory();
    const [image, setImage] = useState(<PersonIcon />);

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

    return (
        <div className="sidebar">

            <div className="sidebar_header">
                <section className="sidebar_headerLeft" onClick={() => {setShowSidebarProfile(true)}} >
                    {image}
                </section>
                <section className="sidebar_headerRight">
                    <Tooltip title="Status">
                        <IconButton onClick={() => {setShowStatusPage(true)}}>
                            <DonutLargeIcon  />
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
                    <SearchIcon />
                    <input type="text" placeholder="Search or start new chat" />
                </div>
            </div>


            <div className="sidebar_chats">
                {chatList ? chatList.map(single => (<SidebarChat key={single._id} chat={single} me={userProfile.userId} />)) : null}
            </div>
        </div>
    )
}

export default Sidebar;