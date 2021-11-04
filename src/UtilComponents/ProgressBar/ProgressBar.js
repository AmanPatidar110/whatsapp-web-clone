import React, { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import './ProgressBar.css';
import logo from '../../Assests/images/whlogo.png'

function ProgressBar() {
    const [progress, setProgress] = React.useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = Math.random() * 20;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);

        return () => {
            setProgress(100);
            clearInterval(timer);
        };
    }, []);
    return (

        <Stack sx={{ width: '40%', color: 'grey' }} className={"ProgressBar"} spacing={2}>

            <div className="login_cardLogo">
                <img src={logo} alt="" />
            </div>
            <LinearProgress variant="determinate" value={progress} />
        </Stack>

    )
}

export default ProgressBar
