import axios from 'axios'
import { useContext } from 'react'
import { UserContext } from '../logic/UserContext'
import style from '../css/showList.module.css'
import { Link } from 'react-router-dom'
export default function Hitchhiking({ userHitchhiking, setUserHitchhiking }) {
  const { userLogin } = useContext(UserContext)

  return (
    <div className={style.tableRides}>
      <h1 className={style.h1}>Hitchhiking</h1>
      {userHitchhiking?.length ? (
        <table className={style.table}>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Point start</th>
              <th>Point end</th>
              <th>Day</th>
              <th>Time</th>
              <th>Seats</th>
            </tr>
            {userHitchhiking.map((item, i) => {
              return (
                <tr key={i} className={style.hoverRows}>
                  <td>Name : {item.driver}</td>
                  <td>Point start : {item.pointStart}</td>
                  <td>Point end : {item.pointEnd}</td>
                  <td>Day : {item.day}</td>
                  <td>Time : {item.time}</td>
                  <td>
                    <Link to="/chat">chat</Link>
                  </td>
                  <td>
                    <button
                      className={style.btnRemove}
                      onClick={() => {
                        axios
                          .patch(
                            `/deleteHitchhiker/${userLogin.data._id}`,
                            item,
                          )
                          .then(() => {
                            const copyUserHitchhiking = [...userHitchhiking]
                            copyUserHitchhiking.splice(i, 1)
                            setUserHitchhiking(copyUserHitchhiking)
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
