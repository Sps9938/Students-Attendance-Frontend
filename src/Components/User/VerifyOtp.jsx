import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import conf from "../../Conf/Conf";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../store/authSlice";

function VerifyOtp() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const emailFromState = location.state?.email;
    const passwordFromState = location.state?.password;
     

    if (emailFromState && passwordFromState) {
      setEmail(emailFromState);
      setPassword(passwordFromState);
    } else {
     
      alert("Missing record. Please request to Sign In again.");
      navigate("/signup");
    }
  }, [location, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    

    //    console.log(`emails is: ${email} and otp is: ${otp}`);
    try {
      // Verify OTP
      const response = await axios.post(
        `${conf.API_URL}/user/verify-otp`,
        { email, otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setSuccess(response.data?.message || "Email verified successfully");

      // Login after successful OTP verification
      const loginResponse = await axios.patch(
        `${conf.API_URL}/user/login`,
        { email, password },
        { withCredentials: true }
      );

      const result = loginResponse.data;
      if (result.success) {
        const { accessToken, refreshToken, user } = result.data;

        // Store tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Save user to redux
        dispatch(authLogin(user));

        // Navigate to home
        navigate("/");
      } else {
        setError(result.message || "Login failed");
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
