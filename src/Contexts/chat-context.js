
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

import MessageSnippet from '../components/ChatRoom/Chat/MessageSnippet/MessageSnippet';

import { postAudioMessage, postMessage, postSetReceivedMessages, postSetSeenMessages } from '../APIs/apiRequests';

import AudioSnippet from '../components/ChatRoom/Chat/AudioSnippet/AudioSnippet';

import { socket } from '../UtilComponents/Sockect.io/socket';

import uuid from 'react-uuid'
import AppContext from './app-context';
import ChatRoomContext from './chatRoom-context';

const ChatContext = createContext();


export const ChatContextProvider = (props) => {

    const chatBodyRef = useRef();

    const { messages, setMessages, requestMessages } = useContext(ChatRoomContext);
    const { userProfile, setOpenStrip, setStripMessage } = useContext(AppContext);
    const { selectedConvo, setSelectedConvo } = useContext(ChatRoomContext);
    const { chatList, setChatList } = useContext(ChatRoomContext);

    const [render, setRender] = useState();
    const [status, setStatus] = useState();

    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()

    let y = selectedConvo?.members.find((mem) => mem._id !== userProfile.userId);

    const scrollRef = useRef();



    useEffect(() => {
        if (selectedConvo && userProfile && y) {
            postSetSeenMessages(y._id, userProfile.userId, selectedConvo._id).then(response => {
                console.log("CHECKKKK SEND SEEN MESSAGES", y._id, userProfile.userId, selectedConvo._id)

                socket.emit("sendSeenMessages", { msgSender: y._id, msgReceiver: userProfile.userId, convoId: selectedConvo._id });

            }).catch(err => console.log(err))
        }
    }, [selectedConvo]);



    const socketStatus = async (data) => {
        if (y._id === data.userId) {

            let d = new Date(data?.lastSeen);
            let day;

            if (d.getDay() === (new Date()).getDay()) day = "Today";
            else if (d.getDay() === (new Date()).getDay() - 1) day = "Yesterday";
            else day = `on ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;

            let hours = d?.getHours();
            let minutes = d?.getMinutes() < 10 ? `0${d?.getMinutes()}` : d?.getMinutes();

            let time = `Last seen ${day} at ` + ((hours < 12) ? `${hours}:${minutes} AM` : `${hours - 12}:${minutes} PM`);

            data.online ? setStatus("Online") : setStatus(time);


            if (data?.online) {
                setMessages(prevMessages => {
                    const temp = [...prevMessages];
                    const newMsgs = temp.map(msg => {
                        if (msg.by === userProfile.userId && msg.messageStatus === "SENT" && msg.conversationId === selectedConvo._id) msg.messageStatus = "RECEIVED";
                        return { ...msg };
                    });

                    return [...newMsgs];
                })
            }
        }


        if (data && data.online && chatList) {

            setChatList(prevChatList => {
                const temp = [...prevChatList];
                const newChat = temp.map(convo => {
                    if (convo.members.some(mem => mem._id === data.userId) && convo.lastMessage && convo.lastMessage.messageStatus === "SENT") convo.lastMessage.messageStatus = "RECEIVED"
                    return convo;
                })

                return [...newChat];
            });

        }

        if (data && userProfile && data.online) {
                postSetReceivedMessages(userProfile.userId, data.userId)
        }

    }



    useEffect(() => {
        socket.on("updateActivity", socketStatus);
        socket.emit('getStatus', { userId: y._id });
        if (selectedConvo) {
            socket.on("userActivity", socketStatus);
        }

        return () => {
            socket.off("userActivity", socketStatus);
            socket.off("updateActivity", socketStatus);
        };
    }, [selectedConvo]);


    useEffect(() => {
        if (messages) {
            spare()
        }
    }, [messages])

    useEffect(() => {
        scrollRef.current?.scrollIntoView();
    }, [render])

    const spare = () => {
        setRender(messages.map(msg => {
            if (msg.by === userProfile.userId) return (<div key={msg.createdAt} ref={scrollRef}>

                {msg.type === 'audio' ?
                    <AudioSnippet msg={msg} chatBodyRef={chatBodyRef} className={"chat_messageMe  chat_message_cornerSvg"} />
                    : <MessageSnippet msg={msg} chatBodyRef={chatBodyRef} className={"chat_messageMe  chat_message_cornerSvg"} />
                }
                <span className="chat_name">{y.name}</span>
            </div>)

            else return (<div key={msg.createdAt} ref={scrollRef}>
                {
                    msg.type === 'audio' ?
                        <AudioSnippet msg={msg} chatBodyRef={chatBodyRef} />
                        : <MessageSnippet msg={msg} chatBodyRef={chatBodyRef} />
                }
            </div>)
        }))
    }

    const handleSend = async (data, type, audioDuration) => {
       
        const receiver = selectedConvo.members.filter((mem) => mem._id !== userProfile.userId)[0]._id;

        const msg = {
            uuid: uuid(),
            by: userProfile.userId,
            text: type === 'text' ? data : "",
            conversationId: selectedConvo._id,
            type: type,
            audioPath: "",
            audioDuration: audioDuration,
            imgPath: "",
            createdAt: new Date(),
            messageStatus: status === "Online" ? "RECEIVED" : "SENT"
        };

        setChatList(prevChatList => {
            const temp = [...prevChatList];
            const indx = temp.findIndex(conv => conv._id === msg.conversationId);
            temp[indx].lastMessage = msg;

            const tempConvo = temp[indx];
            temp.splice(indx, 1);
            temp.splice(0, 0, { ...tempConvo })

            return [...temp];
        })

        if (type === "text") {
            setMessages(prev => [...prev, { ...msg }]);
            socket.emit("sendMessage", { ...msg, receiverId: receiver });
        }

        setSelectedConvo({ ...selectedConvo, lastMessage: { ...msg } })

        const formData = new FormData();
        if (selectedFile) {
            formData.append("ImageUpload", selectedFile, selectedFile.name);
        }
        if (type === 'audio') {
            console.log("handleSend: ", data)
            formData.append("AudioUpload", data, "myfile");
            formData.append("audioDuration", audioDuration);
        }

        console.log("PREPARING MESSAGE", msg.by, msg.text, msg.type, msg.messageStatus);
        formData.append("convoId", selectedConvo._id);
        formData.append("uuid", msg.uuid);
        formData.append("text", msg.text);
        formData.append("type", msg.type);
        formData.append("by", msg.by);
        formData.append("messageStatus", msg.messageStatus);

        let msgData;
        if (msg.type === "audio") {
            try {
                const response = await postAudioMessage(formData, selectedConvo._id);
                if (response.status !== 200) {
                    setOpenStrip(true);
                    setStripMessage("Error sending message");
                    return;
                }
                msgData = response.data.result;
            } catch (error) {
                console.log(error);
                setOpenStrip(true);
                setStripMessage(error);
            }
        }

        else {
            try {

                const response = await postMessage(formData, selectedConvo._id);
                if (response.status !== 200) {
                    setOpenStrip(true);
                    setStripMessage("Error sending message");
                    return;
                }
                msgData = response.data.result;
            } catch (error) {
                console.log(error);
                setOpenStrip(true);
                setStripMessage(error);
            }
        }
        setSelectedFile(undefined);

        if (msgData.type === "image" || msgData.type === 'audio') {
            socket.emit("sendMessage", { ...msg, receiverId: receiver });
            requestMessages(msgData.conversationId);
        }
    }



    return <ChatContext.Provider value={
        {
            y, status, setStatus, selectedFile, 
            setSelectedFile, preview, setPreview, chatBodyRef, handleSend, render
        }}
    > {props.children} </ChatContext.Provider>
}


export default ChatContext;