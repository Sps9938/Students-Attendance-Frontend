import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import conf from "../Conf/Conf";
import { GetEachStudent } from "../Components";

const SingleStudentPage = () => {
const { studentId } = useParams();
const [student , setStudent] = useState(null);
const [attendanceSummary, setAttendanceSummary] = useState(null)
const navigate = useNavigate();

const fetchStudent = async () => {
const res = await axios.get(`${conf.API_URL}/student/get/each/student/details/${studentId}`,{
  withCredentials:true,
})
console.log("student data:", res);

setStudent(res.data.data.student);
setAttendanceSummary(res.data.data.attendanceSummary)
};



useEffect(() => {
fetchStudent();
}, [studentId]);

return (
    <div className="min-h-screen bg-gray-100 p-4">
   <GetEachStudent student={student} attendanceSummary={attendanceSummary} />
    </div>
  );
};
export default SingleStudentPage;