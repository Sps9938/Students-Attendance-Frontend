import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../Store/authSlice';
import { Button, Input } from './index';
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import axios from "axios";
import conf from "../Conf/Conf";
import { FiLogIn, FiUserPlus } from "react-icons/fi";

function Login() {
    // const [showForgotPassword, setShowForgotPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");

    // const onForgotPassword = async (data) => {
    //     try {
    //         const res = await axios.patch(`${conf.API_URL}/user/forget-password`, {
    //             email: data.email,
    //             newPassword: data.newPassword,
    //             renewPassword: data.renewPassword
    //         }, { withCredentials: true });

    //         console.log("Password forgot successfully", res);
    //         alert("Reset link set!");
    //         setShowForgotPassword(false);
    //     } catch (error) {
    //         alert("Error sending reset link.");
    //     }
    // };

    const login = async (data) => {
        setError("");
        const API = conf.API_URL;

        try {
            const response = await axios.patch(`${API}/user/login`, {
                email: data.email,
                password: data.password
            }, { withCredentials: true });

            if (response) {
                const userData = await axios.get(`${conf.API_URL}/user/get-user`, {
                    withCredentials: true
                });

            const result = response.data;
            if (result.success) {
                const { accessToken, refreshToken, user } = result.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                dispatch(authLogin(user));
                navigate("/");
            } else {
                setError(result.message || "Login failed");
            }
                // console.log("Current user: ", userData);
           
            
          } else {
                console.log("Failed to fetch user data");
            }

          
        } catch (error) {
            const errMsg = error.response?.data?.message || "Something went wrong";

            setError(errMsg);

            console.error("Login error", error);
            
        }
    };  

return (
    <div className="flex items-center justify-center w-full">
        <div className="mx-auto w-full max-w-lg bg-gray-100 dark:bg-gray-800 rounded-xl p-10 border border-black/10 dark:border-white/10">
            <div className="mb-2 flex justify-center">
                <span className="inline-block w-full max-w-[100px]">
                    {/* <Logo width="100%" /> */}
                </span>
            </div>

        <h2 className="text-center text-2xl font-bold leading-tight text-black dark:text-white">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-black/60 dark:text-white/60">
            Don&apos;t have an account?&nbsp;
            <Link to="/signup" className="text-blue-900 dark:text-blue-300 font-bold text-primary transition-all duration-200 underline inline-flex items-center gap-1">
            <FiUserPlus size={18} /> Sign up
            </Link>
        </p>

                {error && (
                    <p
                        role="alert"
                        className="mt-6 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md px-4 py-2 text-center"
                    >
                        {error}
                    </p>
                )}

    <form onSubmit={handleSubmit(login)} className="mt-8">
    <div className="space-y-5">
        <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
    {...register("email", {
        required: true,
        validate: {
        matchPattern: (value) =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
            "Email address must be a valid address",
    },
            })}
    />
        <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: true })}
        />

        <div className="flex justify-between items-center gap-4 mt-4">
            <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
                <FiLogIn size={18}/> Sign in
            </Button>
            
            <button
        type="button"
        className="text-blue-600 dark:text-blue-400 hover:underline"
        onClick={() => navigate("/forget-password")}
    >
        Forgot Password?
    </button>

        </div>
    </div>
</form>


    </div>
</div>
    );
}

export default Login;
