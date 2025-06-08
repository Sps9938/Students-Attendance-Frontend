import React, { useState, useEffect } from "react";
import axios from "axios";
import conf from "../../Conf/Conf";
import { useLocation, useNavigate } from "react-router-dom";


function SendOtp() {
  // console.log("welcome to Request OTP Page");
  
const location = useLocation();
const navigate = useNavigate();
const [email, setEmail] = useState("");
const [error, setError] = useState();
const [loading, setLoading] = useState(false);
  useEffect(() => {
  const emailFromState = location?.state?.email;
  if(emailFromState) setEmail(emailFromState);

  }, [location.state]);

  // console.log(`email: ${email}, password: ${password}, fullname: ${fullname} `);
// console.log("email is: ", email);
  
 const RequestOtp = async () => {
      setError("");
      // console.log("welcome sendotp function");
      
      try {

      const response = await axios.post(`${conf.API_URL}/user/request-otp`,
        {email},{
          withCredentials: true,
        }
      )
      console.log(response);
      
      if(response?.data.success){
        alert("OTP Sent Successfully");
        navigate("/verify-otp",{
          state: {email}
        })
      } else{
        setError("Failed to send OTP");
      }
      } catch (error) {
     console.error("Failed to send OTP", error);
     setError(
      error?.response?.data?.message || "Error sending OTP, Please Try Again"
     )
     
} finally {
  setLoading(false);
}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await RequestOtp();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-10"
    >
      <input
        type="email"
        className="border p-2 rounded"
        value={email}
        readOnly
        required
      />

      {error && <p className="text-red-900 font-bold">{error}</p>}

      <button
        type="submit"
        className={`bg-blue-500 text-white py-2 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>
    </form>
  );
}

export default SendOtp;
