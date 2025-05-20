import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function LowAttendance() {
    const { state } = useLocation();
    const students = state?.students || [];
    const navigate = useNavigate();

    const [mode, setMode] = useState("range"); // 'range' or 'below'
    const [minThreshold, setMinThreshold] = useState("");
    const [maxThreshold, setMaxThreshold] = useState("");
    const [belowValues, setBelowValues] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);

    useEffect(() => {
        let filtered = [];

        if (students.length === 0) {
            setFilteredStudents([]);
            return;
        }

        if (mode === "range") {
            const min = parseFloat(minThreshold);
            const max = parseFloat(maxThreshold);
            if (!isNaN(min) && !isNaN(max) && min <= max) {
                filtered = students.filter(
                    (stu) => stu.percentage >= min && stu.percentage <= max
                );
            }
        } else if (mode === "below") {
            const thresholds = belowValues
                .split(",")
                .map((v) => parseFloat(v.trim()))
                .filter((v) => !isNaN(v));

            if (thresholds.length > 0) {
                filtered = students.filter((stu) =>
                    thresholds.some((threshold) => stu.percentage < threshold)
                );
            }
        }

        setFilteredStudents(filtered);
    }, [minThreshold, maxThreshold, belowValues, students, mode]);

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
            🎯 Filter Students by Attendance
        </h2>

        <div className="mb-4">
            <label className="mr-3 font-medium">Select Filter Mode:</label>
            <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="border px-3 py-1 rounded"
            >
                <option value="range">Percentage Range</option>
                <option value="below">Below Values</option>
            </select>
        </div>

            {mode === "range" ? (
        <div className="mb-6 flex flex-wrap items-center gap-4">
            <label className="font-medium text-gray-700 text-lg">Between:</label>
            <input
                type="number"
                value={minThreshold}
                onChange={(e) => setMinThreshold(e.target.value)}
                className="border px-3 py-1 rounded w-24"
                placeholder="Min (e.g. 75)"
                min="0"
                max="100"
            />
            <span className="text-lg font-medium">and</span>
            <input
                type="number"
                value={maxThreshold}
                onChange={(e) => setMaxThreshold(e.target.value)}
                className="border px-3 py-1 rounded w-24"
                placeholder="Max (e.g. 85)"
                min="0"
                max="100"
            />
            <span className="text-lg font-medium">%</span>
        </div>
            ) : (
        <div className="mb-6">
            <label className="font-medium text-gray-700 text-lg mr-3">
                Show students below (comma-separated):
            </label>
            <input
                type="text"
                value={belowValues}
                onChange={(e) => setBelowValues(e.target.value)}
                className="border px-3 py-1 rounded w-64"
                placeholder="e.g. 75, 65, 50"
            />
        </div>
            )}

            {(mode === "range"
        ? minThreshold !== "" && maxThreshold !== ""
        : belowValues.trim() !== "") && (
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
        <tr key={stu.EnrollmentNo} className="border-t hover:bg-yellow-50">
            <td className="px-4 py-2">{stu.Name}</td>
            <td className="px-4 py-2">{stu.EnrollmentNo}</td>
            <td className="px-4 py-2 text-yellow-700 font-semibold">
                {stu.percentage}%
            </td>
            </tr>
            ))
        ) : (
            <tr>
        <td colSpan="3" className="text-center text-gray-500 py-4">
            No students found {mode === "range"
                ? `between ${minThreshold}% and ${maxThreshold}%`
                : `below any of: ${belowValues}`}.
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
