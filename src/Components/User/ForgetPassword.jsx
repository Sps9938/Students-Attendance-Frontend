import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button, Input } from "../index";
import conf from "../../Conf/Conf";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    const onForgotPassword = async (data) => {
        // const { email, newPassword, renewPassword } = data;
        // console.log("email: ", email);
        // console.log("newPassword: ", newPassword);
        // console.log("renewPassword: ", renewPassword);
        
        if (data.newPassword !== data.renewPassword) {
            alert("Passwords do not match.");
            return;
        }
        // const res = await axios.patch(
        //     `${conf.API_URL}/user/forget-password`,
        //     { email, newPassword, renewPassword },
        // )

        // console.log("fetched sucessfully", res);
        

  
        try {
            const res = await axios.patch(`${conf.API_URL}/user/forget-password`, {
                email: data.email,
                newPassword: data.newPassword,
                renewPassword: data.renewPassword
            }, {
                withCredentials: true,
            });

            console.log("Password reset successfully", res);
            alert("Password reset successfully!");
            navigate("/login")
            reset();
            // or wherever you want to redirect after success
        } catch (error) {
            console.error("Error resetting password", error);
            alert("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg mt-10 space-y-6">
            <form onSubmit={handleSubmit(onForgotPassword)} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                     className="bg-zinc-400"
                    {...register("email", { required: true })}
                />
                <Input
                    label="New Password"
                    type="password"
                     className="bg-zinc-400"
                    {...register("newPassword", { required: true })}
                />
                <Input
                    label="Re-enter Password"
                    type="password"
                     className="bg-zinc-400"
                    {...register("renewPassword", { required: true })}
                />
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                    Reset Password
                </Button>
            </form>
        </div>
    );
}

export default ForgetPassword;
