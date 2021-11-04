import React, { createContext, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { getChatList, getMessages, getUserProfile, postIncrementUnseenCount, postSignup } from '../APIs/apiRequests';
import AppContext from './app-context';
import pop from '../Assests/Audio/Iphone Xr Tone.mp3';
import { socket } from '../UtilComponents/Sockect.io/socket';


const ChatRoomContext = createContext();

export const ChatRoomContextProvider = (props) => {
    const { setOpenStrip, setStripMessage, isAuth, isProfileComplete } = useContext(AppContext);

    const [messages, setMessages] = useState([]);
    const [width, setwidth] = useState(window.innerWidth);
    const { userProfile, setUserProfile } = useContext(AppContext);
    const [showModalAddConvo, setShowModalAddConvo] = useState(false);
    const [showSidebarProfile, setShowSidebarProfile] = useState(false);
    const [showSidebarFriendProfile, setShowSidebarFriendProfile] = useState(false);
    const [showModalDeleteChat, setShowModalDeleteChat] = useState(false);
    const [showModalDeleteMessage, setShowModalDeleteMessage] = useState(false);
    const [showCarousel, setShowCarousel] = useState(false);
    const [showStatusPage, setShowStatusPage] = useState(false);
    const [carouselImg, setCarouselImg] = useState();
    const [selectedConvo, setSelectedConvo] = useState();
    const [selectedMsg, setSelectedMsg] = useState();
    const [chatList, setChatList] = useState();
    const [showModalMicBlocked, setShowModalMicBlocked] = useState(false);
    const [isChatLoading, setisChatLoading] = useState(false);


    const notificationAudio = new Audio(pop);

    const linkStack = useHistory()


    useEffect(() => {
        if (userProfile)
            socket.emit("addUser", userProfile.userId);
        else {
            getUserProfile().then(data => {
                console.log(data);
                setUserProfile({ ...(data.userObj) })
            });
        }
    }, [userProfile, isAuth])


    useEffect(() => {
        console.log(userProfile, "CHAT ROOM CONTEXT");
        if (userProfile) {
            console.log(userProfile, "CHAT ROOM CONTEXT");
            getAndSetChatList();
        }
    }, [userProfile]);



    const getAndSetChatList = async () => {
        try {
            const temp = await getChatList();
            setChatList(() => {
                const tempList = temp.data.map(convo => {
                    return { ...convo.conversationId, unseenCount: convo.unseenCount }
                })

                return [...tempList];
            });

        } catch (error) {
            console.log(error);
            setOpenStrip(true);
            setStripMessage(error);
        }
    }





    useEffect(() => {
        if (selectedConvo && selectedConvo.unseenCount > 0) {
            console.log("CLEAR UNSEENCOUNT CALLED");
            setChatList(prevChatList => {
                const tempList = [...prevChatList];
                const indx = tempList.findIndex(conv => conv._id === selectedConvo._id);
                if (indx >= 0) tempList[indx].unseenCount = 0;

                return [...tempList];
            })
        }
    }, [selectedConvo]);




    useEffect(() => {
        if (selectedConvo) {

            setShowSidebarFriendProfile(false);
            socket.off("getMessage", func);
        }
    }, [selectedConvo]);

    useEffect(() => {
        if (chatList) {
            socket.on("getMessage", func);
            socket.on("getSeenMessages", seenFunc);


            return () => {
                socket.off("getMessage", func);
                socket.off("getSeenMessages", seenFunc);
            };
        }
    }, [chatList]);



    const func = async (data) => {
        notificationAudio.play();

        console.log("getmessage Triggered")
        const msg = {
            uuid: data.uuid,
            by: data.by,
            text: data.text,
            conversationId: data.conversationId,
            type: data.type,
            imgPath: "",
            audioPath: "",
            audioDuration: "",
            createdAt: data.createdAt,
        };

        console.log(chatList);

        if (chatList && chatList.some(convo => convo._id === msg.conversationId)) {
            setChatList(prevChatList => {
                const tempList = [...prevChatList];
                let indx = tempList.findIndex(conv => conv._id === msg.conversationId);
                if (indx >= 0) tempList[indx].lastMessage = msg;

                const tempConvo = tempList[indx];
                tempList.splice(indx, 1);
                tempList.splice(0, 0, { ...tempConvo })

                indx = tempList.findIndex(conv => conv._id === msg.conversationId);

                console.log("USEEEN COUNT", tempList[indx].unseenCount)
                if ((!selectedConvo || selectedConvo?._id !== msg?.conversationId) && data?.receiverId === userProfile?.userId && tempList[indx]) {
                    tempList[indx].unseenCount += 1;
                    postIncrementUnseenCount(msg.conversationId);
                }

                return [...tempList];
            })
        }
        else {
            try {
                const temp = await getChatList();
                setChatList(() => {
                    const tempList = temp.data.map(convo => {
                        return { ...convo.conversationId, unseenCount: convo.unseenCount }
                    })

                    const indx = tempList.findIndex(conv => conv._id === msg.conversationId);
                    if (indx >= 0) tempList[indx].lastMessage = msg;

                    if ((!selectedConvo || selectedConvo?._id !== msg?.conversationId) && data?.receiverId === userProfile?.userId && tempList[indx]) {
                        tempList[indx].unseenCount += 1;
                        postIncrementUnseenCount(msg.conversationId);
                    }
                    return [...tempList];
                });

            } catch (error) {
                console.log(error);
                setOpenStrip(true);
                setStripMessage(error);
            }
        }


        console.log("CHECKKKK SEND SEEN MESSAGES", data.by, userProfile.userId, selectedConvo?._id)
        if (selectedConvo && selectedConvo?._id === msg?.conversationId && data?.receiverId === userProfile?.userId) {
            socket.emit("sendSeenMessages", { msgSender: data.by, msgReceiver: userProfile.userId, convoId: selectedConvo._id });

            if (msg.type === "image" || msg.type === "audio") {
                console.log(msg.conversationId, msg.type)
                requestMessages(msg.conversationId);
            }
            else
                setMessages(prev => [...prev, { ...msg }]);
        }

    }

    const seenFunc = async (data) => {

        if (chatList) {
            setChatList(prevChatList => {
                const temp = [...prevChatList];
                const indx = temp.findIndex(conv => conv._id === data.convoId);
                if (indx >= 0 && temp[indx].lastMessage && temp[indx].lastMessage.messageStatus) temp[indx].lastMessage.messageStatus = "SEEN";
           

                return [...temp];
            })
        } else {
            getAndSetChatList();
        }


        if (selectedConvo && selectedConvo?._id === data.convoId && data.msgSender === userProfile.userId) {
            setMessages(prevMessages => {
                const temp = [...prevMessages];
                const newMsgs = temp.map(msg => {
                    if (msg.by === userProfile.userId && msg.messageStatus !== "SEEN") msg.messageStatus = "SEEN";
                    return { ...msg };
                });

                return [...newMsgs];
            })
        }

    }

    const requestMessages = async (convoId) => {
        console.log("REWWWWWWQUEST MAESGAGSDGEGGS")
        setShowModalAddConvo(false);

        try {
            const temp = await getMessages(convoId);
            console.log(temp);
            if (temp.status !== 200) {
                setOpenStrip(true);
                setStripMessage("Unable to fetch messages");
                return
            }
            const msgs = temp.data.messages.map(msg => {

                return {
                    uuid: msg.uuid,
                    by: msg.by,
                    createdAt: msg.createdAt,
                    text: msg.text,
                    coversationId: msg.conversationId,
                    type: msg.type,
                    imgPath: msg.imgPath,
                    audioPath: msg.audioPath,
                    audioDuration: msg.audioDuration,
                    messageStatus: msg.messageStatus,
                    deletedFor: msg.deletedFor
                }
            });

            setMessages([...msgs]);

        } catch (error) {
            console.log(error);
            setOpenStrip(true);
            setStripMessage(error);
        }

    }



    useEffect(() => {
        window.matchMedia("(min-width: 1200px)").addEventListener('change', () => {
            setwidth(window.innerWidth)
        });
    }, [])




    return <ChatRoomContext.Provider value={
        {
            socket, width, setwidth, showModalAddConvo, setShowModalAddConvo, showSidebarProfile, setShowSidebarProfile,
            showSidebarFriendProfile, setShowSidebarFriendProfile, showModalDeleteChat, setShowModalDeleteChat, showModalDeleteMessage, setShowModalDeleteMessage,
            showCarousel, setShowCarousel, showStatusPage, setShowStatusPage, carouselImg, setCarouselImg,
            messages, setMessages, requestMessages, selectedConvo, setSelectedConvo, selectedMsg, setSelectedMsg, chatList, setChatList, showModalMicBlocked, setShowModalMicBlocked,
            isChatLoading, setisChatLoading,
        }}
    > {props.children} </ChatRoomContext.Provider>
}


export default ChatRoomContext;