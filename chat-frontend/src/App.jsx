/* eslint-disable */
import { io } from 'socket.io-client';
import { Route,Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import $ from 'jquery';
import LoginForm from './components/login';
import Chat from './components/chat';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const socket = io(process.env.REACT_APP_SOCKET_URL);
const provider = new GoogleAuthProvider();
function App() {
  const [,setIsLogin] = useState(false);
  const [currentuser,setCurrentUser] = useState({});
  const [message, setMessage] = useState([]);
  const [userData,setUserData] = useState([]);
  const user = useRef(null);
  const history = useNavigate();
  const [notification,setNotification] = useState({});

  // This script to login and store data in database.
  useEffect(() => {
    history("/");
    signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      setIsLogin(true);
      const isFirstTimeLogin = user.metadata.creationTime === user.metadata.lastSignInTime;
      if(isFirstTimeLogin){
        let data = {
          'email':user.email,
          'name':user.displayName,
          'image':user.photoURL
        }
        socket.emit('user_login_first_time',data);
        history('/chat');
      }
      else{
        let data = {
          'email':user.email,
        }
        socket.emit('user_login',data);
        history('/chat');
      }
      setCurrentUser({email:user.email,name:user.displayName,image:user.photoURL})
    }).catch((error) => {
      console.log(error)
    });
  }, []);
  
  // This script is to send message to server.
  const submitMessage = (event,sender)=>{
    event.preventDefault();
    let data = {
      'msg':$('#msg').val(),
      'sender':sender
    }
    socket.emit('message',data);
    setMessage((prevState)=>{return [...prevState,{'email':sender,'sender':'You','message':data.msg,'type':'Yours'}]})
    $('#msg').val('');
    $('#messageBody').scrollTop();

  }

  // Script to get all user who are online
  useEffect(() => {
    socket.on('user_data',(data)=>{
      setUserData(data);
      user.current = data;
    });
  
    return () => {
      socket.off('user_data');
    }
  }, [])
  
  // Script to get message from server.
  useEffect(() => {
    socket.on('incomingMsg',(data)=>{
      setMessage((prevState)=>{return [...prevState,data]})
    })
  
    return () => {
      socket.off('incomingMsg');
    }
  }, [])

  // This script calls when user get offline or online
  useEffect(() => {
    socket.on('profile_change',(data)=>{
      if(data.isActive){
        setUserData((prevState)=>{ return [...prevState,{'email':data.email,'name':data.name,'image':data.image}]})
      }
      else{
        let newArr = [];
        user.current.map((elem)=>{
          if(elem.email !== data.email){
            newArr.push(elem);
          }
          return false;
        })
        setUserData(newArr);
        user.current = newArr;
      }
    })
  
    return () => {
      socket.off('profile_change');
    }
  }, [])
  
  // Script to set user online with which user
  const setOnlineChatUser = (email)=>{
    socket.emit('set_online_user',email);
    setNotification((prevState)=>{
      const updatedObject = { ...prevState.updatedObject };
      if(updatedObject.hasOwnProperty(email)){
        delete updatedObject[email];
      }
      return {updatedObject};
    })
  }

  // Script to get notifications
  useEffect(() => {
    socket.on('notification',(email)=>{
      setNotification((prevState)=>{
        const updatedObject = { ...prevState.updatedObject } ;

        if (updatedObject.hasOwnProperty(email)) {
          updatedObject[email] += 1;
        } else {
          updatedObject[email] = 1;
        }
        return {updatedObject};
      })
    });
  
    return () => {
      socket.off('notification');
    }
  }, [])
  
  
  return (
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/chat/*" element={<Chat submitMessage={submitMessage} user={userData} message={message} currentuser={currentuser} setOnlineChatUser={setOnlineChatUser} notification={notification.updatedObject} />} />
      </Routes>
  );
}

export default App;
