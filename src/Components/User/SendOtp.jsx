import React, { useState, useEffect } from "react";
import axios from "axios";
import conf from "../../Conf/Conf";
import { useLocation, useNavigate } from "react-router-dom";

function SendOtp() {
  console.log("welcome to Request OTP Page");
  
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataUser, setDataUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const emailFromState = location.state?.email;
    const passwordFromState = location.state?.password;
    const dataUserFromState = location.state?.dataUser;
    const fullnameFromState = location.state?.fullname;
    if (emailFromState) setEmail(emailFromState);
    if (passwordFromState) setPassword(passwordFromState);
    if(dataUserFromState) setDataUser(dataUserFromState)
    if(fullnameFromState) setFullname(fullnameFromState)
  }, [location.state]);

  // console.log(`email: ${email}, password: ${password}, fullname: ${fullname} `);

  const RequestOtp = async () => {
    setError("");
    try {
        
      const response = await axios.post(
        `${conf.API_URL}/user/request-otp`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );


      
      if (response?.data?.success) {
        alert("OTP sent successfully");
        navigate("/verify-otp", {
          state: { email,password,fullname },
        });
      } else {
        setError("Failed to send OTP");
      }
    } catch (error) {
      console.error("OTP Error:", error);
      setError(
        error?.response?.data?.message ||
          "Error sending OTP, please try again"
      );
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

      {error && <p className="text-red-500">{error}</p>}

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
