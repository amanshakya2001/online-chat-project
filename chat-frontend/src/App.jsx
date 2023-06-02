/* eslint-disable */
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import $ from 'jquery';
import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { connect, io } from 'socket.io-client';
import Chat from './components/chat';
import LoginForm from './components/login';
import Video from './components/video';
import { auth } from './firebase';
import Peer from 'simple-peer';

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
  const [stream, setStream] = useState(null);
  const myVideo = useRef();
  const temp = useRef(stream);
  const userVideo = useRef();
  const connectionRef = useRef();
  const [call,setCall] = useState();

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
    $("#messageBody").animate({scrollTop: $('#messageBody').get(0).scrollHeight}, 1000);
    $('input[type=text]').focus();

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
      var notification = new Notification("New Message", {
        body: `${data.sender} : ${data.message}`,
        icon: "data:image/png;base64,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"
      });
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
  
  // Calling a user
  const callUser = (email)=>{
    history('/video',{state:{'userEmail':email.email,'userName':email.name}});
    setTimeout(() => {
      const peer = new Peer({ initiator: true, trickle: false, stream});
    
      peer.on('signal', (data) => {
        socket.emit('callUser', { 'email':email.email, 'signal': data});
      });

      peer.on('stream', (currentStream) => {
        userVideo.current.srcObject = currentStream;
        $('.loading-box').hide();
      });

      socket.on('callAccepted', (signal) => {
        peer.signal(signal);
      });

      connectionRef.current = peer;
    }, 4000);
  }

   // Script to incoming call receive
   useEffect(() => {
    socket.on('callUser', ({ email, name, signal }) => {
      history('/video/incomingCall',{state:{'email':email,'name':name}});
      setCall({ isReceivingCall: true, email, name, signal });
      var notification = new Notification("Video Call", {
        body: `${name} calling`,
        icon: "data:image/png;base64,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"
      });
    });
  
    return () => {
      socket.off('callUser');
    }
  }, [])

  const answerCall = ({email,name}) => {
    history('/video',{state:{'userEmail':email,'userName':name}});
    setTimeout(() => {
      const peer = new Peer({ initiator: false, trickle: false, stream });

      peer.on('signal', (data) => {
        socket.emit('answerCall', { 'signal': data, 'email':email });
      });

      peer.on('stream', (currentStream) => {
      $('.loading-box').hide();
        userVideo.current.srcObject = currentStream;
      });

      peer.on("error", (err) => console.log("error", err));

      peer.signal(call.signal);

      connectionRef.current = peer;
    }, 4000);
    
  };

  // Script to call ended
  useEffect(() => {
    socket.on('callEnded',(data)=>{
      history(`/chat/${data}`);
      $('.loading-box').show();
    });
  
    return () => {
      socket.off('callEnded');
    }
  }, [])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
    });
}, []);

  const callEnded = (email)=>{
    socket.emit('callEnded',email)
    $('.loading-box').show();
  }



  
  return (
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/chat/*" element={<Chat submitMessage={submitMessage} user={userData} message={message} currentuser={currentuser} setOnlineChatUser={setOnlineChatUser} notification={notification.updatedObject} callUser={callUser}  />} />
        <Route path='/video/*' element={<Video callEnded={callEnded} setStream={setStream} myVideo={myVideo} answerCall={answerCall} userVideo={userVideo} />} />
      </Routes>
  );
}

export default App;
