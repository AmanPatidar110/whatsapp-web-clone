import React, { useContext, useEffect, useState } from 'react';

import './SidebarFriendProfile.css';
import { Avatar } from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';

import ClearIcon from '@mui/icons-material/Clear';
import AppContext from '../../../Contexts/app-context';
import ChatRoomContext from '../../../Contexts/chatRoom-context';


function SidebarFriendProfile(props) {
    const { userProfile } = useContext(AppContext);
    const {setShowModalDeleteChat} = useContext(ChatRoomContext)
    const [wi, setwi] = useState(window.innerWidth);

    const { selectedConvo } = useContext(ChatRoomContext);
    let y = selectedConvo?.members.find((mem) => mem._id !== userProfile.userId);


    useEffect(() => {
        window.matchMedia("(min-width: 1200px)").addEventListener('change', () => {
            setwi(window.innerWidth)
        });
    }, [])

    return (
        <div className="SidebarFriendProfile" style={{ width: props.showSidebarFriendProfile && wi < 1200 ? "70%" : '30%' }}>
            <header >

                <div className="closeIcon" onClick={() => props.setShowSidebarFriendProfile(false)}>
                    <ClearIcon />
                </div>

                <h3>Contact Info</h3>

            </header>
            <div className="userTile" style={{ paddingBottom: "2rem", fontSize: "1.2rem" }}>
                {y && y.profileImagePath ? <img src={y.profileImagePath} alt="You"></img> : <Avatar />}
                <p>{y.name}</p>
            </div>
            <div className="userTile" style={{ marginTop: "0.7rem" }} >
                <p>Mute Notification</p>
                <div style={{ backgroundColor: 'rgba(211, 211, 211, 0.568)', height: '1px' }}></div>
                <p>Starred Messages</p>
            </div>
            <div className="userTile" style={{ marginTop: "0.7rem" }} >
                <p style={{ fontSize: "0.9rem", color: "#00BFA5" }}>About and phone number</p>
                <p>{y?.about}</p>
                <div style={{ backgroundColor: 'rgba(211, 211, 211, 0.568)', height: '1px' }}></div>
                <p>{y?.contactNumber}</p>
            </div>
            <div className="userTile" style={{ marginTop: "0.7rem", cursor: "pointer" }} onClick={() => { setShowModalDeleteChat(true); props.setShowSidebarFriendProfile(false) }} >
                <p style={{ fontSize: "1.1rem", color: "red", marginTop: "0.5rem" }}> <span> <DeleteIcon /> </span>  Delete chat</p>
            </div>

        </div>
    )
}

export default SidebarFriendProfile
