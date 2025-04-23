import React, { useEffect, useState } from "react";

import axios from "axios"

import conf from "../../Conf/Conf";
import { Button, Input } from "../index"
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

function UpdateUserDetails() {
    const [user, setUser] = useState(null);
 

    const { register, handleSubmit, reset } = useForm();

    const navigate = useNavigate();



    const fetchUser = async () => {
        try {
            const respose = await axios.get(`${conf.API_URL}/user/get-user`, {
                withCredentials: true,
            });
            // console.log("user is found on User Profile", respose);

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

        // console.log("sent Data", data);
        if (!user) {
            console.log("user not exist");

        }

        try {
            if (user) {
                const res = await axios.patch(`${conf.API_URL}/user/update-user-details`, data, {
                    withCredentials: true,
                });
                // console.log("Updated Sucessfully", res);

                alert("Details Updated Sucessfully")
           
                navigate('/user');
                reset();
            }
        } catch (error) {
            console.error("Update Failed", err);
            alert("Failed to Updata.");

        }
    }
    return (
    <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg mt-10 space-y-6">
    <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
        <Input
            label="Full Name"
            className="bg-zinc-400"
            {...register("fullname")}
        />
        <Input
            label="Email"
            className="bg-zinc-400"
            {...register("email")}
        />
        <Button type="submit">Update</Button>
    </form>




        </div>
    );

}

export default UpdateUserDetails;