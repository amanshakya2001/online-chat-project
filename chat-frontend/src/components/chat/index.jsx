import React from 'react';
import ChatPage from './ChatPage';
import MessagePage from './MessagePage';
import { Route, Link,Routes } from 'react-router-dom';

export default function Chat({submitMessage,user,message}) {
  return (
    <section id="chatWindow" className='py-5'>
        <div className="container">
          <div className="card">
            <div className="card-body p-0">
            <div className="row">
              <div className="col-5">
                <ul className="user-list mb-0">
                  {user.map((obj)=>{
                    return(
                    <li className="user border border-bottom-1 w-100" key={obj.email}>
                      <Link to={`/chat/${obj.name}`} className='d-flex text-decoration-none text-dark'>
                        <div className="avtar">
                          <div className={`point ${obj.isActive?'online':'offline'}`}></div>
                          <img className="img-fluid rounded-circle" src="data:image/jpeg;base64,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" alt="" />
                        </div>
                        <div className="content ms-2">
                          <h4>{obj.name}</h4>
                          <p className="text-truncate">Welcome to Online Chat....</p>
                        </div>
                      </Link>
                    </li>)
                  })}
                </ul>
              </div>
              <div className="col-7">
                  <Routes>
                    <Route path="/" element={<MessagePage />} />
                    <Route path="/:chatId" exact element={<ChatPage submitMessage={submitMessage} message={message} />} />
                  </Routes>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>
  )
}
