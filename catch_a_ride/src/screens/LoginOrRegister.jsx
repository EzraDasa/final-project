import React, { useState, useContext } from 'react'
import style from '../css/loginOrRegister.module.css'
import Register from '../screens/Register'
import Login from '../screens/Login'

export default function LoginOrRegister() {
  const [flag, setFlag] = useState(false)
  return (
    <>
      <h1 className={style.headerName}>Catch a ride</h1>
      <div className={style.login}>
        <div className={style.formApp}>
          <div className={style.buttons}>
            <button
              onClick={() => {
                setFlag(false)
              }}
              disabled={!flag}
            >
              Login
            </button>
            <button
              onClick={() => {
                setFlag(true)
              }}
              disabled={flag}
            >
              Register
            </button>
          </div>
          <br />
          {flag ? <Register /> : <Login />}
        </div>
      </div>
    </>
  )
}
