import React, { useContext } from 'react';
import { StatusPlayerContext } from '../StatusPage';
import './MyStatusUpdates.css';

function MyStatusUpdates(props) {

    const temp = new Date(props.createdAt);
    const {selectedStatusArray, setselectedStatusArray, mainIndex, setMainIndex, subIndex, setsubIndex, showMyStatus, setshowMyStatus} = useContext(StatusPlayerContext);


    const handleClick = () => {
        setshowMyStatus(true);
        setselectedStatusArray([...props.allMyStatus]);
        setMainIndex(0);
        setsubIndex(props.index);
    }

    return (
        <div className="MyStatusUpdates">
            <svg onClick={handleClick} height="90" width="90"  style={{ border:"1px solid white", borderRadius: "50%", cursor: 'pointer' ,background: `center / cover no-repeat url(${props.imageUrl})`}}>
            </svg>

            <span className="eyeSvgView lxozqee9" data-testid="status-v3-seen" data-icon="status-v3-seen" >
                <svg viewBox="0 0 30 30" width="30" height="30" >
                    <path fill="currentColor" d="M25.473 12.225a.871.871 0 0 1-.592-.232c-3.628-3.341-7.338-5.036-11.026-5.036-.233 0-.469.007-.702.021-4.711.275-8.243 3.179-9.93 4.885a.864.864 0 0 1-1.148.076l-.739-.583a.857.857 0 0 1-.083-1.273C3.213 8.076 7.345 4.66 12.998 4.33c.288-.017.581-.025.869-.025 4.385 0 8.709 1.944 12.854 5.777a.86.86 0 0 1 .017 1.232l-.663.663a.843.843 0 0 1-.602.248"></path>
                    <path fill="currentColor" d="M14 11.596a2.79 2.79 0 1 0 2.788 2.789v-.001A2.793 2.793 0 0 0 14 11.596m0 8.1a5.311 5.311 0 1 1 5.311-5.312A5.317 5.317 0 0 1 14 19.696"></path>
                </svg>
                {props.status.seenBy.length}
            </span>

            {props.createdAt ? <p className="tileTime">{temp.getDate === (new Date()).getDate ? "today" : "yesterday"} at {temp.getHours() > 12 ? temp.getHours() - 12 : temp.getHours()}:{temp.getMinutes() > 9 ? temp.getMinutes() : `0${temp.getMinutes()}`} {temp.getHours() > 12 ? "PM" : "AM"}</p>
                :
                <p className="tileTime" >No updates</p>
            }

        </div>
    )
}

export default MyStatusUpdates
