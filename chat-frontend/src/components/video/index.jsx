import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { Route, Link,Routes,useLocation } from 'react-router-dom';
import Outgoing from './Outgoing';

export default function Video() {
  const location = useLocation();
  const email = location.state ? location.state.userEmail : '';
  const name = location.state ? location.state.userName : '';

  const [stream, setStream] = useState();
  const myVideo = useRef();
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
    });
  }, []);
  return (
    <section>
        Video
        <Routes>
          <Route path="/" element={<Outgoing email={email} name={name} myVideo={myVideo} />} />
        </Routes>
    </section>
  )
}
