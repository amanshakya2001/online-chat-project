import React from 'react'
import { useParams  } from 'react-router-dom';
export default function ChatPage({submitMessage,message}) {
    const params = useParams()
    const chatId = params.chatId;
  return (
    <section id='chat-room'>
      <div>ChatPage {chatId}</div>
        <div id='messageBody'>
          <ul>
            {message.map(msg=>{
              return <li className={msg.type} key={msg.message}>{msg.type==='incoming'?msg.sender:'You'} : {msg.message}</li>
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
