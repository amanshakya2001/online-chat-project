/* eslint-disable */
import $ from 'jquery';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Picker from 'emoji-picker-react';


export default function ChatPage({submitMessage,message,user,currentuser,callUser}) {
  const params = useParams();
  const chatId = params.chatId;
  const [msgArr,setMsgArr] = useState([]);
  const [temp,setTemp] = useState({});

  useEffect(()=>{
    user.map((obj)=>{
      if(obj.email === chatId){
        setTemp(obj);
      }
    })
  },[chatId]);

  useEffect(() => {
    setMsgArr([]);
    message.map((msg)=>{
      if(msg.type === 'incoming' && msg.email === chatId){
        setMsgArr((prevState)=>{return [...prevState,msg]})
      }
      else if(msg.type === 'Yours' && msg.email === chatId){
        setMsgArr((prevState)=>{return [...prevState,msg]})
      }
    })
  }, [message,chatId])


  const emojiSelected = (e)=>{
    $('#msg').val($('#msg').val()+e.emoji);
  }

  useEffect(()=>{

    $('.emoji-wrapper').click((e)=>{
      e.stopPropagation();
      $('.EmojiPickerReact').toggleClass('active');
    })
    
    $('body').click(()=>{
      $('.EmojiPickerReact').removeClass('active');
    })
  },[])
  
  return (
    <section id='chat-room' className='h-100'>
      <div className='chatnav'>
        <div className="avtar">
          <img className='img-fluid' src={temp.image} alt={temp.name} />
        </div>
        <h4 className='text-white text-capitalize ms-4'>{temp.name}</h4>
        <div className="video-icon-wrapper ms-auto me-4" onClick={()=>{callUser(temp)}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
        </div>
        <div className="call-icon-wrapper me-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>        
        </div>
        <div className="menu-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
        </div>
      </div>
      <div id='messageBody'>
        <ul>
          {msgArr.map(msg=>{
            return <li className={msg.type} key={msg.message}>
                    <div className='avtar'>
                      <img className='img-fluid' src={msg.type === 'Yours'? currentuser.image : temp.image} alt={temp.name} />
                    </div>
                    <span className='msgbox'>{msg.message}</span>
              </li>
          })}
        </ul>
      </div>
      <form className='py-3' onSubmit={(e)=>{submitMessage(e,chatId)}}>
        <div className="emoji-wrapper mx-3">
          <img src="/images/emoji-icon.gif" alt="emoji icon" width={40} />
          <Picker onEmojiClick={emojiSelected} />
          </div>
        <input className='px-3' type="text" id="msg" placeholder='Type Here' />
        <input type="submit" value="Send" />
      </form>
    </section>
  )
}
