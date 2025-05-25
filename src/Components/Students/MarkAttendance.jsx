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
        const res = await axios.get(
          `${conf.API_URL}/student/get/student/details/${classId}`,{
            withCredentials: true,
          }
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
    //here after save all status save in database one by one using map

    if(Object.keys(marked).length === 0) {
      alert("Please mark at least one student before submitting");
      return;
}

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
      /*
      mode = "Present"
      marked = { "101": "Present", "104": "Present" }
      students = [ "101", "102", "103", "104", "105" ]

      see how it works when mode[student.enrollmentno] = 101 -> save as Present
      when mode[student.enrollmentno] = 102 => not found it means or as oppositeStaus -> save as Absent
      */
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
    <div className="flex flex-col md:flex-row items-center justify-start gap-4 mb-6">
      <label className="text-base font-semibold text-gray-700">Select Mode:</label>
      
      <select
        value={mode}
        onChange={(e) => {
          const selectedMode = e.target.value;
          setMode(selectedMode);

          e.target.blur();
          /*
          Q.) Why use blur() in your case?
          -> After you select a mode from the dropdown (<select>), the dropdown stays focused. This creates a problem:

          -> 🔼🔽 When you press arrow keys (up/down/left/right), the dropdown still receives those keys and changes its value — not your student grid.

          -> This breaks your keyboard-only navigation logic meant for student cell selection.

          -> By calling e.target.blur():

          -> The dropdown loses focus immediately after you select a value.

          -> Now, arrow keys will be handled by your custom keyboard logic (handleKeyDown for the grid), not the dropdown.
          */
          if (selectedMode === "Mark All Present" || selectedMode === "Mark All Absent") {
            const allMarked = {};
            students.forEach((s) => {
              allMarked[s.EnrollmentNo] =
                selectedMode === "Mark All Present" ? "Present" : "Absent";
            });
            setMarked(allMarked);
          }

          if (selectedMode === "Clear All Marks") {
            setMarked({});
          }
        }}
        className="w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
      >
        <option value="">-- Select --</option>
        <option value="Present">✅ Present(Single Cell)</option>
        <option value="Absent">❌ Absent(Single Cell)</option>
        <option value="Mark All Present">✔️ Mark All Present(All Cells)</option>
        <option value="Mark All Absent">❌ Mark All Absent(All Cells)</option>
        <option value="Clear All Marks">🧹 Clear All Marks(All Cells)</option>
      </select>
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
        className={`relative w-16 h-16 flex items-center justify-center text-xl font-bold cursor-pointer
        transition duration-200 border border-gray-300
        ${status === "Present"
        ? "bg-green-200"
        : status === "Absent"
          ? "bg-red-200"
          : "bg-gray-100 hover:bg-yellow-500"
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
      <div className="flex justify-center mt-6">
        <div className="md:w-1/4 w-full flex flex-row gap-3 justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
          >
            Submit Mark Attendance
          </button>

          <button
            type="button"
            onClick={() => navigate(`/student/get/student/details/${classId}`)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded w-full"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;
