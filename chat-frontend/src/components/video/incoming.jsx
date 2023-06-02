import React from 'react';
import { Link,useLocation } from 'react-router-dom';

export default function Incoming({answerCall}) {
  const location = useLocation();
  const email = location.state ? location.state.email : '';
  const name = location.state ? location.state.name : '';
  return (
    <section id='outgoing'>
        <div className="container">
          <div className="row">
            <div className="col-12">
                Incoming call {name}
            </div>
          </div>
          <div className="d-flex justify-content-center pt-5">
            <button className='end-call-btn bg-success me-5 border-0' onClick={()=>{answerCall({email,name})}}>
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" fill='white'><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>            
            </button>
            <Link className='end-call-btn' to={`/chat/${email}`}>
              <svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48h-48z" fill="none"/><path d="M24 18c-3.21 0-6.3.5-9.2 1.44v6.21c0 .79-.46 1.47-1.12 1.8-1.95.98-3.74 2.23-5.33 3.7-.36.35-.85.57-1.4.57-.55 0-1.05-.22-1.41-.59l-4.95-4.95c-.37-.37-.59-.87-.59-1.42 0-.55.22-1.05.59-1.42 6.09-5.79 14.34-9.34 23.41-9.34s17.32 3.55 23.41 9.34c.37.36.59.87.59 1.42 0 .55-.22 1.05-.59 1.41l-4.95 4.95c-.36.36-.86.59-1.41.59-.54 0-1.04-.22-1.4-.57-1.59-1.47-3.38-2.72-5.33-3.7-.66-.33-1.12-1.01-1.12-1.8v-6.21c-2.9-.93-5.99-1.43-9.2-1.43z"/></svg>
            </Link>
          </div>
        </div>
    </section>
  )
}