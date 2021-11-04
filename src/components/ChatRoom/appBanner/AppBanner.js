import React from 'react';
import './AppBanner.css';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ChatIcon from '@material-ui/icons/Chat';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


import DonutLargeIcon from '@mui/icons-material/DonutLarge';

import bannerImage from '../../../Assests/images/appBannerLight.jpg';

function AppBanner() {
    return (
        <div className="appBanner">
            <img src={bannerImage} alt="" />
            <h2>Click on any of the contact tiles to start chatting</h2>

            <List sx={{ width: '100%', maxWidth: 360 ,bgcolor: '#F8F9FA' }}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <DonutLargeIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Status" secondary="See status updates of all your connections" />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <ChatIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Chat" secondary="Chat with new people through there phone number" />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <ExitToAppIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Logout" secondary="Safely logout from the app" />
                </ListItem>
            </List>

        </div>
    )
}

export default AppBanner
