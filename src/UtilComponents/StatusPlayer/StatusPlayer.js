import React, { useContext, useEffect, useRef, useState } from 'react';
import './StatusPlayer.css';

import { CountdownCircleTimer } from 'react-countdown-circle-timer'


import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { StatusPlayerContext } from '../../components/StatusPage/StatusPage';
import { putStatusView } from '../../APIs/apiRequests';
import ChatRoomContext from '../../Contexts/chatRoom-context';

function StatusPlayer(props) {
    const { selectedStatusArray, setselectedStatusArray, mainIndex, setMainIndex, subIndex, setsubIndex, showType, setshowType, viewedStatusList, setviewedStatusList, statusList, setStatusList } = useContext(StatusPlayerContext);
    const { showStatusPage, setShowStatusPage } = useContext(ChatRoomContext);



    const [progressBars, setprogressBars] = useState();
    const [showPrev, setshowPrev] = useState(false);
    const [showNext, setshowNext] = useState(false);
    const [isTimerPlaying, setisTimerPlaying] = useState(true);
    const timeRef = useRef();

    const [time, setTime] = useState(11);



    useEffect(() => {
        if (selectedStatusArray) {
            setshowPrev(mainIndex <= 0 && subIndex <= 0 ? false : true);
            setshowNext(mainIndex >= props.statusList.length - 1 && subIndex >= selectedStatusArray.length - 1 ? false : true);
        }

        console.log(props.statusList[mainIndex], mainIndex);

    }, [mainIndex, subIndex])

    const intvRef = useRef();

    useEffect(() => {
        if (selectedStatusArray) {
            setisTimerPlaying(true)
            setbars();
            clearTimeout(timeRef.current);
            clearInterval(intvRef.current);
            intvRef.current = setInterval(() => {
                setTime(prev => prev - 1);
            }, 1000);

            timeRef.current = setTimeout(() => {
                handleNext();
                setTime(11);
            }, 12000);
            setTime(11);
        }

        if (showType !== "MY") {
            putStatusView(selectedStatusArray[subIndex]._id)
        }
    }, [selectedStatusArray, mainIndex, subIndex])

    const setbars = () => {

        const temp = selectedStatusArray.map((el, index) => {
            console.log(el, "ell");
            if (index <= subIndex) {
                return <div key={index} className="filledProgress" style={{ width: `${20 / selectedStatusArray.length}rem` }}></div>
            }
            else return <div key={index} className="unfilledProgress" style={{ width: `${20 / selectedStatusArray.length}rem` }}></div>
        })

        setprogressBars([...temp]);

    }


    const handlePrev = () => {
        if (subIndex <= 0) {
            if (mainIndex > 0) {
                setselectedStatusArray(props.statusList[mainIndex - 1].statusArray)
                setMainIndex(prev => prev - 1);
                setsubIndex(props.statusList[mainIndex - 1].statusArray.length - 1);
            }
        }
        else setsubIndex(prev => prev - 1);
    }

    const handleNext = () => {

        if (subIndex >= selectedStatusArray.length - 1) {
            if (props.statusList?.length - 1 <= mainIndex) {
                setisTimerPlaying(false)
                clearTimeout(timeRef.current);
                return
            }
            else {
                if (showType === "MY") {
                    setselectedStatusArray(props.statusList[mainIndex + 1].statusArray)
                    setMainIndex(prev => prev + 1);
                    setsubIndex(0);

                }

                isTimerPlaying(true);
            }

        } else {
            setsubIndex(prev => {
                return prev + 1;
            });
        }
    }



    const renderTime = ({ remainingTime }) => {

        return (
            <div className="timer">
                <div className="value">{isTimerPlaying ? time : "❤"}</div>
            </div>
        );
    };



    let temp = new Date(selectedStatusArray[subIndex].createdAt)

    return (
        <div className="StatusPlayer">
            <div className="statusPlayerBack"></div>
            <div className="statusPlayerDisplay">

                <header>
                    <div className="headerUp">

                        <div className="headerLeft" onClick={() => { setselectedStatusArray([]); setshowType("") }}>
                            <ArrowBackIcon />
                        </div>
                        <div className="headerMid">
                            {progressBars}
                        </div>
                        <div className="headerRight" onClick={() => {
                            setShowStatusPage(false);
                            setshowType("")
                            setselectedStatusArray([]);
                        }}>
                            <CloseIcon />
                        </div>
                    </div>
                    <div className="headerDown">
                        <p>
                            {showType === "MY" ? "You" : null}
                            {showType === "RECENT" ?  statusList[mainIndex]?.user.name : null}
                            {showType === "VIEWED" ?  viewedStatusList[mainIndex]?.user.name : null}
                        </p>
                        <p style={{ fontSize: "0.7rem", marginTop: '0.4rem' }}> {temp.getDate() === (new Date()).getDate() ? "Today" : "Yesterday"} at {temp.getHours() > 12 ? temp.getHours() - 12 : temp.getHours()}:{temp.getMinutes() > 9 ? temp.getMinutes() : `0${temp.getMinutes()}`} {temp.getHours() > 12 ? "PM" : "AM"}</p>
                    </div>
                </header>
                <div className="statusImage" style={{ background: showType === "MY" ? `center / contain no-repeat url(${selectedStatusArray[subIndex].statusImagePath})` : `center / contain no-repeat url(${selectedStatusArray[subIndex].statusImagePath})` }} >
                    {time !== -1 && time !== 11 ?
                        <div className="timer-wrapper">
                            <CountdownCircleTimer
                                size={32}
                                strokeWidth={3}
                                isPlaying={isTimerPlaying}
                                duration={10}
                                colors={[["#00BFA5"], ["#00BFA5"], ["#00BFA5"]]}
                                onComplete={() => [true, 1100]}
                            >
                                {renderTime}
                            </CountdownCircleTimer>

                        </div>
                        :
                        <span className="timer-wrapper" >
                            {"❤"}
                        </span>
                    }

                    {showPrev ? <div className="ChevronLeftIcon" onClick={handlePrev} >
                        <ChevronLeftIcon />
                    </div> : null}


                    {showNext ? <div className="ChevronRightIcon" onClick={handleNext}>
                        <ChevronRightIcon />
                    </div> : null}
                </div>
                {selectedStatusArray && selectedStatusArray[subIndex].caption ?
                    < footer >
                        <p> {selectedStatusArray[subIndex].caption} </p>
                    </footer>
                    : null}
            </div>
        </div >
    )
}

export default StatusPlayer
