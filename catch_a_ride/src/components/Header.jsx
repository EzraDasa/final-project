import style from '../css/Header.module.css'
import React,{useState,useContext,useEffect} from 'react';
import { UserContext } from '../logic/UserContext';
import { BrowserRouter , Switch, Route, Link } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import { FaCarSide} from "react-icons/fa";
import { GoSignIn} from "react-icons/go";
import { RiAccountCircleLine} from "react-icons/ri";
import { AiOutlineWechat } from "react-icons/ai";
import { MdEmojiTransportation,MdEmojiPeople } from "react-icons/md";
import Catch_A_Ride from '../screens/Catch_A_Ride';
import Driving from '../screens/Driving';
import Hitchhiking from '../screens/Hitchhiking';
import Chat from '../screens/Chat';
import UserInfo from '../screens/UserInfo';
import axios from 'axios';

export default function Header() {
  const [flag,setFlag] = useState(false)
  const {userLogin,setUseLogin} = useContext(UserContext) 
  const [userDrining,setUserDrining] = useState([])
  const [chat,setChat] = useState([])
  const [userHitchhiking,setUserHitchhiking] = useState([])
  useEffect(()=>{
    setUserDrining(userLogin.data.Driving)
    setUserHitchhiking(userLogin.data.Hitchhiking)
    setChat(userLogin.data.Chat)
    let isMounted = true;
    axios
    .get(`/chat/${userLogin.data._id}`)
    .then((res)=>{
      if(isMounted)setChat(res.data[0].Chat);
    })
    .catch(()=>{})
    return ()=>{isMounted = false }
  },[])

  return(
      <BrowserRouter>
        <div className={flag?style.header:style.headerClose}  >
        <div  className={flag?style.linksClose:style.links} >
              <a  onClick={()=>setFlag(!flag)}><GiHamburgerMenu title='menu'/></a>
              { flag ?<> <Link to="/UserInfo" title='Details' onClick={()=>setFlag(false)}><RiAccountCircleLine/>&nbsp;&nbsp;{flag?userLogin.data.name:""}</Link><br/><hr style={{opacity:flag?1:0}}/>
              <Link to="/" onClick={()=>setFlag(false)}><FaCarSide/>&nbsp;&nbsp;<p style={{display:flag?"inline":"none",transition:"1s"}}>Catch a ride</p></Link><br/><hr style={{opacity:flag?1:0}}/>
              <Link to="/Driving" title='Shuttle list' onClick={()=>setFlag(false)}><div><MdEmojiTransportation/></div>&nbsp;&nbsp;{flag?"Driving":""}</Link><br/><hr style={{opacity:flag?1:0}}/>
              <Link to="/Hitchhiking" title='List of rides' onClick={()=>setFlag(false)}><MdEmojiPeople/>&nbsp;&nbsp;{flag?"Hitchhiking":""}</Link><br/><hr style={{opacity:flag?1:0}}/>
              <Link to="/Chat" onClick={()=>setFlag(false)}><AiOutlineWechat/>&nbsp;&nbsp;{flag?"Chat":""}</Link><br/><hr style={{opacity:flag?1:0}}/>
              <a href='/' onClick={()=>{
                setUseLogin({status:null})
                }}><GoSignIn title='log out'/>{flag?"Log out":""}</a></>:""}
            </div>
        </div>
            <Switch>
            <Route exact path='/' render={()=><Catch_A_Ride userDrining={userDrining} setUserDrining={setUserDrining} userHitchhiking={userHitchhiking} setUserHitchhiking={setUserHitchhiking}/>}/>
            <Route exact path='/UserInfo' render={()=><UserInfo/>}/>
            <Route exact path='/Hitchhiking' render={()=><Hitchhiking userHitchhiking={userHitchhiking} setUserHitchhiking={setUserHitchhiking} />}/>
            <Route exact path='/Driving' render={()=><Driving userDrining={userDrining} setUserDrining={setUserDrining}/>}/>
            <Route exact path='/Chat' render={()=><Chat chat={chat} setChat={setChat}/>}/>
            </Switch>
      </BrowserRouter>

  );
}
