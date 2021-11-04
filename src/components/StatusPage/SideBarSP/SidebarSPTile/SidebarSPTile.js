import React, { useContext } from 'react';

import "./SidebarSPTile.css";

import { Avatar } from '@material-ui/core';
import { StatusPlayerContext } from '../../StatusPage';
import AppContext from '../../../../Contexts/app-context';

function SidebarSPTile(props) {
    const {userProfile} = useContext(AppContext);
    const [selectedStatusArray, setselectedStatusArray, mainIndex, setMainIndex, subIndex, setsubIndex] = useContext(StatusPlayerContext);

    let postedAt;
    const temp = new Date(props.createdAt);

    const handleClick = () => {
        setselectedStatusArray([...props.statusArray]);
        setMainIndex(props.mainIndex);
        setsubIndex(0);
    }

    return (
        <div className="SidebarSPTile" onClick={handleClick} >
            <div className="tileImage">
                {props.imagePath ? <img src={props.imagePath} alt="You"></img> :  userProfile?.profileImagePath ? <img src={userProfile.profileImagePath} alt="You"></img> : <Avatar />}
                <svg>
                    <circle cx="25" cy="25" r="24" fill="none" stroke-linecap="round" stroke-width="2" stroke-dashoffset="387.69908169872417" class="_1min4"></circle>
                </svg>
            </div>
            <div className="tileInfo">
                <p>{props.name}</p>
               { props.createdAt ? <p className="tileTime">{temp.getDate === (new Date()).getDate ? "Today" : "Yesterday"} at {temp.getHours() > 12 ? temp.getHours() - 12 : temp.getHours()}:{temp.getMinutes() > 9 ? temp.getMinutes(): `0${temp.getMinutes()}`} {temp.getHours() > 12 ? "PM": "AM"}</p>
               :
               <p className="tileTime" >No updates</p>
               }
            </div>
        </div>
    )
}

export default SidebarSPTile
