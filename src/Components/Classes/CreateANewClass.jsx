import axios from "axios";
import html2pdf from "html2pdf.js";
import React, { useEffect, useRef, useState } from "react";
import conf from "../../Conf/Conf";
import { useNavigate } from "react-router-dom";
const ClassReport = ({students=[], cls, attendanceRecords = []}) =>{
// console.log("welcome to Class Report");

const {teacherId} = cls || {};
const [teach, setTeach] = useState();
const contentRef = useRef();
// console.log("teacherId is: ", teacherId);
// console.log("students are: ", students);
const navigate = useNavigate();
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
const handleDownloadPDF = () => {
  const element = contentRef.current;
  
      const hiddenElements = element.querySelectorAll(".no-pdf");
      hiddenElements.forEach(el => el.style.display = "none");
  
      const opt = {
        margin: 0.5,
        filename: `${cls?.className?.replace(/\s+/g, "_")}_Profile.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      };
  
      html2pdf().set(opt).from(element).save().then(() => {
        hiddenElements.forEach(el => el.style.display = "");
      });
}

return (
  <div className="p-6 bg-gray-100 min-h-screen"
  ref = {contentRef}
  >
    <div className="max-w-5xl mx-auto bg-gradient-to-b from-blue-50 to-white p-6 rounded-2xl shadow-lg relative">
      <div className="flex justify-between items-center mb-6 no-pdf">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
        onClick={()=> navigate(-1)}
        >
          ← Back
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700"
        >
          ⬇️ Download PDF
        </button>
      </div>

      <h2 className="text-4xl font-bold text-blue-800 text-center mb-8">
        🎓 Class Report
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-blue-900 font-semibold text-lg">📚 Course: <span className="text-gray-700">{cls?.courseName}</span></p>
          <p className="text-blue-900 font-semibold text-lg">🏫 Subject: <span className="text-gray-700">{cls?.className}</span></p>
          <p className="text-blue-900 font-semibold text-lg">Section Name: <span className="text-gray-700">{cls?.Section}</span></p>
          <p className="text-blue-900 font-semibold text-lg">👨‍🏫 Teacher: <span className="text-gray-700">{teach?.fullname}</span></p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-blue-900 font-semibold text-lg">📅 Batch Year: <span className="text-gray-700">{cls?.yearBatch}</span></p>
          <p className="text-blue-900 font-semibold text-lg">👥 Total Students: <span className="text-gray-700">{students.length}</span></p>
        </div>
      </div>

      {attendanceRecords.map((day) => (
        <div key={day.date} className="mb-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold text-blue-700 border-b pb-2 mb-4">
            📅 Date: {day.date}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-4 py-3 border border-gray-300">👤 Student Name</th>
                  <th className="px-4 py-3 border border-gray-300">🆔 Enrollment No</th>
                  <th className="px-4 py-3 border border-gray-300">📌 Status</th>
                </tr>
              </thead>
              <tbody>
                {day.records.map((record, index) => (
                  <tr key={index} className="even:bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-2 border border-gray-300">{record.Name}</td>
                    <td className="px-4 py-2 border border-gray-300">{record.EnrollmentNo}</td>
                    <td
                      className={`px-4 py-2 border border-gray-300 font-semibold ${
                        record.status === 'Present' ? 'text-green-600' : 'text-red-500'
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
  </div>
);



}

export default ClassReport;