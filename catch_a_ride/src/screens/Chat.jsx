import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../logic/UserContext'
import style from '../css/chat.module.css'
import { RiMailSendLine } from 'react-icons/ri'
import axios from 'axios'
import moment from 'moment'

export default function Chat({ chat, setChat }) {
  const { userLogin, setUseLogin } = useContext(UserContext)
  const [text, setText] = useState('')
  const [conversation, setConversation] = useState(0)
  const [chatSelect, setChatSelect] = useState('')

  useEffect(() => {
    axios
      .get(`/chat/${userLogin.data._id}`)
      .then((res) => {
        console.log(res.data[0].Chat)
        setChat(res.data[0].Chat)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <div className={style.containerChat}>
      <div>
        <h1>Chat</h1>
        <div className={style.chat}>
          <table className={style.boxConversations}>
            <tbody className={style.conversationsUsers}>
              {chat?.length ? (
                chat.map((item, i) => {
                  console.log(item.conversation)

                  return (
                    <tr
                      key={i}
                      className={style.conversation}
                      onClick={() => {
                        setChatSelect(i)
                        setConversation(item.conversation)
                      }}
                    >
                      <th style={{ border: 'none' }}>{item.name}</th>
                      <th
                        style={{
                          border: 'none',
                          fontSize: 'small',
                          display: 'flex',
                          justifyContent: 'space-around',
                          width: '100%',
                        }}
                      >
                        {item.conversation.length ? (
                          <>
                            <p>
                              {
                                item.conversation[item.conversation.length - 1]
                                  .text
                              }
                            </p>
                            <p>
                              &nbsp;&nbsp;
                              {
                                item.conversation[item.conversation.length - 1]
                                  .time
                              }
                            </p>
                          </>
                        ) : (
                          ''
                        )}
                      </th>
                    </tr>
                  )
                })
              ) : (
                <tr className={style.conversation}>
                  <th style={{ border: 'none' }}>Go and catch a ride</th>
                </tr>
              )}
            </tbody>
          </table>
          {conversation ? (
            <div style={{ position: 'relative' }}>
              <div
                style={{ width: '100%', position: 'absolute', padding: '10px' }}
              >
                {conversation.map((item, i) => {
                  console.log(item)
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'inline-block',
                        width: '50vw',
                        marginTop: '10px',
                        backgroundColor:
                          item.id == userLogin.data.id
                            ? '#4fbe53b7'
                            : '#a1a1a1b7',
                      }}
                    >
                      <p style={{ paddingLeft: '10px', paddingTop: '5px' }}>
                        {item.day}&nbsp;&nbsp;{item.time}&nbsp;&nbsp;(
                        {item.name})
                      </p>
                      <h3 style={{ paddingLeft: '10px' }}>{item.text}</h3>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div>
              <h1 style={{ position: 'absolute', padding: '10px' }}>
                Select chat
              </h1>
            </div>
          )}
          <div className={style.textChat}>
            <button
              className={style.btnSend}
              onClick={() => {
                if (conversation) {
                  let day = moment().format('YYYY-MM-DD')
                  let time = moment().format('').slice(11, 16)
                  const copyUserChat = [...chat]
                  axios
                    .post(`/sendMessage/${userLogin.data._id}`, {
                      id: conversation.id,
                      text,
                      day,
                      time,
                      name: userLogin.data.name,
                    })
                    .then((res) => {
                      copyUserChat[chatSelect].conversation = res.data
                      // setChat(copyUserChat)
                      console.log(chat)
                      console.log(copyUserChat)
                    })
                    .catch((err) => {
                      console.log(err)
                    })
                }
                setText('')
              }}
            >
              <RiMailSendLine color="white" size="65%" />
            </button>
            <textarea
              type="text"
              placeholder="Typing a message ..."
              value={text}
              onChange={(evt) => {
                setText(evt.target.value)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
