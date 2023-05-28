import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams  } from 'react-router-dom';
export default function ChatPage({submitMessage,message,user,currentuser}) {
  const params = useParams();
  const chatId = params.chatId;
  const [msgArr,setMsgArr] = useState([]);
  const [temp,setTemp] = useState({});
  useEffect(() => {
    setMsgArr([]);
    user.map((obj)=>{
      console.log(obj)
      if(obj.email == chatId){
        setTemp(obj);
        console.log(temp)
      }
    })
    console.log(temp)
    message.map((msg)=>{
      if(msg.type == 'incoming' && msg.email == chatId){
        setMsgArr((prevState)=>{return [...prevState,msg]})
      }
      else if(msg.type == 'Yours'){
        setMsgArr((prevState)=>{return [...prevState,msg]})
      }
    })
  }, [message])

  return (
    <section id='chat-room'>
      <div className='chatnav'>
        <div className="avtar">
          <img className='img-fluid' src={temp.image} alt={temp.name} />
        </div>
        <h4 className='text-white text-capitalize ms-3'>{temp.name}</h4>
        </div>
        <div id='messageBody'>
          <ul>
            {msgArr.map(msg=>{
              return <li className={msg.type} key={msg.message}>
                      <div className='avtar'>
                        <img className='img-fluid' src={msg.type == 'Yours'? currentuser.image : temp.image} alt={temp.name} />
                      </div>
                      <span className='msgbox'>{msg.message}</span>
                </li>
            })}
          </ul>
        </div>
        <form onSubmit={(e)=>{submitMessage(e,chatId)}}>
          <input type="text" id="msg" />
          <input type="submit" value="Send" />
        </form>
    </section>
  )
}
