import axios from 'axios';

export default async function addDrive(newRide) {
    let data;
    await axios
    .post(`/addDrive`,newRide)
    .then((res)=>{
      data = res.data
    })
    .catch((err)=>{return console.log(err)})
    return data
}
