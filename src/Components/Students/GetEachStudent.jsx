import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import axios from "axios";
import conf from "../../Conf/Conf";

function GetEachStudent({ student, attendanceSummary }) {
  const navigate = useNavigate();
  const contentRef = useRef();

  const [cls, setCls] = useState(null);
  const [tech, setTeach] = useState(null);

  const { Name, EnrollmentNo, attendance, percentage, class: classId } = student || {};
  const {totalClasses, TotalPrsent, TotalAbsent} = attendanceSummary || {};

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
  className="max-w-4xl mx-auto mt-10 p-10 bg-gradient-to-br from-blue-50 to-white shadow-2xl rounded-3xl border border-gray-200"
  ref={contentRef}
>
  {/* Top Buttons */}
  <div className="flex justify-between items-center mb-6 no-pdf">
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition"
    >
      ← Back
    </button>
    <button
      onClick={handleDownloadPDF}
      className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg shadow hover:bg-green-700 transition"
    >
      📄 Download PDF
    </button>
  </div>

  {/* Title */}
  <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
    🎓 Student Profile
  </h2>

  {/* Profile Info Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
    {/* Student Stats */}
    <div className="bg-white border rounded-xl p-5 shadow-md space-y-3">
      <p><strong className="text-blue-800">🧑 Student:</strong> <span className="text-gray-700">{Name}</span></p>
      <p><strong className="text-blue-800">🆔 Enroll No:</strong> <span className="text-gray-700">{EnrollmentNo}</span></p>
      <p><strong className="text-blue-800">📚 Total Classes:</strong> <span className="text-gray-700">{totalClasses}</span></p>
      <p><strong className="text-green-700">✔️ Present:</strong> <span className="text-gray-700">{TotalPrsent}</span></p>
      <p><strong className="text-red-600">❌ Absent:</strong> <span className="text-gray-700">{TotalAbsent}</span></p>
      <p>
        <strong className="text-blue-800">📊 Percentage:</strong>{" "}
        <span
          className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
            percentage >= 75 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {percentage}%
        </span>
      </p>
    </div>
     {/* Faculty and Class Info */}
    <div className="bg-white border rounded-xl p-5 shadow-md space-y-3">
      <p><strong className="text-blue-800">👨‍🏫 Faculty:</strong> <span className="text-gray-700">{tech?.fullname}</span></p>
      <p><strong className="text-blue-800">🏫 Class:</strong> <span className="text-gray-700">{cls?.className}</span></p>
      <p><strong className="text-blue-800">📘 Course:</strong> <span className="text-gray-700">{cls?.courseName}</span></p>
      <p><strong className="text-blue-800">📅 Batch:</strong> <span className="text-gray-700">{cls?.yearBatch}</span></p>
    </div>
  </div>

  {/* Attendance Table */}
  <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
    📆 Attendance Records
  </h3>

  <div className="overflow-hidden rounded-xl border border-gray-300 shadow-md">
    <table className="w-full text-left table-auto">
      <thead className="bg-blue-100 text-blue-900 uppercase text-sm">
        <tr>
          <th className="px-5 py-3">Date</th>
          <th className="px-5 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {attendance.map((record) => (
          <tr
            key={record._id}
            className="even:bg-white odd:bg-gray-50 hover:bg-blue-50 transition"
          >
            <td className="px-5 py-3 text-gray-700">
              {new Date(record.date).toLocaleDateString()}
            </td>
            <td>
              <span
                className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                  record.status === "Present"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {record.status}
              </span>
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
