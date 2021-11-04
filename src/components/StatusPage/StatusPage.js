import React, { useContext, useState, useEffect, useRef, createContext } from 'react';
import './StatusPage.css';

import ClearIcon from '@material-ui/icons/Clear';
import { Avatar } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';


import SideBarSP from './SideBarSP/SideBarSP';
import ImagePreview from '../../UtilComponents/ImagePreview/ImagePreview';
import { getStatusList, postStatus } from '../../APIs/apiRequests';
import StatusPlayer from '../../UtilComponents/StatusPlayer/StatusPlayer';
import MyStatusUpdates from './MyStatusUpdates/MyStatusUpdates';
import AppContext from '../../Contexts/app-context';
import ChatRoomContext from '../../Contexts/chatRoom-context';

export const StatusPlayerContext = createContext();

function StatusPage() {

    const { showStatusPage, setShowStatusPage } = useContext(ChatRoomContext);
    const { userProfile, setOpenStrip, setStripMessage } = useContext(AppContext);



    const [preview, setPreview] = useState();
    const [MyStatusFile, setMyStatusFile] = useState();
    const [statusList, setStatusList] = useState([]);
    const [viewedStatusList, setviewedStatusList] = useState([]);
    const [selectedStatusArray, setselectedStatusArray] = useState([]);
    const [mainIndex, setMainIndex] = useState();
    const [subIndex, setsubIndex] = useState();
    const [showMyStatus, setshowMyStatus] = useState(false);

    const [allMyStatus, setallMyStatus] = useState([]);

    const func = async () => {
        try {
            const response = await getStatusList();
            if (response.status === 200) {
                setStatusList(response.data.statusList);
                setviewedStatusList(response.data.viewedStatusList);
                setallMyStatus(response.data.allMyStatus);
            } else {
                console.error("StatusPage: func()", response);
                throw new Error("Something went worng!")
            }
        } catch (error) {
            console.log(error);
            setOpenStrip(true);
            setStripMessage(error);
        }
    }

    useEffect(() => {

        if (showStatusPage)
            func();
    }, [showStatusPage])



    const handleStatusUpload = async (caption) => {
        try {
            const response = await postStatus(MyStatusFile, caption);

            if (response.status === 200) {
                setOpenStrip(true);
                setStripMessage("Your status updated successfully!");
            } else {
                console.error("StatusPage: func()", response);
                throw new Error("Something went worng!")
            }

            setMyStatusFile(undefined);
            func();

        } catch (error) {
            console.log(error);
            setOpenStrip(true);
            setStripMessage(error);
        }
    }

    return (
        <div className="StatusPage" style={{
            transform: showStatusPage ? 'translateX(0)' : 'translateX(100vw)',
            opacity: showStatusPage ? '1' : '0'
        }}>
            <StatusPlayerContext.Provider value={[selectedStatusArray, setselectedStatusArray, mainIndex, setMainIndex, subIndex, setsubIndex, showMyStatus, setshowMyStatus]} >



                <SideBarSP allMyStatus={allMyStatus} MyStatusFile={MyStatusFile} setMyStatusFile={setMyStatusFile} setPreview={setPreview} statusList={statusList} viewedStatusList={viewedStatusList} />

                {preview ?
                    <div className="previewBackdrop">
                        <ImagePreview uploadType={"STATUS"} handleSend={handleStatusUpload} setMyStatusFile={setMyStatusFile} preview={preview} />
                    </div>
                    :
                    <div className="SPClearIcon" >
                        <ClearIcon style={{ cursor: 'pointer' }} onClick={() => { setShowStatusPage(false) }} />
                    </div>
                }
                {
                    selectedStatusArray?.length > 0 ?

                        <StatusPlayer statusList={statusList} />

                        :
                        <div className="SPClearIcon" >
                            <ClearIcon style={{ cursor: 'pointer' }} onClick={() => { setShowStatusPage(false) }} />
                        </div>

                }


                <div className="statusPagebanner">
                    {allMyStatus.length === 0 ?
                        <div className="statusPagebanner">
                            <DonutLargeIcon />
                            <p>Click on a contact to view their status updates</p>
                        </div>
                        :
                        <div>
                            <h2 style={{ color: "white", fontWeight: "500", marginBottom: "2rem" }}>View your updates</h2>
                            <div className="statusFlex">
                                {allMyStatus.map((single, index) => {
                                    return <MyStatusUpdates key={single.createdAt} allMyStatus={allMyStatus} status={single} createdAt={allMyStatus[index].createdAt} imageUrl={allMyStatus[index].statusImagePath} index={index} />
                                })}
                            </div>
                        </div>
                    }
                </div>

            </StatusPlayerContext.Provider >
        </div>
    )
}

export default StatusPage
