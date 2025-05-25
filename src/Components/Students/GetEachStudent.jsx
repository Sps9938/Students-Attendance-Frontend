import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import axios from "axios";
import conf from "../../Conf/Conf";

function GetEachStudent({ student }) {
  const navigate = useNavigate();
  const contentRef = useRef();

  const [cls, setCls] = useState(null);
  const [tech, setTeach] = useState(null);

  const { Name, EnrollmentNo, attendance, percentage, class: classId } = student || {};

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get(`${conf.API_URL}/class/get/single/class/${classId}`,{
          withCredentials: true,
        });
        if (res?.data) {
          setCls(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching class:", err);
      }
    };
    if (classId) fetchClass();
  }, [classId]);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (cls?.teacherId) {
        try {
          const res = await axios.get(`${conf.API_URL}/user/get-user`,{
            withCredentials: true,
          });
          if (res?.data) {
            setTeach(res.data.data);
          }
        } catch (err) {
          console.error("Error fetching teacher:", err);
        }
      }
    };
    fetchTeacher();
  }, [cls]);

  const handleDownloadPDF = () => {
    const element = contentRef.current;

    const hiddenElements = element.querySelectorAll(".no-pdf");
    hiddenElements.forEach(el => el.style.display = "none");

    const opt = {
      margin: 0.5,
      filename: `${Name?.replace(/\s+/g, "_")}_Profile.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      hiddenElements.forEach(el => el.style.display = "");
    });
  };

  if (!student) {
    return <p className="text-center text-gray-500">Loading student details...</p>;
  }

  console.log("class details: ", cls);
  console.log("teacher details: ", tech);
  
  
  return (
    <div
      className="max-w-3xl mx-auto mt-10 p-8 bg-gradient-to-r from-white to-blue-50 shadow-2xl rounded-3xl border border-gray-200"
      ref={contentRef}
    >
      <div className="flex mb-6 space-x-4 no-pdf">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition"
        >
          ← Back to Student List
        </button>

        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg shadow hover:bg-green-700 transition"
        >
          📥 Download PDF
        </button>
      </div>

      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">🎓 Student Profile</h2>

      <div className="mb-8 grid grid-cols-[160px_auto] gap-y-4 text-lg">
        <span className="font-semibold text-gray-800">Faculty Name:</span>
        <span className="text-gray-700">{tech?.fullname || "Loading..."}</span>

        <span className="font-semibold text-gray-800">Class Name:</span>
        <span className="text-gray-700">{cls?.className || "Loading..."}</span>

        <span className="font-semibold text-gray-800">Course Name:</span>
        <span className="text-gray-700">{cls?.courseName || "Loading..."}</span>

        <span className="font-semibold text-gray-800">Batch Year:</span>
        <span className="text-gray-700">{cls?.yearBatch || "Loading..."}</span>

        <span className="font-semibold text-gray-800">Student Name:</span>
        <span className="text-gray-700">{Name}</span>

        <span className="font-semibold text-gray-800">Enrollment No:</span>
        <span className="text-gray-700">{EnrollmentNo}</span>

        <span className="font-semibold text-gray-800">Percentage:</span>
        <span className={`font-bold ${percentage >= 75 ? 'text-blue-400' : 'text-red-500'}`}>
          {percentage}%
        </span>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-4">📅 Attendance Records</h3>
      <div className="overflow-hidden rounded-xl border border-gray-300 shadow-sm">
        <table className="w-full text-left table-auto">
          <thead className="bg-blue-100 text-blue-900 uppercase text-sm">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record._id} className="even:bg-white odd:bg-gray-50 hover:bg-blue-50 transition">
                <td className="px-4 py-3 text-gray-700">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className={`px-4 py-3 font-semibold ${record.status === 'Present' ? 'text-blue-600' : 'text-red-600'}`}>
                  {record.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GetEachStudent;
