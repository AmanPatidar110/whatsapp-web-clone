import { React, useState, useContext, useEffect, Fragment, memo } from 'react';


import 'react-phone-input-2/lib/style.css'

import { deleteMessage, getChatList } from '../../APIs/apiRequests';

import { socket } from '../Sockect.io/socket';
import AppContext from '../../Contexts/app-context';
import ChatRoomContext from '../../Contexts/chatRoom-context';

function ModalDeleteMessage() {

    const { showModalDeleteMessage, setShowModalDeleteMessage, selectedMsg, setSelectedMsg } = useContext(ChatRoomContext);

    const { requestMessages, selectedConvo, setSelectedConvo } = useContext(ChatRoomContext);
    const { chatList, setChatList } = useContext(ChatRoomContext);
    const { userProfile, setOpenStrip, setStripMessage } = useContext(AppContext);


    let y = selectedConvo?.members.find((mem) => mem._id !== userProfile.userId);


    const func = async (data) => {
        if (selectedConvo._id === data.convoId) {
            try {

                requestMessages(data.convoId);

                const { data, status } = await getChatList(userProfile.userId);
                if (status === 200) {

                    setChatList(() => {
                        const tempList = data.map(convo => convo.conversationId);
                        return tempList;
                    });
                    setSelectedConvo(null);
                } else {
                    throw new Error("Something went worng while fetching chat list!")
                }
            } catch (error) {
                console.log(error);
                setOpenStrip(true);
                setStripMessage(error);
            }
        }
    }

    useEffect(() => {
        if (userProfile) {
            socket.on("getDeleteMessage", func);
        }

        return () => {
            socket.off("getDeleteMessage", func);
        };
    }, [userProfile]);

    const onSubmitHandler = async (F) => {
        let response;
        console.log(F + "..................")
        if (F === "DFM") {
            try {
                response = await deleteMessage(selectedMsg, selectedConvo._id, y._id, "dfm");
                if (!response || response.status !== 200) {
                    throw new Error("Something went worng!")
                }

            } catch (error) {
                console.log(error);
                setOpenStrip(true);
                setStripMessage(error);
            }
        }
        else if (F === "DFE") {
            try {
                response = await deleteMessage(selectedMsg, selectedConvo._id, y._id, "dfe");
                if (response.status === 200)
                    socket.emit("deleteMessage", { convoId: selectedConvo._id, receiverId: y._id });
                else {
                    throw new Error("Something went worng! Unable to delete message.")
                }                
            } catch (error) {
                console.log(error);
                setOpenStrip(true);
                setStripMessage(error);
            }
        }


        try {
            const temp = await getChatList();
            if(temp.status === 200) {

                setChatList(() => {
                    const tempList = temp.data.map(convo => {
                        return { ...convo.conversationId, unseenCount: convo.unseenCount }
                    })
                    return [...tempList];
                });
                
                setShowModalDeleteMessage(false);
                setSelectedMsg(null)
                requestMessages(selectedConvo._id);
            } else {
                throw new Error("Something went worng!") 
            }
            
        } catch (error) {
            console.log(error);
            setOpenStrip(true);
            setStripMessage(error);
        }
    }

    return (
        <Fragment>
            {showModalDeleteMessage ? <div className="Backdrop" onClick={() => { setShowModalDeleteMessage(false); setSelectedMsg(null) }} ></div> : null}

            <div className="Modal Delete_Confirmation_Modal"
                style={{
                    transform: showModalDeleteMessage ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: showModalDeleteMessage ? '1' : '0'
                }}>

                <div>
                    <form className="login_cardForm" >
                        <p className="confirm_prompt">
                            Are you sure you wanna delete this chat with {y?.name}?
                        </p>

                        <div className="Delete_Confirmation_Buttons">

                            <p type="submit" className="login_cardButton Delete_Confirmation" onClick={() => { onSubmitHandler("DFM") }} >DELETE FOR ME</p>
                            <p type="submit" className="login_cardButton Delete_Confirmation" onClick={() => { setShowModalDeleteMessage(false); setSelectedMsg(null) }} >CANCEL</p>
                            <p type="submit" className="login_cardButton Delete_Confirmation" onClick={() => { onSubmitHandler("DFE") }} >DELETE FOR EVERYONE</p>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default memo(ModalDeleteMessage)
