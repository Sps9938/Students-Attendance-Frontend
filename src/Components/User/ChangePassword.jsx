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
        <div className="max-w-md mx-auto mt-8 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Change Password</h2>
  
      
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
                                {error && (
                                    <p
                                        role="alert"
                                        className="mt-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md px-4 py-2"
                                    >
                                        {error}
                                    </p>
                                )}
                <Button type="submit">Update Password</Button>
            </form>

            </div>
    
    );

}
export default ChangeUserPassword;