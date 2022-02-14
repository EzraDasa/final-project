import './App.css';
import React,{useState} from 'react'
import Home from './screens/Home'
import LoginOrRegister from './screens/LoginOrRegister';
import { UserContext } from './logic/UserContext';
function App() {
  const [userLogin,setUseLogin] = useState({status:null})
  
    return (
    <div className="App">
      <UserContext.Provider value={{userLogin,setUseLogin}} >
      {userLogin.status == 200 || userLogin.status == 201
      ?
      <Home />
      :
      <LoginOrRegister/>
      }
      </UserContext.Provider>
    </div>
  );
}
export default App;
