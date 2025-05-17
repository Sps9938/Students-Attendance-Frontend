import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import conf from "../../Conf/Conf";

function AddStudentsForm({ classToken }) {
    const navigate = useNavigate();
    const [numberOfStudents, setNumberOfStudents] = useState(1);
    const [students, setStudents] = useState([{ Name: "", EnrollmentNo: "" }]);

    const handleNumberChange = (e) => {
        const value = parseInt(e.target.value);
        setNumberOfStudents(value);
        const updatedStudents = Array.from({ length: value }, () => ({
            Name: "",
            EnrollmentNo: ""
        }));
        setStudents(updatedStudents);
    };

    const handleStudentChange = (index, field, value) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = value;
        setStudents(updatedStudents);
    };

    const handleRemoveField = (index, field) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = "";
        setStudents(updatedStudents);
    };

    const handleExcelUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const workbook = XLSX.read(bstr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Read raw rows as arrays, no headers
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Filter rows with valid roll number and name
            const validRows = jsonData.filter(row => row[1] && row[2]);

            // Format: row[1] = EnrollmentNo, row[2] = Name
            const formattedStudents = validRows.map((row) => ({
                EnrollmentNo: row[1].toString().trim(),
                Name: row[2].toString().trim(),
            }));

            setStudents(formattedStudents);
            setNumberOfStudents(formattedStudents.length);
        };

        reader.readAsBinaryString(file);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            classToken: classToken,
            students: students,
        };

        try {
            const response = await axios.post(
                `${conf.API_URL}/student/add/students`,
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

    setStudents([]);
    navigate("/getclasses");

    alert(response ? "Students added successfully" : "Students are not added successfully");
} catch (error) {
    console.error("Error adding students", error);
}
};

return (
<div className="p-4 max-w-3xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Add Students</h1>

    {/* Excel Upload */}
    <div className="mb-4">
        <label className="block mb-2 font-medium">Upload Excel File:</label>
        <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelUpload}
            className="border p-2"
        />
        {/* <a
            href="/mnt/data/sample_students_template.xlsx"
            download
            className="ml-4 text-blue-600 underline text-sm"
        >
            Download Sample Template
        </a> */}
    </div>

    {/* Number of Students */}
    <div className="mb-4">
        <label className="block mb-2">Number of Students:</label>
        <input
            type="number"
            min="1"
            max="100"
            value={numberOfStudents}
            onChange={handleNumberChange}
            className="border p-2 w-20"
        />
    </div>

    {/* Student Form */}
    <form onSubmit={handleSubmit} className="space-y-4">
        {students.map((student, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4">
        <input
            type="text"
            placeholder={`Student ${index + 1} Name`}
            value={student.Name}
            onChange={(e) => handleStudentChange(index, "Name", e.target.value)}
            className="border p-2 flex-1"
            required
        />
        <input
            type="text"
            placeholder={`Student ${index + 1} Enrollment No.`}
            value={student.EnrollmentNo}
            onChange={(e) => handleStudentChange(index, "EnrollmentNo", e.target.value)}
            className="border p-2 flex-1"
            required
        />
        <div className="flex gap-2">
            {student.Name && (
                <button
                    type="button"
                    onClick={() => handleRemoveField(index, "Name")}
                    className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                >
                    Remove Name
                </button>
            )}
            {student.EnrollmentNo && (
                <button
                    type="button"
                    onClick={() => handleRemoveField(index, "EnrollmentNo")}
                    className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                >
                    Remove Enrollment No.
                </button>
            )}
        </div>
            </div>
    ))}

        {/* Submit & Back Buttons */}
        <div className="flex justify-center gap-3">
        <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
            Submit
        </button>
        <button
            type="button"
            onClick={() => navigate("/getclasses")}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
            Back
        </button>
                </div>
            </form>
        </div>
    );
}

export default AddStudentsForm;
