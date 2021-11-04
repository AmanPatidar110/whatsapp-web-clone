import React, { useContext, useState } from 'react';
import './Menu.css';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import AppContext from '../../Contexts/app-context';
import ChatRoomContext from '../../Contexts/chatRoom-context';

const options = [
    'Contact info',
    'Mute notifications',
    'Delete chat',
];

const ITEM_HEIGHT = 48;


export default function LongMenu(props) {

    const {userProfile, selectedConvo} = useContext(AppContext);
    const {setShowModalDeleteChat} = useContext(ChatRoomContext)


    let y = selectedConvo?.members.find((mem) => mem._id !== userProfile.userId);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const selectOption = async (option) => {
        console.log(option)
        handleClose();

        switch (option) {
            case ("Contact info"):
                props.setShowSidebarFriendProfile(true);
                break;


            case ("Mute notifications"):

                break;

            case ("Delete chat"):

                setShowModalDeleteChat(true);
                break;

            default:
                break;
        }
    };

    return (
        <div className='chatDropdownMnu'>
            <IconButton
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                style={{
                    top: "3rem",
                    left: "-6rem"
                }}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '10rem'
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option} style={{
                        fontSize: "0.9rem",
                        color: "gray"
                    }}
                        onClick={() => selectOption(option)}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}