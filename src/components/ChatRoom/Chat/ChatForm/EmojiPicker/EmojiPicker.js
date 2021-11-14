import React, { useEffect, useRef } from 'react';
import Picker from 'emoji-picker-react';


function EmojiPicker(props) {



    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);

        };
    }, []);


    const onEmojiClick = (event, emojiObject) => {
        props.setMessage(prev => {
            console.log(prev + emojiObject.emoji)

            return prev += emojiObject.emoji
        })
    };

    const pickerRef = useRef();
    
    const handleClick = e => {
        if (pickerRef?.current?.contains(e.target)) {
            return;
        }

        if (!props.pickerIconRef.current?.contains(e.target))
            props.setOpenEPicker(false)
    };

    return (
        <div className="emojiPicker" ref={pickerRef} style={{
            transform: props.openEPicker ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: props.openEPicker ? '1' : '0'
        }}>
            <Picker onEmojiClick={onEmojiClick} />
        </div>
    )
}

export default EmojiPicker
