import React, { useEffect, useState } from "react";

import axios from "axios"

import conf from "../../Conf/Conf";
import { Button, Input } from "../index"
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

function User() {
    const [user, setUser] = useState(null);

    const [error, setError] = useState("");

    const [editMode, setEditMode] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const { register, handleSubmit, reset } = useForm();



    const navigate = useNavigate();


    const fetchUser = async () => {
        try {
            const respose = await axios.get(`${conf.API_URL}/user/get-user`, {
                withCredentials: true,
            });
            console.log("user is found on User Profile", respose);
            
            setUser(respose.data.data);
            reset(respose.data.data);

        } catch (error) {
            console.error("Error fetching user: ", err);
            setError("Unable to fetch user data, Please Login again");

        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const onUpdate = async (data) => {
        try {
            const res = await axios.patch(`${conf.API_URL}/user/update-user-details`, data, {
                withCredentials: true,
            });
            console.log("Updated Sucessfully", res);

            alert("Details Updated Sucessfully")
            setEditMode(false);
            fetchUser();
        } catch (error) {
            console.error("Update Failed", err);
            alert("Failed to Updata.");

        }
    }


    const onChangePassword = async (data) => {
        try {
            const res = await axios.patch(`${conf.API_URL}/user/change-password`, data, {
                withCredentials: true,
            });
            console.log("Password Has been changed", res);

            alert("Password Changed!!!");
            setShowChangePassword(false);
        } catch (error) {
            alert("Password change Failed");
        }
    };

    const onForgotPassword = async (data) => {
        try {

            const res = await axios.patch(`${conf.API_URL}/user/forget-password`, {
                email: data.email,
                newPassword: data.newPassword,
                renewPassword: data.renewPassword
            }, {
                withCredentials: true,
            });
            console.log("Password foget sucessfully", res);

            alert("Reset link set!");
            setShowForgotPassword(false);

        } catch (error) {
            alert("Error sending reset link.");
        }
    };


return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg mt-10 space-y-6">
        <h2 className="text-xl font-bold mb-2">User Profile</h2>

        {!editMode && user && (
        <div>
            <p><strong>Name:</strong> {user.fullname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <Button onClick={() => setEditMode(true)} className="mt-3">Edit Details</Button>
        </div>
        )}

        {editMode && (
        <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
            <Input label="Full Name" {...register("fullname")} />
            <Input label="Email" {...register("email")} />
            <Button type="submit">Update</Button>
        </form>
        )}

    <div className="space-y-4">
        {!showChangePassword ? (
            <Button onClick={() => setShowChangePassword(true)}>Change Password</Button>
        ) : (
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
        <Button type="submit">Update Password</Button>
        </form>
            )}

        {!showForgotPassword ? (
            <Button onClick={() => setShowForgotPassword(true)}>Forgot Password?</Button>
        ) : (
            <form onSubmit={handleSubmit(onForgotPassword)} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    {...register("email", { required: true })}
                />
                <Input
                    label="New Password"
                    type="password"
                    {...register("newPassword", { required: true })}
                />
                <Input
                    label="ReEnter Password"
                    type="password"
                    {...register("renewPassword", { required: true })}
                />
                <Button type="submit">Foget Password</Button>
            </form>
        )}
        </div>
    </div>
    );







}

export {
    User
};
