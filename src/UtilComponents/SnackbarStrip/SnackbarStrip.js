import React , {useState, useEffect, Fragment, useContext, useRef} from 'react';


import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AppContext from '../../Contexts/app-context';

function SnackbarStrip(props) {
    const {openStrip, setOpenStrip, stripMessage} = useContext(AppContext)

    const stripRef = useRef();

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = e => {
        if (stripRef?.current?.contains(e.target)) {
            return;
        }
        setOpenStrip(false)
    };


    return (
             <Snackbar
             ref={stripRef}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={openStrip}
                autoHideDuration={6000}
                message={stripMessage}
                action={
                    <Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={() => {setOpenStrip(false)}}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Fragment>
                }
            />
    )
}

export default SnackbarStrip;
