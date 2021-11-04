import React, { useContext, useState, useEffect, useRef } from 'react';
import './Carousel.css';

import ClearIcon from '@material-ui/icons/Clear';
import { Avatar } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AppContext from '../../Contexts/app-context';
import ChatRoomContext  from '../../Contexts/chatRoom-context';

function Carousel() {
    const {showCarousel, setShowCarousel, carouselImg, setCarouselImg} = useContext(ChatRoomContext);
    const {messages, selectedConvo} = useContext(ChatRoomContext);
    const {userProfile} = useContext(AppContext);

    const [beforeSet, setBeforeSet] = useState([]);
    const [afterSet, setAfterSet] = useState();
    const [viewIndex, setViewIndex] = useState();

    const viewRef = useRef();
    const imageSetRef = useRef();

    useEffect(() => {
        if(!showCarousel) return;
    }, [showCarousel])

    let filteredMsgs;
    
    const temp = messages?.filter(msg => {
        if (msg.type === "image") return true;
        return false
    });

  
    
    filteredMsgs = temp;
    useEffect(() => {
        const t = filteredMsgs.findIndex(msg => (msg.imgPath === carouselImg));
        setViewIndex(t);
        console.log(filteredMsgs[viewIndex]);
    }, [carouselImg]);
    
    
    useEffect(() => {
        if (viewIndex === undefined) return;
        const bs = [...filteredMsgs].slice(0, viewIndex);
        if (viewIndex !== 0) setBeforeSet(bs);
        else setBeforeSet([]);
        console.log(bs);
        
        const as = [...filteredMsgs].slice(viewIndex + 1);
        setAfterSet(as);
        console.log(as);
        
    }, [viewIndex])
    
    
    useEffect(() => {
        if (!imageSetRef || !beforeSet || !afterSet) return;
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        imageSetRef.current.scroll(
            {
                left: 0.45 * vw + 0.10 * vw * (viewIndex - 1) - 0.285 * vw,
                behavior: 'smooth'
            })
        }, [imageSetRef, carouselImg, beforeSet, afterSet])
        
        
        
        const handleClick = (command) => {
            
            if (command === "prev" && viewIndex > 0) setCarouselImg((filteredMsgs[viewIndex - 1]).imgPath)
            else if (command === "next" && viewIndex < filteredMsgs.length - 1) setCarouselImg((filteredMsgs[viewIndex + 1]).imgPath)
            else setShowCarousel(false);
        }
        
        const t = selectedConvo?.members;
        const y = t?.find((mem) => mem.userId !== userProfile.userId)
        
        let timeStamp;
        timeStamp = new Date(filteredMsgs[viewIndex]?.createdAt);
        console.log(y)

        return (
            <div className="Carousel"  style={{
                transform: showCarousel ? 'translateX(0)' : 'translateX(100vw)',
                opacity: showCarousel ? '1' : '0'
            }}>
            <header className="Carousel_Header">
                <div className="Carousel_Left">
                    <div>
                        {(filteredMsgs[viewIndex]?.by === userProfile?.userId)? ( userProfile?.profileImagePath? (<img src={userProfile?.profileImagePath} alt="sender" />): <Avatar />) : (y?.profileImagePath? (<img src={y?.profileImagePath} alt="sender" />): <Avatar />)}
                    </div>
                    <div className="sender_info">
                        <p>{(filteredMsgs[viewIndex]?.by === userProfile?.userId) ? "You" : y?.name}</p>
                        <p style={{color: "#919191", fontSize: "0.8rem", marginTop: "0.2rem"}}>{timeStamp?.getDay() + "/" + timeStamp?.getMonth() + "/" + timeStamp?.getFullYear() + " at " + timeStamp?.getHours() + ":" + timeStamp?.getMinutes()}</p>
                    </div>

                </div>

                <div className="Carousel_Left" >
                    <ClearIcon style={{ cursor: 'pointer' }} onClick={() => { setShowCarousel(false) }} />
                </div>
            </header>



            <div className="displayImage">
                <div className="ChevronLeftIcon" onClick={() => { handleClick("prev") }}>
                    <ChevronLeftIcon />
                </div>
                <img src={carouselImg} alt="msgImage" />
                <div className="ChevronRightIcon" onClick={() => { handleClick("next") }}>
                    <ChevronRightIcon />
                </div>
            </div>



            <div className="hr"></div>
            <div className="imageSet" ref={imageSetRef}>
                <div>
                    <section className="blankSet"></section>
                </div>
                <section className="beforeSet">
                    {beforeSet ? beforeSet.map(msg => (<img key={msg.imgPath} onClick={() => { setCarouselImg(msg.imgPath) }} src={msg.imgPath} alt="" />)) : null}
                </section>

                <section className="centreSet">
                    {carouselImg ? <img key={carouselImg} ref={viewRef} src={carouselImg} alt="" /> : null}
                </section>

                <section className="afterSet">
                    {afterSet ? afterSet.map(msg => (<img key={msg.imgPath} onClick={() => { setCarouselImg(msg.imgPath) }} src={msg.imgPath} alt="" />)) : null}
                </section>
                <div>
                    <section className="blankSet"></section>
                </div>
            </div>

        </div>
    )
}

export default Carousel;
