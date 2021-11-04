import './App.css';
import { Switch, Route, BrowserRouter, Redirect, useHistory } from 'react-router-dom';
import { React, createContext, useContext } from 'react';


import ChatRoom from './components/ChatRoom/ChatRoom';
import Login from './components/Login/Login';
import SnackbarStrip from './UtilComponents/SnackbarStrip/SnackbarStrip';
import ProgressBar from './UtilComponents/ProgressBar/ProgressBar';
import AppContext from './Contexts/app-context';


import 'firebase/auth';
import { ChatRoomContextProvider } from './Contexts/chatRoom-context';
import Onboard from './components/Onboard/Onboard';
import { Fragment } from 'react';


function App() {

  const { userProfile, isLoading, isAuth, isProfileComplete, handleOnboardSubmit, user } = useContext(AppContext);
  console.log(isLoading);

  return (


    <div className="App">

      {isLoading ? <ProgressBar /> : null}

      {!isLoading &&

        <Switch>


          {!isAuth &&
            <Route path="/login">
              <Login />
            </Route>
          }

          {isAuth && !isProfileComplete &&
            <Route path="/onboard">
              <Onboard handleOnboardSubmit={handleOnboardSubmit} />
            </Route>
          }

          {isAuth && isProfileComplete && 
            <Route exact={true} path="/">
              <ChatRoomContextProvider>
                <ChatRoom />
              </ChatRoomContextProvider>
            </Route>
          }

          {/* <Route path="*">
              <Login/>
            </Route> */}
        </Switch>

      }

      <SnackbarStrip />

    </div>

  );
}

export default App;
