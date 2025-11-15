import React, { useEffect, useState } from "react";
import axios from "axios";
import conf from "../../Conf/Conf";
import { Button, Input } from "../index";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function UpdateUserDetails() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(""); // Added error state
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
 
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${conf.API_URL}/user/get-user`, {
        withCredentials: true,
      });
    //   console.log("User found:", response);
      setUser(response.data.data);
      reset(response.data.data);
    } catch (error) {
    //   console.error("Error fetching user: ", error);
      setError("Unable to fetch user data. Please login again.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const onUpdate = async (data) => {

    if (!user) {
      console.log("User not found.");
      return;
    }
// console.log("welcome to update page");

    const dataUser = data;
    
  
      // User not verified, go to OTP flow
    //   console.log(`user isVerified is: ${user.isVerified}`);
      
      if(user.email !== data.email){
        navigate("/request-otp", { state: {fullname: data.fullname, email: data.email} });
      }
      else{
         try {
                  
          const response = await axios.patch(`${conf.API_URL}/user/update-user-details`,
            {fullname: data.fullname, email: data.email},{
              withCredentials: true,
            }
          )

        alert("User details Updated");
        navigate("/user");
        } catch (error) {
          console.error("Failed to Update UserDetails");
        }
      }
    
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Edit User Details</h2>

      {error && (
        <p
          role="alert"
          className="mt-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md px-4 py-2"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
        <Input label="Full Name" {...register("fullname")} />
        <Input label="Email" {...register("email")} />
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}

export default UpdateUserDetails;
