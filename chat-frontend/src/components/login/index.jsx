import React from 'react'
import Loader from './Loader'

export default function LoginForm() {
  return (
    <section id='loginForm'>
        <Loader />
        <div className="container h-100">
            <div className="row d-flex h-100 align-items-center justify-content-center">
              <div className="card shadow">
                <div className="card-body text-center py-5">
                  Refresh the page to login.
                </div>
              </div>
            </div>
        </div>
    </section>
  )
}
