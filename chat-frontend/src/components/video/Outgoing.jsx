import React from 'react';
import { Link } from 'react-router-dom';

export default function Outgoing({email,name,myVideo}) {
  return (
    <section id='outgoing'>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card remote-video-card border-0 shadow">
                <div className="card-body">
                  <video src=""></video>
                  <div className="loading-box">
                    <div className="dot-row">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                    <h6>Connecting to {name}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center pt-5">
            <Link className='end-call-btn' to={`/chat/${email}`}>
              <svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48h-48z" fill="none"/><path d="M24 18c-3.21 0-6.3.5-9.2 1.44v6.21c0 .79-.46 1.47-1.12 1.8-1.95.98-3.74 2.23-5.33 3.7-.36.35-.85.57-1.4.57-.55 0-1.05-.22-1.41-.59l-4.95-4.95c-.37-.37-.59-.87-.59-1.42 0-.55.22-1.05.59-1.42 6.09-5.79 14.34-9.34 23.41-9.34s17.32 3.55 23.41 9.34c.37.36.59.87.59 1.42 0 .55-.22 1.05-.59 1.41l-4.95 4.95c-.36.36-.86.59-1.41.59-.54 0-1.04-.22-1.4-.57-1.59-1.47-3.38-2.72-5.33-3.7-.66-.33-1.12-1.01-1.12-1.8v-6.21c-2.9-.93-5.99-1.43-9.2-1.43z"/></svg>
            </Link>
          </div>
          <div className="card my-video-card border-0 shadow">
            <div className="card-body p-0 overflow-hidden">
              <video playsInline muted ref={myVideo} autoPlay></video>
            </div>
          </div>
        </div>
    </section>
  )
}
