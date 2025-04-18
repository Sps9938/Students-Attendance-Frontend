
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import { Outlet } from 'react-router-dom'
import conf from './Conf/Conf'


import { login, logout } from './store/authSlice'
import { Header } from './Components'
import axios from 'axios'
function App() {
  const fetchUser = async () => {
    return await axios.get(`${conf.API_URL}/user/get-user`);
  }

    const [loading, setLoading ] = useState(true)
    const dispatch = useDispatch()
  useEffect(() => {
    fetchUser()
    .then((userData) => {
      if(userData)
      {
        console.log("user session exists", userData);
        dispatch(login(userData))
        
      }
      else{
        console.log("User Not Found");
        dispatch(logout());
        
      }
    }).catch((error) => {
      console.log("User Not Found", error);
      
    })
    .finally(() => setLoading(false))
  }, [])
  

    if(loading){
      return (
        <div className="w-full h-screen flex items-center justify-center">
          <p className="text-lg text-white">Loading...</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
      <div className="w-full block">
        <Header />
        <main>
          <Outlet />
        </main>
   
      </div>
    </div>
    )
}

export default App
