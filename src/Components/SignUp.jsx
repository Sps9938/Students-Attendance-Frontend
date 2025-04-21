import React, {useState} from "react";
import conf from "../Conf/Conf";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";

function SignUp() {
    console.log("welcome to the signUp function");
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("")
    const {register, handleSubmit} = useForm()

    const create = async(data) => {
        setError('')
        console.log("welcome to the sign Form",data);
        

        try {

            const response = await axios.post(`${conf.API_URL}/user/register`, {
                fullname: data.fullname,
                username: data.username,
                email: data.email,
                password: data.password,
                role: data.role
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }    
        )
        console.log("response: ", response);
        
        if(response?.data?.success){

            const loginResponse = await axios.patch(`${conf.API_URL}/user/login`, {
                email: data.email,
                password: data.password
            }, {
                withCredentials: true
            })


            if(loginResponse?.data?.success){
                const userData = await axios.get(`${conf.API_URL}/user/get-user`,{
                    withCredentials: true
                })
                console.log("cureent user: ", userData);
                
            }

            const result = loginResponse.data;
            if(result.success){
                const {accessToken, refreshToken, user} = result.data;

                localStorage.setItem("accessToken",accessToken);
                localStorage.setItem("refreshToken",refreshToken);


                // Dispatch user data to Redux
                // dispatch(authLogin(user)); // result.user must contain your user info

                // Navigate to homepage
                dispatch(authLogin(user))
                navigate("/");
            } else {
                setError(result.message || "Login failed");
            }
        }
        else{
            console.log("Failed Fetched userData");
            
        }
            //probel for not getting userData after signUp
        
          

        } catch (err) {
            console.error("Signin error", err);
            setError(err.response?.data?.message || "Something went wrong");
        }
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
            className="font-medium text-primary transition-all duration-200 hover:underline"
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
               label= "role: "
               type="text"
               placeholder="Enter your Role like Admin or Teacher"
               {...register("role", {
                required: true,
               })}
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