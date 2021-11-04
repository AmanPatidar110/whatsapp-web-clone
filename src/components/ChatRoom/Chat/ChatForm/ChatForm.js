import React, { useContext, useEffect, useRef, useState } from 'react';
import './ChatForm.css';

import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import EmojiPicker from './EmojiPicker/EmojiPicker';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import SendIcon from '@mui/icons-material/Send';


import AppContext from '../../../../Contexts/app-context';
import ChatRoomContext from '../../../../Contexts/chatRoom-context';
import ChatContext from '../../../../Contexts/chat-context';



function ChatForm(props) {

    const [openEPicker, setOpenEPicker] = useState(false);
    const [Time, setTime] = useState([0, 0]);
    const [TimerId, setTimerId] = useState();
    const [Message, setMessage] = useState("");
    const [IsRecording, setIsRecording] = useState(false)
    const [rec, setrec] = useState();

    const {setOpenStrip,  setStripMessage} = useContext(AppContext);
    const {selectedFile, setSelectedFile, setPreview} = useContext(ChatContext);
    const { setShowModalMicBlocked} = useContext(ChatRoomContext);

    const imgRef = useRef();
    const inputRef = useRef();
    const pickerIconRef = useRef();
    const TimeRef = useRef([0, 0]);

    useEffect(() => {
        if (inputRef.current)
            inputRef.current.value = Message;
        // console.log(inputRef.current)
    }, [Message])

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            imgRef.current.value = "";
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile]);

    const handleMessageChange = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        setMessage(event.target.value)
        if (event.key === 'Enter' && event.target.value.length > 0) {
            props.handleSend(event.target.value, "text");
            setMessage("");
            event.target.value = ""
        }
    }

    const onFileChange = (e) => {

        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        const typeArray = [
            'image/png',
            'image/jpeg',
            'image/jpg',

        ]
        const fileType = (e.target?.files[0])?.type;

        if (!typeArray.includes(fileType)) {
            setOpenStrip(true);
            setStripMessage("Please select appropriate image file type");
            return;
        }
        setSelectedFile(e.target.files[0])
    }


    const tick = () => {
        setTime(prevTime => {
            let m, s;

            if (prevTime[1] + 1 === 60) {
                m = prevTime[0] + 1
                s = 0
            } else {
                m = prevTime[0];
                s = prevTime[1] + 1;
            }
            TimeRef.current = [m, s]
            return [m, s];
        })
    }

    let timerID;



    let audioChunks = [];
    let blob
    let r;

    const handleStartRecording = () => {

        const permissions = navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        permissions.then((stream) => {
            r = new MediaRecorder(stream);

            r.start();
            timerID = setInterval(() => tick(), 1000);
            setTimerId(timerID);
            setIsRecording(true)

            r.ondataavailable = e => {
                console.log(e);
                audioChunks.push(e.data);

                if (r.state === "inactive") {
                    console.log(r);
                    blob = new Blob(audioChunks, { type: 'audio/webm' });

                    console.log(blob)
                    stream.getTracks().forEach(function (track) {
                        if (track.readyState === 'live') {
                            track.stop();
                        }
                    });
                    console.log("DURATION: ", TimeRef.current);
                    clearInterval(timerID);
                    setTime([0, 0])
                    setTimerId(null);
                    setIsRecording(false);

                    const myFile = new File([blob], "image.jpeg", {
                        type: blob.type
                    });
                    props.handleSend(myFile, "audio", TimeRef.current[0] * 60 + TimeRef.current[1])
                }
            }

            setrec(r);


        })
            .catch((err) => {
                setShowModalMicBlocked(true)
                console.log(`${err.name} : ${err.message}`)
            });

    }


    const handleCancleRecording = async (TODO) => {
        clearInterval(TimerId);
        setTimerId(null);
        setIsRecording(false);
        setTime([0, 0])

        // let file = await fetch(mediaBlobUrl).then((r) => r.blob())
        // .then(r => r.blob())
        // .then(blobFile => new File([blobFile], "fileNameGoesHere", { type: "audio/wav" }))


        // props.handleSend(blob, "audio");


    }




    return (
        <div className="chat_footer">

            <EmojiPicker setMessage={setMessage} openEPicker={openEPicker} setOpenEPicker={setOpenEPicker} pickerIconRef={pickerIconRef} />

            <div className="pickerIcon" ref={pickerIconRef} onClick={() => { setOpenEPicker(!openEPicker) }}>
                <InsertEmoticonIcon />
            </div>


            <div className="add_img" onClick={() => { imgRef.current.click() }} >
                <CameraAltIcon />
                <input ref={imgRef} hidden={true} className="file-upload" type="file" onChange={(e) => onFileChange(e)} />
            </div>

            <input type="text" ref={inputRef} onKeyUp={(event) => handleMessageChange(event)} placeholder="Type a message" />
            {Message?.length > 0 ? <SendIcon onClick={() => {
                props.handleSend(inputRef.current.value, "text");
                setMessage("");
            }
            } /> : null}

            {!IsRecording && Message?.length === 0 ? <MicIcon onClick={handleStartRecording} /> : null}

            {IsRecording ? <div className="AudioRecordingPanel" >
                <div onClick={() => handleCancleRecording("CANCEL")} className="recordCancelBtn"> <ClearIcon color={"red"} /> </div>
                <p className="recordingTimer" >{Time[0]}:{Time[1] < 10 ? 0 : null}{Time[1]}</p>
                <div onClick={() => rec.stop()} className="recordSendBtn"> <DoneIcon /> </div>
            </div> : null}
        </div>
    )
}

export default ChatForm;
