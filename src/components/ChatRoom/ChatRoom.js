import { React, useContext } from 'react';


import './ChatRoom.css';
import Chat from './Chat/Chat';
import Sidebar from './Sidebar/Sidebar';
import ModalAddConvo from '../../UtilComponents/ModalAddConvo/ModalAddConvo';
import ModalMicBlocked from '../../UtilComponents/ModalMicBlocked/ModalMicBlocked';
import Carousel from '../../UtilComponents/Carousel/Carousel';
import ModalDeleteChat from '../../UtilComponents/ModalDeleteChat/ModalDeleteChat';


import firebase from 'firebase/app';
import 'firebase/auth';
import ModalDeleteMessage from '../../UtilComponents/ModalDeleteMessage/ModalDeleteMessage';
import SidebarProfile from './SidebarProfile/SidebarProfile';
import StatusPage from '../StatusPage/StatusPage';
import AppBanner from './appBanner/AppBanner';
import SidebarFriendProfile from './SidebarFriendProfile/SidebarFriendProfile';
import ChatRoomContext from '../../Contexts/chatRoom-context';
import { ChatContextProvider } from '../../Contexts/chat-context';
import AppContext from '../../Contexts/app-context';



const ChatRoom = (props) => {

    const { isProfileComplete, setIsProfileComplete } = useContext(AppContext);

    const {
        socket,
        width,
        showSidebarProfile,
        setShowSidebarProfile,
        showSidebarFriendProfile,
        setShowSidebarFriendProfile,
        selectedConvo,
    } = useContext(ChatRoomContext);



    return (
        <div className="app_body">

            <ModalDeleteChat />
            <ModalDeleteMessage />
            <ModalAddConvo />


            {!showSidebarProfile && <Sidebar /> }
            {showSidebarProfile && <SidebarProfile showSidebarProfile={showSidebarProfile} setShowSidebarProfile={setShowSidebarProfile} /> }
            {
                showSidebarFriendProfile && width < 1200 ?   null : selectedConvo ?
                        <ChatContextProvider>
                            <Chat socket={socket} setShowSidebarFriendProfile={setShowSidebarFriendProfile} />
                        </ChatContextProvider>
                        : 
                        <AppBanner />
            }
            {showSidebarFriendProfile ? <SidebarFriendProfile showSidebarFriendProfile={showSidebarFriendProfile} setShowSidebarFriendProfile={setShowSidebarFriendProfile} /> : null}

            <Carousel />
            <StatusPage />
            <ModalMicBlocked />

        </div >
    )
}

export default ChatRoom;
