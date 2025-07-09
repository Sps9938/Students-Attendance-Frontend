import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import conf from "../../Conf/Conf";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../../Store/authSlice";
import { useForm, useFormState } from "react-hook-form";

function VerifyOtp() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
 


  const location = useLocation();
  const navigate = useNavigate();
  const { reset } = useForm();


    // console.log(`email: ${email}, password: ${password}, fullname: ${fullname} `)
  useEffect(() => {
  const emailFromState = location?.state?.email;
  if(emailFromState) setEmail(emailFromState);
  
  const fullnameFromState = location?.state?.fullname;
  if(fullnameFromState) setFullname(fullnameFromState);

  }, [location.state]);

  useEffect(() => {
    // console.log("Hello");
    
    const fetchUser = async() => {
      try {
        const response = await axios.get(`${conf.API_URL}/user/get-user`,{
          withCredentials: true,
        });
        if(response?.data?.data){
          setUser(response.data.data);
        }

        // console.log("response is:", response.data.data);
        
      } catch (error) {
        console.error("User Not Fetched", error);
        
      }
    }
    // console.log("user Data are:", user);
    fetchUser();
  },[])

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
const forget = async () => {
  try {
    const forgetUserData = JSON.parse(sessionStorage.getItem("forgetUserData"));

    if (!forgetUserData) {
      console.error("No Data  found in sessionStorage.");
      setError("Something went wrong. Please try again.");
      return;
    }

    // const { newPassword, renewPassword, email } = forgetUserData;
      const res = await axios.patch(`${conf.API_URL}/user/forget-password`, 
        forgetUserData,
        {
          withCredentials: true,
      });

      // console.log("Password reset successfully", res);
      alert("Password reset successfully!");

      sessionStorage.removeItem("forgetUserData");
      
      navigate("/login")
      reset();
  

  } catch (err) {
    console.error("Failed to Reset Password", err);
    setError("An error occurred during Foret.");
  }
};

  // console.log("user Data are: ", user);

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
  
      //here if user not exist -> it means new user try to rgister then call registeration();
      //if user extst-> it means user alread exsti and try to update their details 

      if(!user) {
        const registerData = JSON.parse(sessionStorage.getItem("registerData"))
        const forgetUserData = JSON.parse(sessionStorage.getItem("forgetUserData"))
        // console.log("registerData: ", registerData);
        
        if(registerData) registration();
        if(forgetUserData) forget();
      }
      else{
        try {
          
          const response = await axios.patch(`${conf.API_URL}/user/update-user-details`,
            {fullname, email},{
              withCredentials: true,
            }
          )

        alert("User details Updated");
        navigate("/user");
        } catch (error) {
           const html = error.response?.data || "";
        // console.log("html", html);
        
        const match = html.match(/Error:\s(.+?)<br>/);
        // console.log("match: ", match);
        
       
        const errMsg = match ? match[1] : "Something went wrong";

        setError(errMsg);
        console.error("Failed to Update UserDetails");
        }
        
      }
  
      // navigate("/user");
      
    
}
   catch (error) {
    console.error("Verify OTP Error:", error);
    const html = error.response?.data || "";
        // console.log("html", html);
        
        const match = html.match(/Error:\s(.+?)<br>/);
        // console.log("match: ", match);
        
       
        const errMsg = match ? match[1] : "Something went wrong";

        setError(errMsg);
  } finally {
    setLoading(false);
  }
};


const handleOtp = async()=>{
 try {
   const response = await axios.post(`${conf.API_URL}/user/request-otp`,
         {email},{
           withCredentials: true,
         }
    )
    alert("OTP sent")
 } catch (error) {
  const html = error.response?.data || "";
        // console.log("html", html);
        
        const match = html.match(/Error:\s(.+?)<br>/);
        // console.log("match: ", match);
        
       
        const errMsg = match ? match[1] : "Something went wrong";

        setError(errMsg);
 }

}
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
   <div className="flex justify-center gap-4 mt-4">
  {/* Verify OTP Button */}
  <button
    type="submit"
    disabled={loading}
    className={`bg-green-500 text-white px-6 py-2 rounded-lg transition duration-200 ${
      loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
    }`}
  >
    {loading ? "Verifying..." : "Verify OTP"}
  </button>

  {/* Send Again Button */}
  <button
    type="button"
    onClick={handleOtp}
    className="text-blue-600 underline hover:text-blue-800 font-medium transition duration-200"
  >
    Send Again
  </button>
</div>

    </form>
  );
}

export default VerifyOtp;
