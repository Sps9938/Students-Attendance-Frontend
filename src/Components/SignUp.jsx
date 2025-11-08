import React, {useState} from "react";
import conf from "../Conf/Conf";
import { Link, useNavigate } from "react-router-dom";

import { Button, Input } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";

function SignUp() {
    // console.log("welcome to the signUp function");
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("")
    const {register, handleSubmit} = useForm()

    const create = async(data) => {
        setError('')

    const {fullname, username, email, password, renewPassword, role} = data;
    if(!fullname || !username || !email || !password || !renewPassword || !role ){
    setError("All fields are required.");
    console.error("Validation Error: Missing required fields");
    return;
    }
      if(password != renewPassword){
        setError("Password do not Match")
        console.error("Validation Error: Password do not match");
        return;
       }
       sessionStorage.setItem("registerData", JSON.stringify(data));
     
       navigate("/request-otp",{
        state:{email}
       })
       
    }

    return (
        <div className="flex items-center justify-center">
         <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
         <div className="mb-2 flex justify-center">
            <span className="inline-block w-full max-w-[100px]">
                {/* <Logo width="100%" /> */}
            </span>
         </div>
         <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
         <p className="mt-2 text-center text-base text-black/60">
            Already have an account?&nbsp;
        <Link
            to="/login"
            className="font-bold text-primary transition-all duration-200 text-blue-900 underline"
        >
            Sign In
        </Link>
                </p>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form 
      
        onSubmit={handleSubmit(create)}>
            <div className="space-y-5">
                <Input 
                label="fullname: "
                placeholder="Enter your full Name"
                {...register("fullname", {
                    required: true,
                })}
               />

               <Input 
               label="username: "
               placeholder="Enter your userName"
               
               {...register("username", {
                    required: true,
                
               })}
               />

               <Input 
               label="email: "
               placeholder="Enter your email"
               type= "email"
               {...register("email", {
                    required: true,
                    validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }
               })}
               />

               <Input
               label= "password: "
               type="password"
               placeholder="Enter your password"
               {...register("password", {
                required: true,
               })}
               />
               <Input
               label= "reEnterPassword: "
               type="password"
               placeholder="Enter your reEnterPassword"
               {...register("renewPassword", {
                required: true,
               })}
               />

            <Input
                label="Role"
                type="select"
                {...register("role", { required: true })}
                options={[
                    // { value: "Admin", label: "Admin" },
                    { value: "Teacher", label: "Teacher" },
                    // { value: "Student", label: "Student" },
                ]}
            />

           <Button
        //    onClick={handleSubmit}
      
           type="submit" className="w-full">
               Create Account
           </Button>
          
            </div>
        </form>

        </div>
            </div>
       
    )
}

export default SignUp;