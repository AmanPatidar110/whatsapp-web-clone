import React, { useContext } from "react";
import "./AudioSnippet.css";

import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import CircularProgress from "@mui/material/CircularProgress";
import { Avatar } from "@material-ui/core";

import { styled, useTheme } from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MicIcon from "@mui/icons-material/Mic";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import MessageDropdownMenu from "../../../../UtilComponents/MessageDropdownMenu/MessageDropdownMenu";
import AppContext from "../../../../Contexts/app-context";
import ChatRoomContext from "../../../../Contexts/chatRoom-context";

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

function AudioSnippet(props) {
  let audioRef;

  audioRef = useRef(new Audio(props.msg.audioPath));

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener(
        "loadedmetadata",
        function () {
          setduration(props.msg.audioDuration);
        },
        false
      );
    }
  }, [audioRef.current]);

  const { userProfile } = useContext(AppContext);
  const { selectedConvo, setSelectedConvo } = useContext(ChatRoomContext);

  let you = selectedConvo?.members.find(
    (mem) => mem._id !== userProfile.userId
  );
  const [duration, setduration] = useState();

  // const [, setShowCarousel, , setCarouselImg] = useCoṣntext(CarouselContext)

  let timeStamp = new Date(props.msg.createdAt);
  let hours = timeStamp.getHours();
  let minutes =
    timeStamp.getMinutes() < 10
      ? `0${timeStamp.getMinutes()}`
      : timeStamp.getMinutes();

  const theme = useTheme();
  const mainIconColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const [position, setPosition] = useState(0);
  const [paused, setPaused] = useState(true);

  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  const timerIdRef = useRef();

  useEffect(() => {
    if (paused && timerIdRef.current) {
      console.log("PAUSED");
      audioRef.current?.pause();
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }

    if (!paused) {
      console.log("PLYED");
      let timerID;
      timerID = setInterval(() => tick(), 1000);
      audioRef.current?.play();
      timerIdRef.current = timerID;
    }
  }, [paused]);

  useEffect(() => {
    if (position && audioRef.current) audioRef.current.currentTime = position;
  }, [position, audioRef.current]);

  const tick = () => {
    setPosition((prev) => {
      if (prev === duration) {
        audioRef.current?.pause();
        setPaused(true);
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <div
      className={props.className + " chat_message MessageSnippet AudioSnippet"}
    >
      <div className="message AudioMessage">
        {you && you.profileImagePath && userProfile.profileImagePath ? (
          <img
            src={
              you._id === props.msg.by
                ? you.profileImagePath
                : userProfile.profileImagePath
            }
            alt="You"
          ></img>
        ) : (
          <Avatar />
        )}

        <span className="MicIcon">
          {" "}
          <MicIcon />{" "}
        </span>

        {duration ? (
          <IconButton
            aria-label={paused ? "play" : "pause"}
            onClick={() => setPaused(!paused)}
          >
            {paused ? (
              <PlayArrowRounded
                sx={{ fontSize: "3rem" }}
                htmlColor={mainIconColor}
              />
            ) : (
              <PauseRounded
                sx={{ fontSize: "3rem" }}
                htmlColor={mainIconColor}
              />
            )}
          </IconButton>
        ) : (
          <CircularProgress className={"Playloader"} color="secondary" />
        )}

        <Slider
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
          aria-label="time-indicator"
          size="small"
          value={position}
          min={0}
          step={1}
          max={duration ? duration : 0}
          onChange={(_, value) => setPosition(value)}
          sx={{
            width: "12rem",
            position: "absolute",
            left: "6.5rem",
            color: theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
            height: 4,
            "& .MuiSlider-thumb": {
              width: 8,
              height: 8,
              transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
              "&:before": {
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
              },
              "&:hover, &.Mui-focusVisible": {
                boxShadow: `0px 0px 0px 8px ${
                  theme.palette.mode === "dark"
                    ? "rgb(255 255 255 / 16%)"
                    : "rgb(0 0 0 / 16%)"
                }`,
              },
              "&.Mui-active": {
                width: 20,
                height: 20,
              },
            },
            "& .MuiSlider-rail": {
              opacity: 0.28,
            },
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(position)}</TinyText>
        </Box>
      </div>
      <p className="chat_timestamp">
        {hours < 12 ? `${hours}:${minutes} AM` : `${hours - 12}:${minutes} PM`}
        <span>
          {props.msg && props.msg.messageStatus === "SENT" ? (
            <CheckIcon />
          ) : null}
          {props.msg && props.msg.messageStatus === "RECEIVED" ? (
            <DoneAllIcon />
          ) : null}
          {props.msg && props.msg.messageStatus === "SEEN" ? (
            <DoneAllIcon style={{ color: "#4FC3F7" }} />
          ) : null}
        </span>
      </p>

      <span className="sender_svg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 8 13"
          width="8"
          height="13"
        >
          <path
            opacity=".13"
            d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"
          ></path>
          <path
            fill="currentColor"
            d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"
          ></path>
        </svg>
      </span>

      <MessageDropdownMenu
        chatBodyRef={props.chatBodyRef}
        uuid={props.msg.uuid}
      />
    </div>
  );
}

export default AudioSnippet;
