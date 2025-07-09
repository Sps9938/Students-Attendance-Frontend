import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../Store/AuthSlice";
import conf from "../../Conf/Conf";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logoutHandler = async() => {
        try {
            const response = await axios.patch(`${conf.API_URL}/user/logout`,null, {
                withCredentials: true,
            });

            if(!response){
                console.log("No resposne in LogoutBtn");
            }
            dispatch(logout());

            localStorage.clear();
            
            navigate("/addstudents");
            navigate("/login");
        } catch (error) {
            console.log("Logout Failed", error);
            
        }
    }

    return (
        <button
        className="inline-block px-6 py-2 duration-200 bg-red-400
        hover:bg-yellow-400 rounded-full"
        onClick={logoutHandler}
        >LogOut</button>
    )
}

export default LogoutBtn;