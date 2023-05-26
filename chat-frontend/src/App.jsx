import { io } from 'socket.io-client';
import { Route,Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import $ from 'jquery';
import LoginForm from './components/login';
import Chat from './components/chat';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const socket = io(process.env.REACT_APP_SOCKET_URL);

function App() {
  const [message, setMessage] = useState([]);
  const [userData,setUserData] = useState([]);
  const user = useRef(null);
  const history = useNavigate();

  useEffect(() => {
    history("/");
  }, [])
  
  const submitMessage = (event,sender)=>{
    event.preventDefault();
    let data = {
      'msg':$('#msg').val(),
      'sender':sender
    }
    socket.emit('message',data);
    setMessage((prevState)=>{return [...prevState,{'sender':'You','message':data.msg,'type':'Yours'}]})
    $('#msg').val('');
    $('#messageBody').scrollTop();

  }

  const userLogin = (e)=>{
    e.preventDefault();
    const email = $('#email').val();
    const pass = $('#password').val();
    if(email === ''|| pass === ""){
      alert("Value not Found");
      return false;
    }
    $('#loginBtn').attr('disabled','disabled');
    const data = {
      'email':email,
      'password':pass
    }
    socket.emit('userlogin',data);

    $('.spinner-border').show();
  }

  // Script to get authenticated and get all user who are online
  useEffect(() => {
    socket.on('userAuth',(data)=>{
      $('.spinner-border').hide();
      if(data.login){
        history("chat/");
        setUserData(data.userData);
        user.current = data.userData;
      }
      else{
        alert('User not exist')
        $('#loginBtn').removeAttr('disabled');
      }
    });
  
    return () => {
      socket.off('userAuth');
    }
  }, [])
  
  // Script to get message
  useEffect(() => {
    socket.on('incomingMsg',(data)=>{
      setMessage((prevState)=>{return [...prevState,data]})
    })
  
    return () => {
      socket.off('incomingMsg');
    }
  }, [])

  useEffect(() => {
    socket.on('profileChanges',(data)=>{
      if(user.current !== null){
        let newArr = user.current.map((elem)=>{
          if(elem.email == data.email){
            return {'email':elem.email,'name':elem.name,'isActive':data.isActive};
          }
          else{
            return elem
          }
        })
        user.current = newArr;
        setUserData(user.current);
      }
    });
  
    return () => {
      socket.off('profileChanges');
    }
  }, [])
  
  
  
  return (
      <Routes>
        <Route path="/" element={<LoginForm userLogin={userLogin} />} />
        <Route path="/chat/*" element={<Chat submitMessage={submitMessage} user={userData} message={message} />} />
      </Routes>
  );
}

export default App;
