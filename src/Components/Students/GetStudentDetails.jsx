import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import conf from "../../Conf/Conf";
import { useState } from "react";
import { useEffect } from "react";


const GetStudentDetails = ({ students = [], onMarkAttendance, classId }) => {
  // console.log("students details:", students);
  
    const navigete = useNavigate();
 
    const handleSubmit = () => {
   
      navigete("/low/attendance", {
        state: {students}
      })
    }
 
    const deleteStudent = async(studentId) => {
      // console.log("studentId is: ", studentId);
      
      const confirmed = window.confirm("Are you sure want to delete this student on Your class");
        if(!confirmed) {
            // navigate(-1);
            return;
        }
            try {
                
                const response = await axios.delete(`${conf.API_URL}/student/delete/student/${studentId}`,{
                  withCredentials: true,
                });

                if(response?.data.success){
                    alert("Student Record deleted Sucessfully");
                    window.location.reload();
                  
                } 
                else{
                    alert("Failed to delete the student");
                }
            } catch (error) {
                console.error("Student Not Fetched",error);
                alert("Student NOt Deleted, Something went to wrong");
                
            }
        }

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      {/* Left Side: Actions */}
      <div className="md:w-1/4 w-full flex flex-col gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <button
          onClick={onMarkAttendance}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
        >
          Mark Attendance
        </button>

        <button
          onClick={handleSubmit}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded w-full"
        >
          Low Attendance
        </button>
      </div>

      {/* Right Side: Student Table */}
      <div className="md:w-3/4 w-full">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left px-4 py-2 text-gray-900 dark:text-gray-100">Student Name</th>
                <th className="text-left px-4 py-2 text-gray-900 dark:text-gray-100">Enrollment No</th>
                <th className="text-left px-4 py-2 text-gray-900 dark:text-gray-100">Percentage (%)</th>
                <th className="text-left px-4 py-2 text-gray-900 dark:text-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student._id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
                >
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{student.Name}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{student.EnrollmentNo}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{student.percentage || 0}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <button
                        className="text-blue-600 dark:text-blue-400 underline"
                        onClick={() => navigete(`/get/each/student/detais/${student._id}`)}
                      >
                        Get Details
                      </button>
                      <button
                        className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md transition duration-200"
                        onClick={() => deleteStudent(student._id)}
                        title="Delete student"
                        aria-label="Delete student"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GetStudentDetails;
