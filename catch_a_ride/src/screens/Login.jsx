import React, { useRef, useContext, useState } from 'react'
import API_KEY from '../logic/API_KEY'
import axios from 'axios'
import { UserContext } from '../logic/UserContext'
import PulseLoader from 'react-spinners/PulseLoader'

export default function Login() {
  const { userLogin, setUseLogin } = useContext(UserContext)
  const [messageError, setMessageError] = useState(null)
  const [spinner, setSpinner] = useState(false)
  const emailRef = useRef('');
  const passwordRef = useRef('');



  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault()
        setSpinner(true)
        axios
          .post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
            {
              email: emailRef.current.value,
              password: passwordRef.current.value,
            },
          )
          .then(() => {
            axios
              .post('/login', {
                email: emailRef.current.value.toLowerCase(),
              })
              .then((res) => {
                setSpinner(false)
                setMessageError(null)
                setUseLogin(res)
              })
            })
            .catch((err) => {
            setSpinner(false)
              setMessageError('Check your email or password')
            })
          }}
          >
      <label>Email </label>
      <br />
      <input ref={emailRef} type="text" placeholder="aw@zl.com " required />
      <br />
      <label>Password :</label>
      <br />
      <input
        ref={passwordRef}
        type="password"
        min={6}
        placeholder="******"
        minLength={6}
        required
      />
      <br />
      <br />
      {!spinner ? (
        <button type="submit">Login</button>
      ) : (
        <PulseLoader color="blue" size="10px" />
      )}
      {messageError ? <p>Error : {messageError}</p> : ''}
    </form>
  )
}
