import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function Protected({children, authentication=true}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.success)
    // console.log("authstaus in authlayout: ", authStatus);
    
    useEffect(() => {

        // if(authStatus == true)
        // {
        //     navigate("/")
        // }else if(authStatus == false){
        //     navigate("/login")
        // }

        //let authValue = authStatus === treu ? true : false
        // console.log("status is: ",authStatus);
        // console.log("authentication", authentication);
        
        
        if(authStatus === null) return;
        if(authentication && authStatus !== authentication){
            navigate('/login')

        } else if(!authentication && authStatus !== authentication) {
            navigate('/')
        }
        setLoader(false)
    },[authStatus, navigate, authentication])

    return loader ? <h1>Loading...</h1> : <>{children}</>
}
