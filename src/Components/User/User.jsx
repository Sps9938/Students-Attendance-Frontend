import React, { useEffect, useState } from "react";
import axios from "axios";
import conf from "../../Conf/Conf";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";

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
        <div className="flex justify-center items-center py-8">
            <div className="bg-white dark:bg-[#151b23] border border-gray-200 dark:border-gray-700 shadow-2xl rounded-3xl p-10 w-full max-w-xl transition-all duration-300">
                <div className="flex flex-col items-center">
                    <FaUserCircle className="text-7xl text-gray-500 dark:text-gray-400 mb-4" />
                    <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800 dark:text-white">
                        User Profile
                    </h2>
                </div>

                {user && (
                    <div className="space-y-4 text-center">
                        <div className="text-lg">
                            <span className="font-semibold text-gray-600 dark:text-gray-400">Name: </span>
                            <span className="text-gray-800 dark:text-white">{user.fullname}</span>
                        </div>
                        <div className="text-lg">
                            <span className="font-semibold text-gray-600 dark:text-gray-400">Email: </span>
                            <span className="text-gray-800 dark:text-white">{user.email}</span>
                        </div>

                        <div className="flex justify-center gap-6 pt-6">
                            <button
                                onClick={() => navigate("/update-user-details")}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-transform hover:scale-105"
                            >
                                Update Details
                            </button>
                            <button
                                onClick={() => navigate("/change-password")}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-transform hover:scale-105"
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
