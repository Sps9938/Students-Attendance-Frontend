import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button, Input } from "../index";
import conf from "../../Conf/Conf";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const onForgotPassword = async (data) => {
        setError("");
        // const { email, newPassword, renewPassword } = data;
        // console.log("email: ", email);
        // console.log("newPassword: ", newPassword);
        // console.log("renewPassword: ", renewPassword);
        
    
        // const res = await axios.patch(
        //     `${conf.API_URL}/user/forget-password`,
        //     { email, newPassword, renewPassword },
        // )

        // console.log("fetched sucessfully", res);
        

        //check email exist in db or not
        // const email = data.email;
        // console.log(email);
        
          try {
              const response = await axios.post(`${conf.API_URL}/user/email-verify`,
                  {email: data.email},
                  {
                  withCredentials: true,
              })
  
            //   console.log("response is: ", response);
              
              if(response?.data?.success){
                    if (data.newPassword !== data.renewPassword) {
                    setError("newPassword do not match with renewPassword.");
                    return;
                }
  
              sessionStorage.setItem("forgetUserData", JSON.stringify(data));
              navigate("/request-otp", {
              state: {email: data.email}
  
              })
              } else{
                  setError(response.data.data || "Email Not Registered")
              }
          } catch (error) {
             const errMsg = error.response?.data?.message || "Something went wrong";

            setError(errMsg);

            // console.log(errMsg);
            

            console.error("Email Not Fetched");
            
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
                {error && <p className="text-red-900 text-sm font-bold">{error}</p>}

                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                    Reset Password
                </Button>
            </form>
        </div>
    );
}

export default ForgetPassword;
