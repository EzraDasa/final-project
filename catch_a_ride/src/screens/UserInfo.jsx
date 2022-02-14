import React, { useContext, useState, useRef } from 'react'
import { UserContext } from '../logic/UserContext'
import style from '../css/userInfo.module.css'
import { RiAccountCircleLine } from 'react-icons/ri'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import axios from 'axios'
import API_KEY from '../logic/API_KEY'

export default function UserInfo() {
  const { userLogin, setUseLogin } = useContext(UserContext)
  const userName = userLogin.data.name
  const phone = userLogin.data.phone
  const password = userLogin.data.password
  const [eye, setEye] = useState(false)
  const [message, setMmssage] = useState(false)
  const nameRef = useRef()
  const phoneRef = useRef()
  const passwordRef = useRef()

  return (
    <div className={style.userInfo}>
      <form
        onSubmit={(evt) => {
          evt.preventDefault()
          setMmssage(false)
          if (
            nameRef.current.value != userName ||
            phoneRef.current.value != phone ||
            passwordRef.current.value != password
          ) {
            const userInfo = {
              name: nameRef.current.value,
              phone: phoneRef.current.value,
              password: passwordRef.current.value,
            }
            axios
              .patch(`/updateUserDetails/${userLogin.data._id}`, userInfo)
              .then((res) => {
                const updateUser = { ...userLogin }
                updateUser.data.name = nameRef.current.value
                updateUser.data.phone = phoneRef.current.value
                updateUser.data.password = passwordRef.current.value
                setUseLogin(updateUser)
              })
              .catch((err) => {
                console.log(err.response)
              })
          }
        }}
      >
        <RiAccountCircleLine className={style.userIcon} />
        <div className={style.userDetail}>
          <h3>email :</h3>&nbsp;<h3>{userLogin.data.email}</h3>
        </div>
        <br />
        <div className={style.userDetail}>
          <h3>name :</h3>&nbsp;
          <input ref={nameRef} type="text" defaultValue={userName} />
        </div>
        <br />
        <div className={style.userDetail}>
          <h3>phone :</h3>&nbsp;
          <input ref={phoneRef} type="text" defaultValue={phone} />
        </div>
        <br />
        <div className={style.userDetail}>
          <h3>password :</h3>&nbsp;
          <input
            ref={passwordRef}
            type={eye ? 'text' : 'password'}
            defaultValue={password}
          />
          {eye ? (
            <AiFillEye
              className={style.eye}
              onClick={() => {
                setEye(false)
              }}
              style={{ width: '20px' }}
            />
          ) : (
            <AiFillEyeInvisible
              className={style.eye}
              onClick={() => {
                setEye(true)
              }}
              style={{ width: '20px' }}
            />
          )}
        </div>
        <br />
        <button type="submit">update</button>
        {message ? <h1>update completed</h1> : <h1>{message}</h1>}
      </form>
    </div>
  )
}
