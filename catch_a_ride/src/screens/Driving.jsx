import style from '../css/showList.module.css'
import { useContext, useEffect } from 'react'
import axios from 'axios'
import { UserContext } from '../logic/UserContext'

export default function Driving({ userDrining, setUserDrining }) {
  const { userLogin, setUseLogin } = useContext(UserContext)

  useEffect(() => {
    axios
      .get(`/userHitchhiking/${userLogin.data._id}`)
      .then((res) => {
        setUseLogin(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  return (
    <div className={style.tableRides}>
      <h1 className={style.h1}>Driving</h1>
      {userDrining?.length ? (
        <table className={style.table}>
          <tbody>
            <tr>
              <th>Point start</th>
              <th>Point end</th>
              <th>Day</th>
              <th>Time</th>
              <th>Seats</th>
              <th>Pick up</th>
            </tr>
            {userDrining.map((item, i) => {
              return (
                <tr key={i} className={style.hoverRows}>
                  <td>{item.pointStart}</td>
                  <td>{item.pointEnd}</td>
                  <td>{item.day}</td>
                  <td>{item.time}</td>
                  <td>{item.seats}</td>
                  <td>
                    {item.pick_up_people.length ? (
                      <p>
                        {item.pick_up_people.map((item, i) => {
                          return item.name + ','
                        })}
                      </p>
                    ) : (
                      'No one'
                    )}
                  </td>
                  <td>
                    <button
                      className={style.btnRemove}
                      onClick={() => {
                        const copyuserDrining = [...userDrining]
                        copyuserDrining.splice(i, 1)
                        axios
                          .delete(`/deleteRide/${item.id}`)
                          .then((res) => {})
                          .catch((err) => {
                            console.log(err)
                          })
                        axios
                          .patch(`/deleteRideUser/${userLogin.data._id}`, item)
                          .then((res) => {
                            setUserDrining(copyuserDrining)
                          })
                          .catch((err) => {
                            console.log(err)
                          })
                      }}
                    >
                      remove
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <h3 className={style.table}>No rides to do</h3>
      )}
    </div>
  )
}
