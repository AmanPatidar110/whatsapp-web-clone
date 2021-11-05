import axios from 'axios';
import GetAuthToken from '../UtilComponents/authManager';

// const BASE_URL = 'http://localhost:5000/';
const BASE_URL = 'https://whatsapp-web-clone-3.herokuapp.com/';


export const checkUser = async () => {
    try {

        console.log("check user called");
        const token = await GetAuthToken();
        console.log("checkUser", token )
        const response = await axios.get(`${BASE_URL}auth/user`, {
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log("ApiRequest: checkUser", response)

        return Promise.resolve(response.data);
    } catch (ex) {
       
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}

export const getUserProfile = async () => {
    try {

        console.log("check user called");
        const token = await GetAuthToken();
        const response = await axios.get(`${BASE_URL}chat/user`, {
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);

        return Promise.resolve(response.data);
    } catch (ex) {
        
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
  
}

export const getMessages = async (convoId) => {
    try {

        console.log(convoId);

        const token = await GetAuthToken();
        const response = await axios.get(`${BASE_URL}chat/${convoId}`, {
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);

        return Promise.resolve({data: response.data, status: response.status});

    } catch (ex) {
       
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}


export const postMessage = async (data, convoId) => {
    try {

        console.log(convoId);

        const token = await GetAuthToken();
        const response = await axios.post(`${BASE_URL}chat/${convoId}`, data ,{
            headers: {
                Accept: 'application/json',
                'enctype': 'multipart/form-data',
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);

        return Promise.resolve({data: response.data, status: response.status});
        
    } catch (ex) {
       
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}

export const postAudioMessage = async (data, convoId) => {
    try {
        const token = await GetAuthToken();
        const response = await axios.post(`${BASE_URL}chat/audio/${convoId}`, data ,{
            headers: {
                Accept: 'application/json',
                'enctype': 'multipart/form-data',
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log("postAudioMessage", response);

        return Promise.resolve({data: response.data, status: response.status});
        
    } catch (ex) {
       
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}

export const postIncrementUnseenCount = async (convoId) => {
    try {

        const token = await GetAuthToken();
        const response = await axios.post(`${BASE_URL}chat/IncrementUnseenCount`, {convoId},{
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);

        return Promise.resolve({data: response.data, status: response.status});
        
    } catch (ex) {
        
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}

export const postClearUnseenCount = async (convoId) => {
    try {

        const token = await GetAuthToken();
        const response = await axios.post(`${BASE_URL}chat/ClearUnseenCount`, {convoId},{
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);

        return Promise.resolve({data: response.data, status: response.status});
        
    } catch (ex) {

        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}

export const postSetReceivedMessages = async (by, to) => {
    try {

        console.log("postSetReceivedMessages", by, to)
        const token = await GetAuthToken();
        const response = await axios.post(`${BASE_URL}chat/setreceived`, {by, to},{
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);

        return Promise.resolve({data: response.data, status: response.status});
        
    } catch (ex) {
       
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}

export const postSetSeenMessages = async (by, to, convoId) => {
    try {
        console.log("postSetSeenMessages", by, to)
        const token = await GetAuthToken();
        const response = await axios.post(`${BASE_URL}chat/setseen`, {sender: by, receiver: to, convoId: convoId},{
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);

        return Promise.resolve({data: response.data, status: response.status});
        
    } catch (ex) {
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}


export const clearMessages = async (convoId) => {
    try {

        console.log(convoId);

        const token = await GetAuthToken();
        const response =  await axios.delete( `${BASE_URL}chat/chatlist/messages/${convoId}`,{
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);

        return Promise.resolve({data: response.data, status: response.status});
        
    } catch (ex) {
        
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}

export const deleteChat = async (convoId, guestId, code) => {
    try {
        const token = await GetAuthToken();

        let response;
            response = await axios.post( `${BASE_URL}chat/chatlist/${convoId}/${guestId}/${code}`, {},{
                headers: {
                    authorization: token,
                    timestamp: new Date().getTime(),
                },
            });

        console.log(response);

        return Promise.resolve({data: response.data, status: response.status});
        
    } catch (ex) {
        
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
  
}


export const deleteMessage= async (uuid, convoId, guestId, code) => {
    try {
        const token = await GetAuthToken();

        let response;
            response = await axios.post( `${BASE_URL}chat/chatMessage/${convoId}/${uuid}/${guestId}/${code}`, {},{
                headers: {
                    authorization: token,
                    timestamp: new Date().getTime(),
                },
            });

        console.log(response);

        return Promise.resolve({data: response.data, status: response.status});
        
    } catch (ex) {
        
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
  
}

export const postConvo = async (number) => {
    try {
        const token = await GetAuthToken();

        console.log(token)
        const response = await axios.post(`${BASE_URL}chat/convo/${number}`,{},{
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);
        
        return Promise.resolve({data: response.data, status: response.status});

    } catch (ex) {
        
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}

export const postStatus = async (file, caption) => {
    console.log(file, "FFFFFFFFFFFF")
    const formData = new FormData();
    if (file) {
        formData.append("ImageUpload", file, file.name);
    }
    formData.append("caption", caption);
    try {
        const token = await GetAuthToken();

        const response = await axios.post(`${BASE_URL}status`,formData,{
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);
        
        return Promise.resolve({data: response.data, status: response.status});

    } catch (ex) {
        
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}

export const putStatusView = async (statusId) => {
    
    try {
        const token = await GetAuthToken();

        const response = await axios.put(`${BASE_URL}status/view`,{statusId},{
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);
        
        return Promise.resolve({data: response.data, status: response.status});

    } catch (ex) {
      
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}


export const putProfileImage = async (file) => {
    console.log(file, "FFFFFFFFFFFF")
    const formData = new FormData();
    if (file) {
        formData.append("ImageUpload", file, file.name);
    }
    try {
        const token = await GetAuthToken();

        const response = await axios.put(`${BASE_URL}auth/profileImage`,formData,{
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);
        
        return Promise.resolve({data: response.data, status: response.status});

    } catch (ex) {
       
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}


export const putUsername = async (name) => {
    console.log(name, "FFFFFFFFFFFF")
   
    try {
        const token = await GetAuthToken();

        const response = await axios.put(`${BASE_URL}auth/userName`,{name},{
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);
        
        return Promise.resolve({data: response.data, status: response.status});

    } catch (ex) {
       
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}

export const putAbout = async (about) => {
    console.log(about, "FFFFFFFFFFFF")
   
    try {
        const token = await GetAuthToken();

        const response = await axios.put(`${BASE_URL}auth/about`,{about},{
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);
        
        return Promise.resolve({data: response.data, status: response.status});

    } catch (ex) {
       
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}



export const getStatusList = async () => {
    try {
       
        const token = await GetAuthToken();

        const response = await axios.get(`${BASE_URL}status`,{
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);
        return Promise.resolve({data: response.data, status: response.status});

    } catch (ex) {
        
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}






export const getChatList = async () => {
    try {
        console.log("check user called");
        const token = await GetAuthToken();

        const response = await axios.get(`${BASE_URL}chat/chatlist`,{
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);
        return Promise.resolve({data: response.data, status: response.status});

    } catch (ex) {
        
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }
}




export const postSignup = async (userData) => {
    
    const formData = new FormData();
    if (userData.file) {
        formData.append("ImageUpload", userData.file, userData.file.name);
    }
    formData.append("name", userData.name);
    
    try {
        const token = await GetAuthToken();
        console.log(token, ".......................")
        const response = await axios.post(`${BASE_URL}auth/signup`, formData, {
            headers: {
                authorization: token,
                timestamp: new Date().getTime(),
            },
        });

        console.log(response);
        return Promise.resolve(response);
    } catch (ex) {
       
        console.log("Error checking admin", ex);
        return Promise.reject("Server Error");
    }

}


