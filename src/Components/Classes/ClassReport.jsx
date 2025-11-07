import axios from "axios";
import html2pdf from "html2pdf.js";
import React, { useEffect, useRef, useState } from "react";
import conf from "../../Conf/Conf";
import { useNavigate } from "react-router-dom";

const ClassReport = ({ students = [], cls, attendanceRecords = [] }) => {
  const { teacherId } = cls || {};
  const [teach, setTeach] = useState();
  const contentRef = useRef();
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState("");
  const [searchEnrollment, setSearchEnrollment] = useState("");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`${conf.API_URL}/user/get-user`, {
          withCredentials: true,
        });
        if (response?.data) {
          setTeach(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        alert("Failed to fetch user");
      }
    };
    fetchTeacher();
  }, [teacherId]);
  // console.log(cls);
  // console.log(attendanceRecords);
  
  

const handleDownloadPDF = () => {
  const element = contentRef.current;

  // Hide elements with class 'no-pdf' during PDF generation
  const hiddenElements = element.querySelectorAll(".no-pdf");
  hiddenElements.forEach((el) => (el.style.display = "none"));

  // Apply custom class-based page breaks
  const breakElements = element.querySelectorAll(".pdf-page-break");
  breakElements.forEach((el) => {
    el.style.pageBreakBefore = "always"; // For most browsers
    el.style.breakBefore = "page";       // For modern browsers
  });

  const opt = {
    margin: 0.5,
    filename: `${cls?.className?.replace(/\s+/g, "_")}_Attendance_Summary.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      // Restore original styles after saving PDF
      hiddenElements.forEach((el) => (el.style.display = ""));
      breakElements.forEach((el) => {
        el.style.pageBreakBefore = "";
        el.style.breakBefore = "";
      });
    });
};

  // Build a student map and fill attendance per date
  const studentMap = {};

  students.forEach((student) => {
    studentMap[student._id] = {
      Name: student.Name,
      EnrollmentNo: student.EnrollmentNo,
      attendance: {},
    };
  });

  attendanceRecords.forEach((day) => {
    day.records.forEach((record) => {
      const matchedStudent = students.find(
        (stu) => stu.EnrollmentNo === record.EnrollmentNo
      );

      if (matchedStudent && studentMap[matchedStudent._id]) {
        studentMap[matchedStudent._id].attendance[day.date] =
          record.status === "Present" ? "P" : "A";
      }
    });
  });
//attendanceDates->
  const attendanceDates = attendanceRecords.map((d) => d.date);

  // Highlight matching student
  const highlightedId = students.find((stu) => {
    const nameMatch =
      searchName && stu.Name.toLowerCase().includes(searchName.toLowerCase());
    const rollMatch =
      searchEnrollment &&
      stu.EnrollmentNo.toLowerCase() === searchEnrollment.toLowerCase();
    return nameMatch || rollMatch;
  })?._id;

  // Helper to chunk dates into groups of 10
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const chunkedDates = chunkArray(attendanceDates, 5); // chunks of 10 dates

  return (
    <div className="p-6 bg-gray-100 min-h-screen" ref={contentRef}>
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg relative">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6 no-pdf">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            ⬇️ Download PDF
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-4 text-blue-800">
          📄 Attendance Summary Report
        </h2>

        {/* Class Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p>
              <b>📚 Course:</b> {cls?.courseName}
            </p>
            <p>
              <b>🏫 Subject:</b> {cls?.className}
            </p>
            <p>
              <b>👨‍🏫 Professor:</b> {teach?.fullname}
            </p>
          </div>
          <div>
            <p>
              <b>📅 Batch Year:</b> {cls?.yearBatch}
            </p>
            <p>
              <b>👥 Total Students:</b> {students.length}
            </p>
            <p>
              <b>👥 Total Classes:</b> {attendanceRecords?.length}
            </p>
          </div>
        </div>

        {/* Search Filters */}
        <div className="mb-4 flex flex-col md:flex-row gap-4 no-pdf">
          <input
            type="text"
            placeholder="🔍 Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/2"
          />
          <input
            type="text"
            placeholder="🔍 Search by Enrollment No"
            value={searchEnrollment}
            onChange={(e) => setSearchEnrollment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/2"
          />
        </div>

        {/* Attendance Table – Paginated by 10 dates */}
        {chunkedDates.map((dateChunk, pageIndex) => (
          <div key={pageIndex} className={`mb-8 ${pageIndex > 0 ? "pdf-page-break" : ""}`}>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">
              📄 Page {pageIndex + 1}
            </h3>
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full text-center text-sm">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Enrollment</th>
                    {dateChunk.map((date) => (
                      <th key={date} className="border px-4 py-2">
                        {date}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(studentMap).map(([id, student], idx) => (
                    <tr
                      key={idx}
                      className={`${
                        highlightedId === id ? "bg-yellow-200 font-semibold" : ""
                      }`}
                    >
                      <td className="border px-4 py-2">{student.Name}</td>
                      <td className="border px-4 py-2">{student.EnrollmentNo}</td>
                      {dateChunk.map((date, i) => (
                        <td key={i} className="border px-4 py-2">
                          {student.attendance[date] || ""}
                        </td>
                      ))}
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
};

export default ClassReport;
