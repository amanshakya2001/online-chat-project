import React from 'react';
import ChatPage from './ChatPage';
import MessagePage from './MessagePage';
import { Route, Link,Routes } from 'react-router-dom';

export default function Chat({submitMessage,user,message,currentuser,setOnlineChatUser,notification}) {
  return (
    <section id="chatWindow" className='py-5'>
        <div className="container">
          <div className="card shadow overflow-hidden border border-0">
            <div className="card-body p-0">
            <div className="row m-0">
              <div className="col-5 p-0">
                <div className='chatnav'>
                  <div className="avtar">
                    <img className='img-fluid' src={currentuser.image} alt={currentuser.name} />
                  </div>
                  <div className="menu-icon-wrapper ms-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
                  </div>
                </div>
                <ul className="user-list mb-0">
                  {user.length!=0 ?"":<p className='text-center py-5'>No user online yet</p>}
                  {user.map((obj)=>{
                    return(
                    <li className="user border border-bottom-1 w-100" key={obj.email}>
                      <Link to={`/chat/${obj.email}`} className='d-flex text-decoration-none text-dark position-relative' onClick={()=>{setOnlineChatUser(obj.email)}}>
                        <div className="avtar ms-3">
                          <img className="img-fluid rounded-circle" src={obj.image} alt={obj.name} />
                        </div>
                        <div className="content ms-3">
                          <h4 className='text-uppercase'>{obj.name}</h4>
                          <p className="text-truncate">Welcome to Online Chat....</p>
                        </div>
                        {notification &&notification.hasOwnProperty(obj.email)?<span className='notification'>{notification[obj.email]}</span>:''}
                      </Link>
                    </li>)
                  })}
                </ul>
              </div>
              <div className="col-7 p-0">
                  <Routes>
                    <Route path="/" element={<MessagePage />} />
                    <Route path="/:chatId" exact element={<ChatPage submitMessage={submitMessage} message={message} user={user} currentuser={currentuser} />} />
                  </Routes>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>
  )
}
