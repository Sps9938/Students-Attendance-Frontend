import React, { useEffect, useState } from "react";
import axios from "axios";
import { GetStudentDetails, LowAttendance } from "../Components";
import conf from "../Conf/Conf";
import { useNavigate, useParams } from "react-router-dom";
const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const {classId} = useParams();
// console.log("classid is:", classId);
const navigate = useNavigate();
  const fetchStudents = async () => {
   const res = await axios.get(`${conf.API_URL}/student/get/student/details/${classId}`,{
  withCredentials: true,
   })
    
  
    
    setStudents(res.data.data.students);
  };

  const handleMarkAttendance = () => {
    // Navigate to or show attendance marking UI
    console.log("Navigate to mark attendance page");
    navigate(`/student/mark/attendance/${classId}`)
    
  };

  useEffect(() => {
    fetchStudents();
  }, [classId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Student Attendance Overview</h2>
      
     <button
    onClick={() => navigate("/getclasses")}
    className="mb-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition"
  >
    ← Back to Class List
  </button>
      <GetStudentDetails students={students} onMarkAttendance={handleMarkAttendance} classId={classId}/>
      {/* <LowAttendance students={students} /> */}
    </div>
  );
};

export default StudentPage;
