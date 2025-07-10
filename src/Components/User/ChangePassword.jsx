import React, { useEffect, useState } from "react";

import axios from "axios"

import conf from "../../Conf/Conf";
import { Button, Input } from "../index"
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

function ChangeUserPassword() {

    const { register, handleSubmit, reset } = useForm();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const onChangePassword = async (data) => {
        // if(data.newPassword != data.renewPassword)
        // {
        //     setError("Password not Matched Please try Again");
        //     return;
        // }
        try {
            const res = await axios.patch(`${conf.API_URL}/user/change-password`, data, {
                withCredentials: true,
            });
            // console.log("Password Has been changed", res);

            alert("Password Changed!!!");
            navigate('/user')
            reset();
        } catch (error) {
         const errMsg = error.response?.data?.message || "Something went wrong";

            setError(errMsg);

        setError(errMsg);
        console.error("Password not Changed",error);
                
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
  
      
            <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
                <Input
                    label="Old Password"
                    type="password"
                
                    {...register("oldPassword", { required: true })}
                />
                <Input
                    label="New Password"
                    type="password"
             
                    {...register("newPassword", { required: true })}
                />
                <Input
                    label="ReNew Password"
                    type="password"
                    
                    {...register("renewPassword", { required: true })}
                />
                {error && <p className="text-red-900 text-sm font-bold">{error}</p>}
                <Button type="submit">Update Password</Button>
            </form>

            </div>
    
    );

}
export default ChangeUserPassword;