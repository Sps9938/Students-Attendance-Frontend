import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import conf from "../../Conf/Conf";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../store/authSlice";
import { useForm } from "react-hook-form";

function VerifyOtp() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
 


  const location = useLocation();
  const navigate = useNavigate();
  const { reset } = useForm();


    // console.log(`email: ${email}, password: ${password}, fullname: ${fullname} `)


const registration = async () => {
  try {
    const registerData = JSON.parse(sessionStorage.getItem("registerData"));

    if (!registerData) {
      console.error("No registration data found in sessionStorage.");
      setError("Something went wrong. Please register again.");
      return;
    }

    const { password } = registerData;

    const response = await axios.post(
      `${conf.API_URL}/user/register`,
      registerData,
      { withCredentials: true }
    );

    if (response?.data?.data) {

      sessionStorage.removeItem("registerData");

      // Proceed with login->
      const loginRes = await axios.patch(
        `${conf.API_URL}/user/login`,
        { email, password },
        { withCredentials: true }
      );

      const result = loginRes.data;

      if (result.success) {
        const { accessToken, refreshToken, user } = result.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        dispatch(authLogin(user));
        navigate("/");
      } else {
        setError(result.message || "Login failed after verification.");
      }
    }
  } catch (err) {
    console.error("Registration or login failed:", err);
    setError("An error occurred during registration.");
  }
};

  useEffect(() => {
  const emailFromState = location?.state?.email;
  if(emailFromState) setEmail(emailFromState);

  }, [location.state]);

  const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setLoading(true);
  try {
    
      const verifyRes = await axios.post(
        `${conf.API_URL}/user/verify-otp`,
        { email, otp },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setSuccess(verifyRes.data?.message || "Email verified successfully");
      //after verifed do register
      registration();
  
  
      // navigate("/user");
      
    
}
   catch (error) {
    console.error("Verify OTP Error:", error);
    setError(
      error.response?.data?.message || "Failed to verify OTP. Please try again."
    );
  } finally {
    setLoading(false);
  }
};



  return (
    <form
      onSubmit={handleVerifyOtp}
      className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-10"
    >
      <input
        type="email"
        value={email}
        readOnly
        className="border p-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
      />
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 rounded"
        required
      />
      {error && <p className="text-red-900 text-sm font-bold">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}
      <button
        type="submit"
        disabled={loading}
        className={`bg-green-500 text-white py-2 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
        }`}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
}

export default VerifyOtp;
