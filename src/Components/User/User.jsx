import React, { useEffect, useState } from "react";
import axios from "axios";
import conf from "../../Conf/Conf";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function User() {
    const [user, setUser] = useState(null);
    const { reset } = useForm();
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${conf.API_URL}/user/get-user`, {
                withCredentials: true,
            });
            setUser(res.data.data);
            reset(res.data.data);
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
<div className="flex justify-center items-center min-h-screen bg-gray-200">
    <div className="bg-white shadow-lg rounded-2xl p-20 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            User Profile
        </h2>

{user && (
    <div className="space-y-4">
        <div className="text-lg">
            <p className="font-semibold text-gray-700">Name: {user.fullname}</p>
           
        </div>
        <div className="text-lg">
            <p className="font-semibold text-gray-700">Email: {user.email} </p>
            
        </div>

        <div className="flex justify-between mt-6">
        <button
            onClick={() => navigate("/update-user-details")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md shadow"
        >
            Update Details
        </button>
        <button
            onClick={() => navigate("/change-password")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-md shadow"
        >
            Change Password
            </button>
                </div>
            </div>
                )}
            </div>
        </div>
    );
}

export { User };
