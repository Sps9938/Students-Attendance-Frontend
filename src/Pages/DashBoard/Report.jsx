import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import conf from "../../Conf/Conf";
import axios from "axios";
import { ClassReport } from "../../Components";
import { set } from "react-hook-form";
function Report(){
// console.log("welcome to report page");
const navigate = useNavigate();
const {classId} = useParams();
const [students, setStudents] = useState();
const [attendanceRecords, setAttendanceRecords] = useState();
const [cls, setCls] = useState();

// console.log("class id is: ", classId);

const transformAttendanceData = (students)=> {
    const dateMap = {};
    students.forEach((student) => {
        student.attendance.forEach(({date, status}) => {
            const formattedDate = new Date(date).toLocaleDateString();
            if(!dateMap[formattedDate]){
                dateMap[formattedDate] = [];
            }
            dateMap[formattedDate].push({
                Name: student.Name,
                EnrollmentNo: student.EnrollmentNo,
                status,
            })
        })
    })

    return Object.keys(dateMap)
        .sort()
        .map((date) => ({
            date,
            records: dateMap[date],
        }))

}
useEffect(() => {
    const fetchStudent = async() => {
        try {
            
            const response = await axios.get(`${conf.API_URL}/student/get/student/details/${classId}`,{
                withCredentials: true,
            });
            // console.log("resonse: ", response);
            
            if(response?.data.data){
                setStudents(response.data.data.students);
                // console.log("students are: ",response.data.data.students );
                
                const transformed = transformAttendanceData(response.data.data.students);
                if(transformed)
                    setAttendanceRecords(transformed);
                // console.log("transformed: ", transformed);
                
            }

            const res = await axios.get(`${conf.API_URL}/class/get/single/class/${classId}`,{
                withCredentials: true,
            });
            if(res?.data){
                setCls(res.data.data);
            }
        } catch (error) {
            console.error("Failed to Fetched student details",error);
            alert("Failed to Fetched student details")
        }
    }
    fetchStudent();
},[classId])

// console.log("students length is: ",students.length);;
// console.log("classs is: ", cls);
// console.log("attendancRecord : ", attendanceRecords);




  return (
   <div>      
{students && cls && attendanceRecords && (
        <ClassReport students={students} cls={cls} attendanceRecords={attendanceRecords}/>
)}
    </div>
  )

}

export default Report;