import React, { useContext, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import './MessageDropdownMenu.css';


import AppContext from '../../Contexts/app-context';
import ChatRoomContext from '../../Contexts/chatRoom-context';

const options = [
    'Message info',
    'Reply',
    'Forward Message',
    'Delete message',
];

const ITEM_HEIGHT = 48;


export default function MessageDropdownMenu(props) {

    const {userProfile} = useContext(AppContext);
    const { setShowModalDeleteMessage,  setSelectedMsg} = useContext(ChatRoomContext)

    const [menuPaper, setMenuPaper] = useState(false);

    const {selectedConvo} = useContext(ChatRoomContext);

    let y = selectedConvo?.members.find((mem) => mem._id !== userProfile.userId);

    const [myStyle, setMyStyle] = useState()


    const handleClick = (event) => {
        const style = getComputedStyle(props.chatBodyRef.current);
        console.log(style.height.toString().substring(0, style.height.length-3) , event.clientY,   style.height.toString().substring(0, style.height.length-3) -event.clientY )
        console.log(style.height.toString().substring(0, style.height.length-3 - event.clientY) < 25)
        if (  style.height.toString().substring(0, style.height.length-3) - event.clientY  < 25) {
            setMyStyle({ top: "-8rem" })
        }
        else setMyStyle({top: "18px"});
        console.log(event.clientY, style.height);
        setMenuPaper(true)
    };

    useEffect(() => {
        if(!menuPaper) setMyStyle(null)
    }, [menuPaper])

    const selectOption = async (option) => {
        console.log(option)
        setMenuPaper(false)


        switch (option) {
            case ("Contact info"):

                break;


            case ("Mute notifications"):

                break;

            case ("Delete message"):

                setShowModalDeleteMessage(true);
                // console.log(setSelectedMsg)
                setSelectedMsg(props.uuid)
                break;

            default:
                break;
        }
    };

    return (
        <div className="MessageDropdownMenu">
            {menuPaper ? <div className="Backdrop" onClick={() => { setMenuPaper(false) }} ></div> : null}
            <IconButton
                className="messageDropDownIcon"
                onClick={handleClick}
            >
                <KeyboardArrowDownIcon className="ArrowDownIcon" />
            </IconButton>

            <div class="MenuPaper"
                style={{
                    display: menuPaper ? 'block' : 'none',

                    ...myStyle
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option} 
                        onClick={() => selectOption(option)}
                    >
                        {option}
                    </MenuItem>
                ))}
            </div>
        </div>
    );
}




