import React, { useEffect, useState } from "react";
import axios from "axios";
import { GetStudentDetails } from "../Components";
import conf from "../Conf/Conf";
import { useNavigate, useParams } from "react-router-dom";
const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const classId = useParams();
// console.log("classid is:", classId);
const navigate = useNavigate();
  const fetchStudents = async () => {
    const res = await axios.post(`${conf.API_URL}/student/get/student/details/${classId.classId}`)
    console.log("students data:", res);
    
    setStudents(res.data.data.students);
  };

  const handleMarkAttendance = () => {
    // Navigate to or show attendance marking UI
    console.log("Navigate to mark attendance page");
    navigate("/mark/attendance")
    
  };

  useEffect(() => {
    fetchStudents();
  }, [classId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Student Attendance Overview</h2>
      <GetStudentDetails students={students} onMarkAttendance={handleMarkAttendance} />
    </div>
  );
};

export default StudentPage;
