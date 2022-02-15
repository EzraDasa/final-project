import React, { useRef, useContext, useState } from 'react'
import axios from 'axios'
import API_KEY from '../logic/API_KEY'
import { UserContext } from '../logic/UserContext'
import PulseLoader from 'react-spinners/PulseLoader'

export default function Register() {
  const { userLogin, setUseLogin } = useContext(UserContext)
  const nameRef = useRef('')
  const emailRef = useRef('')
  const phoneRef = useRef('')
  const passwordRef = useRef('')
  const confirmPasswordRef = useRef('')
  const [messageError, setMessageError] = useState(null)
  const [spinner, setSpinner] = useState(false)
 
  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault()
        setSpinner(true)
        setMessageError(null)
        if (passwordRef.current.value != confirmPasswordRef.current.value)
          return setMessageError('Incorrect password')
        axios
          .post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
            {
              email: emailRef.current.value,
              password: passwordRef.current.value,
            },
          )
          .then((res) => {
            const newUser = {
              email: emailRef.current.value.toLowerCase(),
              password: passwordRef.current.value,
              name: nameRef.current.value,
              phone: phoneRef.current.value,
            }
            newUser.idToken = res.data.idToken
            axios
              .post('/registration', newUser)
              .then((res) => {
                setUseLogin(res)
                setSpinner(false)
              })
              .catch((err) => {
                console.log(err.response)
                setSpinner(false)
              })
              setMessageError(null)
            })
            .catch((err) => {
            setMessageError(err.response.data.error.message)
          })
      }}
    >
      <label>Name :</label>
      <br />
      <input ref={nameRef} type="text" placeholder="ron" required />
      <br />
      <label>Email :</label>
      <br />
      <input
        ref={emailRef}
        type="email"
        placeholder="ron7@gmail.com"
        required
      />
      <br />
      <label>Cellphone number :</label>
      <br />
      <input ref={phoneRef} type="text" placeholder="054-5807771" required />
      <br />
      <label>Password :</label>
      <br />
      <input
        ref={passwordRef}
        type="password"
        placeholder="******"
        minLength={6}
        required
      />
      <br />
      <label>Confirm password :</label>
      <br />
      <input
        ref={confirmPasswordRef}
        type="password"
        placeholder="******"
        minLength={6}
        required
      />
      <br />
      <br />
      {!spinner ? (
        <button type="submit">Register</button>
      ) : (
        <PulseLoader color="blue" size="10px" />
      )}
      {messageError ? <p>Error : {messageError}</p> : ''}
    </form>
  )
}
