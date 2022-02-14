import axios from 'axios';

export default async function addUserDrive(newDriving) {
    let data;
    await axios
    .patch(`/addUserDrive`,newDriving)
    .then((res)=>{
        data =res.data
    })
    .catch((err)=>{return console.log(err)})
    return  data
}
