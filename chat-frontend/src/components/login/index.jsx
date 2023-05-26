import React from 'react'
import Loader from './Loader'

export default function LoginForm({userLogin}) {
  return (
    <section id='loginForm'>
        <Loader />
        <div className="container h-100">
            <div className="row d-flex h-100 align-items-center justify-content-center">
              <div className="card shadow">
                <div className="card-body">
                  <form onSubmit={userLogin}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email address</label>
                      <input type="email" className="form-control" id="email" aria-describedby="emailHelp" />
                      <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input type="password" className="form-control" id="password" />
                    </div>
                    <button type="submit" id='loginBtn' className="btn btn-primary d-table mx-auto">Submit</button>
                  </form>
                </div>
              </div>
            </div>
        </div>
    </section>
  )
}
