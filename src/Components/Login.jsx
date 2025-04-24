import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../store/authSlice';
import { Button, Input } from './index';
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import axios from "axios";
import conf from "../Conf/Conf";

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
                const userData = await axios.get(`${API}/user/get-user`, {
                    withCredentials: true
                });
                console.log("Current user: ", userData);
            } else {
                console.log("Failed to fetch user data");
            }

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
        } catch (err) {
            console.error("Login error", err);
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

return (
    <div className="flex items-center justify-center w-full">
        <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
            <div className="mb-2 flex justify-center">
                <span className="inline-block w-full max-w-[100px]">
                    {/* <Logo width="100%" /> */}
                </span>
            </div>

        <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-black/60">
            Don&apos;t have an account?&nbsp;
            <Link to="/signup" className="font-medium text-primary transition-all duration-200 hover:underline">
                Sign Up
            </Link>
        </p>

        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

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
            <Button type="submit" className="flex-1">
                Sign in
            </Button>
            
            <button
        type="button"
        className="text-blue-600 hover:underline"
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
