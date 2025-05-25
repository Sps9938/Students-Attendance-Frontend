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
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [dataUser, setDataUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { reset } = useForm();

  useEffect(() => {
    const emailFromState = location.state?.email;
    const passwordFromState = location.state?.password;
    const dataUserFromState = location.state?.dataUser;
    const fullnameFromState = location.state?.fullname;
  
    
    if (emailFromState) {
      setEmail(emailFromState);
      setPassword(passwordFromState);
      setDataUser(dataUserFromState || null);
      setFullname(fullnameFromState)
    } else {
      alert("Missing record. Please request to Sign In again.");
      navigate("/signup");
    }

 fetchUser();
  }, [location, navigate]);

    // console.log(`email: ${email}, password: ${password}, fullname: ${fullname} `)
    ;
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${conf.API_URL}/user/get-user`, {
        withCredentials: true,
      });

      setUser(response.data.data);
      reset(response.data.data);
    } catch (error) {
      console.error("Error fetching user: ", error);
     
    }
  };



  const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setLoading(true);
  
  try {
 
    if (fullname) {
      try {
        const updateRes = await axios.patch(
          `${conf.API_URL}/user/update-user-details`,
          { email, fullname },
          { withCredentials: true }
        );
        // console.log("Details updated", updateRes.data);
      } catch (updateError) {
        console.error("Update Failed", updateError);
        alert("User verified but failed to update details.");
      }
    }

    if (user) {
      const verifyRes = await axios.post(
        `${conf.API_URL}/user/verify-otp`,
        { email, otp },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
  
      setSuccess(verifyRes.data?.message || "Email verified successfully");
      navigate("/user");
      
    } else {
      const verifyRes = await axios.post(
        `${conf.API_URL}/user/verify-otp`,
        { email, otp },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
  
      setSuccess(verifyRes.data?.message || "Email verified successfully");
   
      

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
  } catch (error) {
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
