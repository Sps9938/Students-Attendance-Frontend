import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function LowAttendance() {
    const { state } = useLocation();
    const students = state?.students || [];

    // console.log("students data", students);
    const navigate = useNavigate();
    const [threshold, setThreshold] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);

    useEffect(() => {
        if (threshold === "") {
            setFilteredStudents([]);
            return;
        }

        const value = parseFloat(threshold);//it will convert string or number to proper value if you are typing abc,,,or any it take as NaN
        if (!isNaN(value) && students?.length > 0) {
            const lowAttendance = students.filter((stu) => stu.percentage < value);
            setFilteredStudents(lowAttendance);
        }
    }, [threshold, students]);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">

            <button
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium 
                rounded-lg shadow hover:bg-blue-700 transition"
            >
                ← Back to Student List
            </button>

            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                🎯 Search Students Below Specific Attendance %
            </h2>

            <div className="mb-6 flex items-center gap-4">
                <label className="font-medium text-gray-700 text-lg">Show students with percentage below:</label>
                <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="border px-3 py-1 rounded w-24"
                    placeholder="e.g. 75"
                    min="0"
                    max="100"
                />
                <span className="text-lg font-medium">%</span>
            </div>

            {threshold && (
            <table className="w-full mt-4 table-auto text-left border">
                <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Enrollment No</th>
                    <th className="px-4 py-2">Percentage</th>
            </tr>
                </thead>
                <tbody>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((stu) => (
                <tr key={stu.EnrollmentNo} className="border-t hover:bg-red-50">
                    <td className="px-4 py-2">{stu.Name}</td>
                    <td className="px-4 py-2">{stu.EnrollmentNo}</td>
                    <td className="px-4 py-2 text-red-600 font-semibold">{stu.percentage}%</td>
                </tr>
                    ))
                    ) : (
                <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">
                    No students found below {threshold}%.
                </td>
                </tr>
            )}
                </tbody>
            </table>
            )}
        </div>
    );
}

export default LowAttendance;
