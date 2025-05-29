import axios from "axios";
import React, { useEffect, useState } from "react";
import conf from "../../Conf/Conf";
const ClassReport = ({students=[], cls, attendanceRecords = []}) =>{
// console.log("welcome to Class Report");

const {teacherId} = cls || {};
const[teach, setTeach] = useState();
// console.log("teacherId is: ", teacherId);
// console.log("students are: ", students);

useEffect(() => {

const fetchTeacher = async() => {
    try {
        
        const response = await axios.get(`${conf.API_URL}/user/get-user`,{
            withCredentials: true,
        });
        if(response?.data){
            setTeach(response.data.data);
        }
    } catch (error) {
        console.error("Failed to Fetched user",error);
        alert("Failed to Fetched user");
    }
}
    fetchTeacher();
},[teacherId])


  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-6xl mx-auto">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold text-blue-800 mb-4">📘 Class Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p><strong>Course:</strong> {cls?.courseName}</p>
        <p><strong>Subject:</strong> {cls?.className}</p>
        <p><strong>Teacher:</strong> {teach?.fullname}</p>
        <p><strong>Batch Year:</strong> {cls?.yearBatch}</p>
        <p><strong>Total Students:</strong> {students.length}</p>
        </div>
      </div>

      {attendanceRecords.map((day) => (
        <div key={day.date} className="mb-10 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">
            📅 Date: {day.date}
          </h3>
        <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
            <thead>
        <tr className="bg-blue-100 text-left">
            <th className="border border-gray-300 px-4 py-3">Student Name</th>
            <th className="border border-gray-300 px-4 py-3">Enrollment No</th>
            <th className="border border-gray-300 px-4 py-3">Status</th>
        </tr>
        </thead>
        <tbody>
    {day.records.map((record, index) => (
        <tr key={index} className="even:bg-gray-50 hover:bg-gray-100">
        <td className="border border-gray-300 px-4 py-2">{record.Name}</td>
        <td className="border border-gray-300 px-4 py-2">{record.EnrollmentNo}</td>
        <td
        className={`border border-gray-300 px-4 py-2 font-semibold ${
        record.status === 'Present'
            ? 'text-green-600'
            : 'text-red-500'
        }`}
        >
        {record.status}
    </td>
            </tr>
        ))}
        </tbody>
    </table>
    </div>
        </div>
      ))}
    </div>
  );



}

export default ClassReport;