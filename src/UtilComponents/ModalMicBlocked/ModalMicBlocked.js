import { React, useState, useContext, useEffect, Fragment, memo } from 'react';
import ChatRoomContext from '../../Contexts/chatRoom-context';
import './ModalMicBlocked.css'

function ModalDeleteChat() {

    const {showModalMicBlocked, setShowModalMicBlocked} = useContext(ChatRoomContext)


    return (
        <Fragment>
            {showModalMicBlocked ? <div className="Backdrop backdrop" onClick={() => { setShowModalMicBlocked(false) }} ></div> : null}

            <div className="Modal MicBLockedModal"
                style={{
                    transform: showModalMicBlocked ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: showModalMicBlocked ? '1' : '0'
                }}>

                <div className="login_cardForm" >
                    <h4>Allow microphone</h4>
                    <p className="confirm_prompt">
                        To record Voice Messages, WhatsApp needs access to your microphone. Click <span class="chrome-media-icon"></span> in the URL bar and choose “Always allow web.whatsapp.com to access your microphone.”
                    </p>

                    <button type="submit" className="login_cardButton" onClick={(e) => setShowModalMicBlocked(false)}  >OK, GOT IT</button>

                </div>
            </div>
        </Fragment>
    )
}

export default memo(ModalDeleteChat)
