import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import conf from "../../Conf/Conf";

function MarkAttendance() {
  const navigate = useNavigate();
  const { classId } = useParams();

  const [students, setStudents] = useState([]);
  const [marked, setMarked] = useState({}); // { EnrollmentNo: "Present" | "Absent" }
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState("Present"); // Selected marking mode

  // Fetch students once
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.post(
          `${conf.API_URL}/student/get/student/details/${classId}`
        );
        const sortedStudents = res.data.data.students
          .filter((s) => !isNaN(parseInt(s.EnrollmentNo)))
          .sort((a, b) => parseInt(a.EnrollmentNo) - parseInt(b.EnrollmentNo));
        setStudents(sortedStudents);
      } catch (err) {
        console.error("Error fetching students", err);
      }
    };
    fetchStudents();
  }, [classId]);

  // Mark attendance by EnrollmentNo
  const handleMark = (EnrollmentNo) => {
    setMarked((prev) => {
      if (prev[EnrollmentNo] === mode) {
        const copy = { ...prev };
        delete copy[EnrollmentNo];
        return copy;
      }
      return { ...prev, [EnrollmentNo]: mode };
    });
  };

  // Keyboard navigation & marking
  const handleKeyDown = useCallback(
    (e) => {
      const cols = 5;
      const total = students.length;

      switch (e.key) {
        case "ArrowRight":
          setActiveIndex((prev) => (prev + 1 < total ? prev + 1 : prev));
          break;
        case "ArrowLeft":
          setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
          break;
        case "ArrowDown":
          setActiveIndex((prev) => (prev + cols < total ? prev + cols : prev));
          break;
        case "ArrowUp":
          setActiveIndex((prev) => (prev - cols >= 0 ? prev - cols : prev));
          break;
        case "Enter":
          const student = students[activeIndex];
          if (student) handleMark(student.EnrollmentNo);
          break;
        default:
          break;
      }
    },
    [students, activeIndex, mode]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Submit attendance to backend
  const handleSubmit = async () => {
    const oppositeStatus = mode === "Present" ? "Absent" : "Present";

    try {
      const promises = students.map((student) => {
        const status = marked[student.EnrollmentNo] || oppositeStatus;
        return axios.post(
          `${conf.API_URL}/student/mark/attendance/${student._id}`,
          { status },
          { withCredentials: true }
        );
      });

      await Promise.all(promises);

      const newMarked = {};
      students.forEach((student) => {
        const status = marked[student.EnrollmentNo] || oppositeStatus;
        newMarked[student.EnrollmentNo] = status;
      });
      setMarked(newMarked);

      alert("Attendance saved successfully!");
      navigate(`/student/get/student/details/${classId}`);
    } catch (error) {
      alert("Error saving attendance");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>

      {/* Mode Selection */}
      <div className="flex items-center gap-4 mb-6">
        <span className="font-medium">Select Mode:</span>
        <button
          onClick={() => setMode("Present")}
          className={`px-3 py-1 rounded ${
            mode === "Present" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Present (✔️)
        </button>
        <button
          onClick={() => setMode("Absent")}
          className={`px-3 py-1 rounded ${
            mode === "Absent" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          Absent (❌)
        </button>
        <span className="text-sm text-gray-500 ml-auto">
          Use arrow keys ← ↑ → ↓ and press Enter or click to mark/unmark
        </span>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-5 gap-4">
        {students.map((student, idx) => {
          const EnrollmentNo = student.EnrollmentNo;
          const status = marked[EnrollmentNo];
          const isActive = idx === activeIndex;

          return (
            <div
              key={EnrollmentNo}
              className={`relative w-16 h-16 flex items-center justify-center text-xl font-bold rounded-full cursor-pointer
                transition duration-200
                ${
                  status === "Present"
                    ? "bg-green-200"
                    : status === "Absent"
                    ? "bg-red-200"
                    : "bg-gray-100 hover:bg-gray-300"
                }
                ${isActive ? "ring-4 ring-blue-500 bg-yellow-400" : ""}
              `}
              onClick={() => handleMark(EnrollmentNo)}
            >
      <div className="relative flex items-center justify-center w-full h-full">

      <span className="text-xl font-bold">
        {status === "Present" ? "✅" : status === "Absent" ? "❌" : EnrollmentNo.slice(-3)}
      </span>


      <span
        className="absolute text-xs font-semibold text-gray-700"
        style={{ bottom: "4px", right: "6px" }}
      >
        {EnrollmentNo.slice(-3)}
      </span>
      </div>
        </div>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Submit & Save Attendance
      </button>
    </div>
  );
}

export default MarkAttendance;
