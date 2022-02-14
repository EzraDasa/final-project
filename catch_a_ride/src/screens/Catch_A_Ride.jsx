import moment from 'moment'
import { useState, useEffect, useRef, useContext } from 'react'
import style from '../css/Catch_A_Ride.module.css'
import searchCities from '../functions/searchCities'
import axios from 'axios'
import { UserContext } from '../logic/UserContext'
import { GrCompliance } from 'react-icons/gr'
import { FcOk, FcCheckmark } from 'react-icons/fc'
import { FaCar } from 'react-icons/fa'
import SpinnerCircularFixed from 'react-spinners/PulseLoader'

export default function Catch_A_Ride({
  userDrining,
  setUserDrining,
  userHitchhiking,
  setUserHitchhiking,
}) {
  const { userLogin, setUseLogin } = useContext(UserContext)
  let toDay = moment().format('YYYY-MM-DD')
  let time = moment().format('').slice(11, 16)
  const [hitchhiking, setHitchhiking] = useState([])
  const [pointStart, setPointStart] = useState([])
  const [pointEnd, setPointEnd] = useState([])
  const [valuePointStart, setValuePointStart] = useState('')
  const [valuePointEnd, setValuePointEnd] = useState('')
  const [dataCities, setDataCities] = useState([])
  const [seats, setSeats] = useState(0)
  const [role, setRole] = useState(null)
  const [message, setMessage] = useState(null)
  const dayRef = useRef()
  const timeRef = useRef()
  const [spinner, setSpinner] = useState(false)

  useEffect(() => {
    setSpinner(true)
    let isMounted = true; 
    axios
      .get('./data/cities.json')
      .then((res) => {
        if(isMounted){setSpinner(false)
        setDataCities(res.data)}
      })
      .catch(() => {
        setSpinner(false)
      })
      return ()=>{isMounted = false}
  }, [])

  function addHitchhiker(item) {
    setSpinner(true)
    const hitchhiker = {
      name: userLogin.data.name,
      phone: userLogin.data.phone,
      driverId: item.driverId,
      pointStart: item.pointStart,
      pointEnd: item.pointEnd,
      day: item.day,
      time: item.time,
      id: item._id,
      driver: item.driver,
    }
    axios
      .post(`/addHitchhiker/${userLogin.data._id}`, hitchhiker)
      .then((res) => {
        setSpinner(false)
        const updateUserHitchhiking = [...userHitchhiking]
        updateUserHitchhiking.push(hitchhiker)
        setUserHitchhiking(updateUserHitchhiking)
      })
      .catch((err) => {
        setSpinner(false)
        console.log(err)
      })
  }

  return (
    <div>
      <div className={style.container}>
        <form
          className={style.form}
          onSubmit={(evt) => {
            evt.preventDefault()
            setSpinner(true)
            if (!role) {
              alert('select checkbox')
              return
            }
            if (dayRef.current.value == toDay && timeRef.current.value < time) {
              alert('The time already passed')
              return
            }
            const newRide = {
              driver: userLogin.data.name,
              driverId: userLogin.data._id,
              pointStart: valuePointStart,
              pointEnd: valuePointEnd,
              day: dayRef.current.value,
              time: timeRef.current.value,
              seats,
              pick_up_people: [],
            }
            if (role == 'Driver') {
              axios
                .post(`/addDrive`, newRide)
                .then((res) => {
                  newRide.id = res.data.insertedId
                  const copyuserDrining = [...userDrining]
                  copyuserDrining.push(newRide)
                  axios
                    .patch(`/addUserDrive/${userLogin.data._id}`, newRide)
                    .then((res) => {
                      setSpinner(false)
                      setUserDrining(copyuserDrining)
                      setMessage(true)
                      setHitchhiking([])
                    })
                    .catch((err) => {
                      setSpinner(false)
                      console.log(err)
                    })
                })
                .catch((err) => {
                  setSpinner(false)
                  console.log(err)
                })
            } else {
              setSpinner(true)
              setMessage(false)
              axios
                .post(`/hitchhiking`, newRide)
                .then((res) => {
                  setSpinner(false)
                  if (res.data.length) {
                    setHitchhiking(res.data)
                  } else {
                    setHitchhiking('No rides')
                  }
                })
                .catch((err) => {
                  setSpinner(false)
                  return console.log(err)
                })
            }
          }}
        >
          <div className={style.pointStart}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <input
                  type="checkbox"
                  onChange={() => {
                    setRole('Traveler')
                    setSeats(1)
                  }}
                  checked={role == 'Traveler' ? true : false}
                ></input>
                &nbsp;<label>Traveler</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  onChange={() => {
                    setRole('Driver')
                    setSeats(0)
                  }}
                  checked={role == 'Driver' ? true : false}
                ></input>
                &nbsp;<label>Driver</label>
              </div>
            </div>
            <input
              type="text"
              value={valuePointStart}
              placeholder="point start"
              onChange={(evt) => {
                setValuePointStart(evt.target.value)
                if (evt.target.value && evt.target.value != ' ') {
                  setPointStart(searchCities(dataCities, evt.target.value))
                } else {
                  setPointStart([])
                }
              }}
              required
            />
            <br />
            <div className={style.searchList}>
              <ul>
                {pointStart?.length
                  ? pointStart?.map((item, i) => (
                      <li
                        className={style.li}
                        onClick={() => {
                          setValuePointStart(item.name)
                          setPointStart([])
                        }}
                        key={i}
                      >
                        {item.name}
                      </li>
                    ))
                  : ''}
              </ul>
            </div>
          </div>
          <input
            type="text"
            value={valuePointEnd}
            placeholder="point end"
            onChange={(evt) => {
              setValuePointEnd(evt.target.value)
              if (evt.target.value && evt.target.value != ' ') {
                setPointEnd(searchCities(dataCities, evt.target.value))
              } else {
                setPointEnd([])
              }
            }}
            required
          />
          <br />
          <div className={style.searchList}>
            <ul>
              {pointEnd?.length
                ? pointEnd?.map((item, i) => (
                    <li
                      onClick={() => {
                        setValuePointEnd(item.name)
                        setPointEnd([])
                      }}
                      key={i}
                    >
                      {item.name}
                    </li>
                  ))
                : ''}
            </ul>
          </div>
          <input
            ref={dayRef}
            type="date"
            defaultValue={toDay}
            min={toDay}
          ></input>
          <br />
          <input ref={timeRef} type="time" defaultValue={time} />
          <br />
          {role == 'Driver' ? (
            <>
              seats:
              <input
                type="number"
                className={style.inputNumber}
                value={seats}
                min={0}
                max={4}
                onChange={(evt) => {
                  setSeats(evt.target.value)
                }}
              />
              <br />
            </>
          ) : (
            ''
          )}
          <button type="submit">
            {role == 'Driver' ? 'Add a ride' : 'search'}
          </button>
        </form>
      </div>
      <br />
      {spinner ? <SpinnerCircularFixed /> : ''}
      {hitchhiking?.length ? (
        <div className={style.container}>
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Point start</th>
                <th>Point end</th>
                <th>Day</th>
                <th>Time</th>
                <th>Seats</th>
              </tr>

              {hitchhiking?.length &&
              (typeof(hitchhiking) != typeof("") || typeof(hitchhiking) != typeof(''))
                ? hitchhiking?.map((item, i) => {
                    return (
                      <tr key={i} className={style.hoverRow}>
                        <td>
                          <b>Name : </b>
                          {item.driver}
                        </td>
                        <td>
                          <b>Point start : </b>
                          {item.pointStart}
                        </td>
                        <td>
                          <b>Point end : </b>
                          {item.pointEnd}
                        </td>
                        <td>
                          <b>Day : </b>
                          {item.day}
                        </td>
                        <td>
                          <b>Time : </b>
                          {item.time}
                        </td>
                        <td>
                          <b>Seats : </b>
                          {item.seats}
                        </td>
                        <td>
                          {item.driverId == userLogin.data._id ? (
                            <FcCheckmark />
                          ) : (
                            item.pick_up_people?.map((hitchhiker, j) => {
                              if (
                                hitchhiker.hitchhikerId == userLogin.data._id
                              ) {
                                return <FcOk key={j} />
                              }
                              if (
                                item.pick_up_people.length - 1 == j ||
                                item.pick_up_people.length == 0
                              ) {
                                return (
                                  <button
                                    onClick={() => {
                                      addHitchhiker(item)
                                    }}
                                  >
                                    <FaCar key={j} />
                                  </button>
                                )
                              }
                            })
                          )}
                          {!item.pick_up_people.length &&
                          item.driverId != userLogin.data._id ? (
                            <button
                              onClick={() => {
                                const copyHitchhiking = [...hitchhiking]
                                console.log(hitchhiking)
                                const newHitchhiker = {
                                  hitchhikerId: userLogin.data._id,
                                  driverId: item.driverId,
                                  pointStart: item.pointStart,
                                  pointEnd: item.pointEnd,
                                  day: item.day,
                                  time: item.time,
                                  id: item._id,
                                  driver: item.driver,
                                }
                                copyHitchhiking[i].pick_up_people.push(
                                  newHitchhiker,
                                )
                                setHitchhiking(copyHitchhiking)
                                addHitchhiker(item)
                              }}
                            >
                              <FaCar />
                            </button>
                          ) : (
                            ''
                          )}
                        </td>
                      </tr>
                    )
                  })
                : ''}
            </tbody>
          </table>
        </div>
      ) : hitchhiking == 'No rides' ? (
        <h1 style={{ textAlign: 'center' }}>No rides</h1>
      ) : (
        ''
      )}
      {message ? (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <h3>Added to your list </h3>
          <GrCompliance />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
