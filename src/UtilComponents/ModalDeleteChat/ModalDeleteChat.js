import { React, useState, useContext, useEffect, Fragment } from 'react';
import './ModalDeleteChat.css';


import 'react-phone-input-2/lib/style.css'


import { deleteChat, getChatList } from '../../APIs/apiRequests';

import { socket } from '../../UtilComponents/Sockect.io/socket';
import AppContext from '../../Contexts/app-context';
import ChatRoomContext from '../../Contexts/chatRoom-context';

function ModalDeleteChat() {

    const { showModalDeleteChat, setShowModalDeleteChat } = useContext(ChatRoomContext);


    const { selectedConvo, setSelectedConvo } = useContext(ChatRoomContext);
    const { setMessages, requestMessages } = useContext(ChatRoomContext);
    const { chatList, setChatList } = useContext(ChatRoomContext);
    const { userProfile, setUserProfile, setOpenStrip, setStripMessage } = useContext(AppContext);


    let y = selectedConvo?.members.find((mem) => mem._id !== userProfile.userId);


    const func = async () => {
        try {
            const temp1 = await getChatList(userProfile.userId);
            setChatList(() => {
                const tempList = temp1.data.map(convo => convo.conversationId);
                return tempList;
            });
            setSelectedConvo(null);

        } catch (error) {
            console.log(error);
            setOpenStrip(true);
            setStripMessage(error);
        }
    }

    useEffect(() => {
        if (userProfile) {
            socket.on("getDeleteChat", func);
        }

        return () => {
            socket.off("getDeleteChat", func);
        };
    }, [userProfile]);

    const onSubmitHandler = async (F) => {
        let response;
        console.log(F + "..................")
        if (F === "DFM") {
            try {
                response = await deleteChat(selectedConvo._id, y._id, "dfm");
                if (response.status !== 200) {
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
                response = await deleteChat(selectedConvo._id, y._id, "dfe");
                if (response.status === 200)
                    socket.emit("deleteChat", { convoId: selectedConvo._id, receiverId: y._id });

                if (response.status !== 200 && F === "DFE") {
                    setOpenStrip(true);
                    setStripMessage("Unable to delete chat!");
                    return;
                }
            } catch (error) {
                console.log(error);
                setOpenStrip(true);
                setStripMessage(error);
            }
        }


        setShowModalDeleteChat(false);
        requestMessages(selectedConvo._id);
        setMessages([]);
        try {
            const { data, status } = await getChatList();
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

    return (
        <Fragment>
            {showModalDeleteChat ? <div className="Backdrop" onClick={() => { setShowModalDeleteChat(false) }} ></div> : null}

            <div className="Modal Delete_Confirmation_Modal"
                style={{
                    transform: showModalDeleteChat ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: showModalDeleteChat ? '1' : '0'
                }}>

                <div>
                    <form className="login_cardForm" >
                        <p className="confirm_prompt">
                            Are you sure you wanna delete this chat with {y?.name}?
                        </p>

                        <div className="Delete_Confirmation_Buttons">

                            <p type="submit" className="login_cardButton Delete_Confirmation" onClick={() => { onSubmitHandler("DFM") }} >DELETE FOR ME</p>
                            <p type="submit" className="login_cardButton Delete_Confirmation" onClick={() => { setShowModalDeleteChat(false) }} >CANCEL</p>
                            <p type="submit" className="login_cardButton Delete_Confirmation" onClick={() => { onSubmitHandler("DFE") }} >DELETE FOR EVERYONE</p>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default ModalDeleteChat
