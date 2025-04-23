import React, { useEffect, useState } from "react";

import axios from "axios"

import conf from "../../Conf/Conf";
import { Button, Input } from "../index"
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

function ChangeUserPassword() {

    const { register, handleSubmit, reset } = useForm();

    const navigate = useNavigate();
    const onChangePassword = async (data) => {
        if(data.newPassword != data.renewPassword)
        {
            alert("Password not Matched Please try Again");
        }
        try {
            const res = await axios.patch(`${conf.API_URL}/user/change-password`, data, {
                withCredentials: true,
            });
            // console.log("Password Has been changed", res);

            alert("Password Changed!!!");
            navigate('/user')
            reset();
        } catch (error) {
            alert("Password change Failed");
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg mt-10 space-y-6">
            <h2 className="text-xl font-bold mb-2">User Profile</h2>


     <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg mt-10 space-y-6">
      
            <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
                <Input
                    label="Old Password"
                    type="password"
                    className="bg-zinc-400"
                    {...register("oldPassword", { required: true })}
                />
                <Input
                    label="New Password"
                    type="password"
                     className="bg-zinc-400"
                    {...register("newPassword", { required: true })}
                />
                <Input
                    label="ReNew Password"
                    type="password"
                     className="bg-zinc-400"
                    {...register("renewPassword", { required: true })}
                />
                <Button type="submit">Update Password</Button>
            </form>

            </div>
        </div>
    );

}
export default ChangeUserPassword;