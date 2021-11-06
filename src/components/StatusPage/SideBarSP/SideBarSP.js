import React, { useContext, useEffect, useRef } from 'react';
import './SideBarSP.css';
import SidebarSPTile from './SidebarSPTile/SidebarSPTile';

import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import AppContext from '../../../Contexts/app-context';

function SideBarSP(props) {

    const imgRef = useRef();
    const { setOpenStrip,  setStripMessage} = useContext(AppContext);

 
    useEffect(() => {
        if (!props.MyStatusFile) {
            props.setPreview(undefined)
            imgRef.current.value = "";
            return
        }

        const typeArray = [
            'image/png',
            'image/jpeg',
            'image/jpg',

        ]
        const fileType = props.MyStatusFile.type;

        if (!typeArray.includes(fileType)) {
            setOpenStrip(true);
            setStripMessage("Please select appropriate image file type");
            return;
        } else {


            const objectUrl = URL.createObjectURL(props.MyStatusFile);
            props.setPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl)
        }
    }, [props.MyStatusFile]);

    const onFileChange = (e) => {

        if (!e.target.files || e.target.files.length === 0) {
            props.setMyStatusFile(undefined)
            return
        }
        props.setMyStatusFile(e.target.files[0])
    }

    return (
        <div className="SideBarSP">
            <div className="SidebarProfile_Header">
                <SidebarSPTile type="MY" name={"My Status"} statusArray={props.allMyStatus} createdAt={props.allMyStatus.length > 0 ? props.allMyStatus[props.allMyStatus?.length - 1]?.createdAt : null} imagePath={props.allMyStatus.length > 0 ? props.allMyStatus[props.allMyStatus?.length - 1].statusImagePath : null} mainIndex={0} />

                <div className="addStatusButton" onClick={() => { imgRef.current.click() }}>
                    <input ref={imgRef} hidden={true} className="file-upload" type="file" onChange={(e) => onFileChange(e)} />
                    <DonutLargeIcon />
                </div>

            </div>
            <div className="sidebarTilesWrapper">

                {props.statusList.length > 0 ?
                    <div className="sidebarSeperator">
                        <p>RECENT</p>
                    </div>
                    : null
                }
                {
                    props.statusList ?
                        props.statusList.map((single, index) => <SidebarSPTile type="RECENT" key={single.user._id} name={single.user.name} statusArray={single.statusArray} createdAt={single.statusArray[single.statusArray.length - 1].createdAt} imagePath={single.statusArray[single.statusArray.length - 1].statusImagePath} mainIndex={index} />)
                        : null
                }

                {
                    props.viewedStatusList ?
                        <div className="sidebarSeperator">
                            <p>VIEWED</p>
                        </div>
                        : null
                }
                {
                    props.viewedStatusList ?
                        props.viewedStatusList.map((single, index) => <SidebarSPTile type="VIEWED" key={single.user._id} name={single.user.name} statusArray={single.statusArray} createdAt={single.statusArray[single.statusArray.length - 1].createdAt} imagePath={single.statusArray[single.statusArray.length - 1].statusImagePath} mainIndex={index} />) : null
                }

            </div>

        </div>
    )
}

export default SideBarSP
