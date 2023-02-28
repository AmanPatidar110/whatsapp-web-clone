import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import MessageSnippet from "../components/ChatRoom/Chat/MessageSnippet/MessageSnippet";

import {
  postAudioMessage,
  postMessage,
  postSetReceivedMessages,
  postSetSeenMessages,
} from "../APIs/apiRequests";

import AudioSnippet from "../components/ChatRoom/Chat/AudioSnippet/AudioSnippet";

import { socket } from "../UtilComponents/Sockect.io/socket";

import uuid from "react-uuid";
import AppContext from "./app-context";
import ChatRoomContext from "./chatRoom-context";

const ChatContext = createContext();

export const ChatContextProvider = (props) => {
  const chatBodyRef = useRef();

  const { userProfile, setOpenStrip, setStripMessage, storageOnComplete } =
    useContext(AppContext);
  const {
    messages,
    setMessages,
    requestMessages,
    selectedConvo,
    setSelectedConvo,
    chatList,
    setChatList,
  } = useContext(ChatRoomContext);

  const [render, setRender] = useState();
  const [status, setStatus] = useState();

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  const you = useMemo(() => {
    return selectedConvo?.members.find((mem) => mem._id !== userProfile.userId);
  }, [selectedConvo]);

  const scrollRef = useRef();

  useEffect(() => {
    if (selectedConvo && userProfile && you) {
      postSetSeenMessages(you?._id, userProfile.userId, selectedConvo?._id)
        .then((response) => {
          console.log(
            "CHECKKKK SEND SEEN MESSAGES",
            you?._id,
            userProfile.userId,
            selectedConvo?._id
          );

          socket.emit("sendSeenMessages", {
            msgSender: you?._id,
            msgReceiver: userProfile.userId,
            convoId: selectedConvo?._id,
          });
        })
        .catch((err) => console.log(err));
    }
  }, [selectedConvo]);

  const socketStatus = async (data) => {
    if (you?._id === data.userId) {
      let d = new Date(data?.lastSeen);
      let day;

      if (d.getDay() === new Date().getDay()) day = "Today";
      else if (d.getDay() === new Date().getDay() - 1) day = "Yesterday";
      else day = `on ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;

      let hours = d?.getHours();
      let minutes =
        d?.getMinutes() < 10 ? `0${d?.getMinutes()}` : d?.getMinutes();

      let time =
        `Last seen ${day} at ` +
        (hours < 12 ? `${hours}:${minutes} AM` : `${hours - 12}:${minutes} PM`);

      data.online ? setStatus("Online") : setStatus(time);

      if (data?.online) {
        setMessages((prevMessages) => {
          const temp = [...prevMessages];
          const newMsgs = temp.map((msg) => {
            if (
              msg.by === userProfile.userId &&
              msg.messageStatus === "SENT" &&
              msg.conversationId === selectedConvo?._id
            )
              msg.messageStatus = "RECEIVED";
            return { ...msg };
          });

          return [...newMsgs];
        });
      }
    }

    if (data && data.online && chatList) {
      setChatList((prevChatList) => {
        const temp = [...prevChatList];
        const newChat = temp.map((convo) => {
          if (
            convo.members?.some((mem) => mem._id === data.userId) &&
            convo.lastMessage &&
            convo.lastMessage.messageStatus === "SENT"
          )
            convo.lastMessage.messageStatus = "RECEIVED";
          return convo;
        });

        return [...newChat];
      });
    }

    if (data && userProfile && data.online) {
      postSetReceivedMessages(userProfile.userId, data.userId);
    }
  };

  useEffect(() => {
    socket.on("updateActivity", socketStatus);
    socket.emit("getStatus", { userId: you?._id });
    if (selectedConvo) {
      socket.on("userActivity", socketStatus);
    }

    return () => {
      socket.off("userActivity", socketStatus);
      socket.off("updateActivity", socketStatus);
    };
  }, [selectedConvo]);

  useEffect(() => {
    if (messages) {
      spare();
    }
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [render]);

  const spare = () => {
    setRender(
      messages.map((msg) => {
        if (msg.by === userProfile.userId)
          return (
            <div key={msg.createdAt} ref={scrollRef}>
              {msg.type === "audio" ? (
                <AudioSnippet
                  msg={msg}
                  chatBodyRef={chatBodyRef}
                  className={"chat_messageMe  chat_message_cornerSvg"}
                />
              ) : (
                <MessageSnippet
                  msg={msg}
                  chatBodyRef={chatBodyRef}
                  className={"chat_messageMe  chat_message_cornerSvg"}
                />
              )}
              <span className="chat_name">{you?.name}</span>
            </div>
          );
        else
          return (
            <div key={msg.createdAt} ref={scrollRef}>
              {msg.type === "audio" ? (
                <AudioSnippet msg={msg} chatBodyRef={chatBodyRef} />
              ) : (
                <MessageSnippet msg={msg} chatBodyRef={chatBodyRef} />
              )}
            </div>
          );
      })
    );
  };

  const handleSend = async (data, type, audioDuration) => {
    const receiver = selectedConvo?.members?.filter(
      (mem) => mem._id !== userProfile.userId
    )[0]?._id;

    const msg = {
      uuid: uuid(),
      by: userProfile.userId,
      text: type === "text" ? data : "",
      conversationId: selectedConvo?._id,
      type: type,
      audioPath: "",
      audioDuration: audioDuration,
      imgPath: "",
      createdAt: new Date(),
      messageStatus: status === "Online" ? "RECEIVED" : "SENT",
    };

    setChatList((prevChatList) => {
      const temp = [...prevChatList];
      const indx = temp.findIndex((conv) => conv._id === msg.conversationId);

      temp[indx].lastMessage = msg;

      const tempConvo = temp[indx];
      temp.splice(indx, 1);
      temp.splice(0, 0, { ...tempConvo });

      return [...temp];
    });

    console.log("Inside handleSend -->", type === "audio");

    if (type === "text") {
      setMessages((prev) => [...prev, { ...msg }]);
      socket.emit("sendMessage", { ...msg, receiverId: receiver });
    }

    setSelectedConvo({ ...selectedConvo, lastMessage: { ...msg } });

    let audioUrl;
    let imageUrl;

    if (selectedFile) {
      imageUrl = await storageOnComplete("images", selectedFile);
      console.log(imageUrl);
    }

    if (type === "audio") {
      audioUrl = await storageOnComplete("voiceNotes", data);
    }

    const postData = {
      convoId: selectedConvo?._id,
      uuid: msg.uuid,
      text: msg.text,
      type: msg.type,
      by: msg.by,
      messageStatus: msg.messageStatus,
      audioPath: audioUrl,
      imgPath: imageUrl,
      audioDuration: audioDuration,
    };

    let msgData;

    try {
      const response = await postMessage({ ...postData });
      if (response.status !== 200) {
        setOpenStrip(true);
        setStripMessage("Error sending message");
        return;
      }
      msgData = response.data.result;
    } catch (error) {
      console.log(error);
      setOpenStrip(true);
      setStripMessage(error);
    }

    setSelectedFile(undefined);

    if (msgData?.type === "image" || msgData?.type === "audio") {
      socket.emit("sendMessage", { ...msg, receiverId: receiver });
      requestMessages(msgData.conversationId);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        y: you,
        status,
        setStatus,
        selectedFile,
        setSelectedFile,
        preview,
        setPreview,
        chatBodyRef,
        handleSend,
        render,
      }}
    >
      {" "}
      {props.children}{" "}
    </ChatContext.Provider>
  );
};

export default ChatContext;
