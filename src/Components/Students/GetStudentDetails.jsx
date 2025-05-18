import React from "react";
import { useNavigate } from "react-router-dom";


const GetStudentDetails = ({ students = [], onMarkAttendance }) => {
  // console.log("students details:", students);
  
    const navigete = useNavigate();
 
    const handleSubmit = () => {
   
      navigete("/low/attendance", {
        state: {students}
      })
    }
  return (
  <div className="flex flex-col md:flex-row p-4 gap-4">
    {/* Left Side: Mark Attendance Button */}
    <div className="md:w-1/4 w-full flex flex-col gap-3">
      <button
        onClick={onMarkAttendance}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full]"
      >
        Mark Attendance
      </button>

      <button
        onClick={handleSubmit}
        className="bg-red-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded w-full]"
      >
        LowAttendeance
      </button>
      {/* <button
        onClick={()=> navigete("/getclasses")}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded w-full]"
      >
        Back
      </button> */}
    </div>

  {/* Right Side: Student Table */}
  <div className="md:w-3/4 w-full overflow-x-auto">
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="text-left px-4 py-2">Student Name</th>
          <th className="text-left px-4 py-2">Enrollment No</th>
          <th className="text-left px-4 py-2">Percentage (%)</th>
        </tr>
      </thead>
      <tbody>
      {students.map((student) => (
        <tr
          key={student._id}
          className="border-b hover:bg-gray-50 transition-colors"
        >
          <td className="px-4 py-2">{student.Name}</td>
          <td className="px-4 py-2">{student.EnrollmentNo}</td>
          <td className="px-4 py-2">
            {student.percentage || 0}
          </td>
          <button className="text-blue-600 underline"
          onClick={() => navigete(`/get/each/student/detais/${student._id}`)}
          >
            Get Details</button>
        </tr>
      ))}
    </tbody>
      </table>
    </div>
  </div>
  );
};

export default GetStudentDetails;
