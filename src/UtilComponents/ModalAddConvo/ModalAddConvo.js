import { React, useState, useContext, Fragment, memo } from 'react';

import './ModalAddConvo.css';



import { postConvo } from '../../APIs/apiRequests';


import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css';
import CircularProgress from '@mui/material/CircularProgress';


import { getChatList } from '../../APIs/apiRequests';
import AppContext from '../../Contexts/app-context';
import  ChatRoomContext  from '../../Contexts/chatRoom-context';

const ModalAddConvo = () => {

    const {showModalAddConvo, setShowModalAddConvo} = useContext(ChatRoomContext);
    const {userProfile, setOpenStrip, setStripMessage} = useContext(AppContext);

    const {setMessages, setSelectedConvo} = useContext(ChatRoomContext);

    const{ setChatList} = useContext(ChatRoomContext);


    const [number, setNumber] = useState("");
    const [isLoading, setisLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (number.length > 8) {
            setisLoading(true);
            postConvo("+" + number).then(async response => {
                if (response?.status === 202) {
                    setOpenStrip(true);
                    setStripMessage(response.data.message);
                    setisLoading(false)
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
                setisLoading(false)
            
            });

        }
        else {
                setStripMessage("Enter a valid phone number.")
                setOpenStrip(true);
                return;
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

                        <button type="submit" className="login_cardButton" disabled={isLoading} onClick={(e) => onSubmitHandler(e)} > { isLoading ? <CircularProgress  size={"1.1rem"}  style={{ color: "green"}}/> : "CHAT"}</button>
                    </form>
                </div>
            </div>
        </Fragment>)
}

export default memo(ModalAddConvo);