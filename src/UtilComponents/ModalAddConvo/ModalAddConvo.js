import { React, useState, useContext, Fragment } from 'react';

import './ModalAddConvo.css';



import { postConvo } from '../../APIs/apiRequests';


import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import { getChatList } from '../../APIs/apiRequests';
import AppContext from '../../Contexts/app-context';
import  ChatRoomContext  from '../../Contexts/chatRoom-context';

const ModalAddConvo = () => {

    const {showModalAddConvo, setShowModalAddConvo} = useContext(ChatRoomContext);
    const {userProfile, setOpenStrip, setStripMessage} = useContext(AppContext);

    const {setMessages, setSelectedConvo} = useContext(ChatRoomContext);

    const{ setChatList} = useContext(ChatRoomContext);


    const [number, setNumber] = useState();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (number) {
            postConvo("+" + number).then(async response => {
                console.log(response?.data.selectedConvo);
                if (response?.status === 202) {
                    setOpenStrip(true);
                    setStripMessage(response.data.message)
                    return;
                }
                else if (response?.status === 200 || response?.status === 201) {
                    try {
                        const temp = await getChatList(userProfile.userId);
                        setChatList(() => {
                            const tempList = temp.data.map(convo => convo.conversationId);
                            return tempList;
                        });
                        setMessages([]);
                        setSelectedConvo({ ...response?.data.selectedConvo });
                        setShowModalAddConvo(false);
                        
                    } catch (error) {
                        console.log(error);
                        setOpenStrip(true);
                        setStripMessage(error);
                    }
                }
            
            });

        }
    }

    return (
        <Fragment>
            {showModalAddConvo ? <div className="Backdrop" onClick={() => { setShowModalAddConvo(false) }} ></div> : null}

            <div className="Modal"
                style={{
                    transform: showModalAddConvo ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: showModalAddConvo ? '1' : '0'
                }}>

                <div className="login_card" >
                    <form className="login_cardForm" >
                        <PhoneInput
                            country={'in'}
                            onChange={phone => setNumber(phone)}
                            onKeyDown={(e) => { if (e.key === "Enter") onSubmitHandler(e) }}
                        />

                        <button type="submit" className="login_cardButton" onClick={(e) => onSubmitHandler(e)}  >Chat</button>
                    </form>
                </div>
            </div>
        </Fragment>)
}

export default ModalAddConvo;