import React from 'react';
import { Route,Routes,useLocation } from 'react-router-dom';
import Incoming from './incoming';
import Outgoing from './Outgoing';

export default function Video() {
  const location = useLocation();
  const email = location.state ? location.state.userEmail : '';
  const name = location.state ? location.state.userName : '';

  return (
    <section>
        Video
        <Routes>
          <Route path="/" element={<Outgoing email={email} name={name} />} />
          <Route path="/incomingCall" element={<Incoming />} />
        </Routes>
    </section>
  )
}
