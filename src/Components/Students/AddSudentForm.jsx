import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import conf from "../../Conf/Conf";

function AddStudentsForm({ classId }) {
    // console.log("welcome student Form classId is: ",classId);
    
    const navigate = useNavigate();
    const [numberOfStudents, setNumberOfStudents] = useState(1);
    const [students, setStudents] = useState([{ Name: "", EnrollmentNo: "" }]);
    const [duplicateFields, setDuplicateFields ] = useState([]);
    // const [duplicates, setDuplicates] = useState([]);
    const checkDuplicatesBeforeSubmit = async() => {
        try {
        
            const response = await axios.post(`${conf.API_URL}/student/check/duplicates/${classId}`,
                {students},
                {
                    headers: { "Content-Type": "application/json"},
                    withCredentials: true,
                }
            );
     
            
            if(response?.data){
                const duplicates = response.data.data || [];

                // console.log("duplicates: ", duplicates);
                const duplicateIndexes = students.map((s, index) => {

                    const isDuplicate = duplicates.some(d => 
                        d.Name?.toLowerCase() === s.Name?.toLowerCase() ||
                        d.EnrollmentNo?.toLowerCase() === s.EnrollmentNo?.toLowerCase()

                );
                return isDuplicate ? index : null;
                }).filter(i => i != null);

                setDuplicateFields(duplicateIndexes);
                return duplicateIndexes.length === 0;
            }
         

        } catch (error) {
            console.error("Duplicates check failed", error);
            return false;
            
        }
    }


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

    const handleRemoveField = (index) => {
    const updatedStudents = [...students];
    updatedStudents.splice(index, 1); 
    setStudents(updatedStudents); 

    const  value = numberOfStudents;
    setNumberOfStudents(value-1);
    }


const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Step 1: Get raw data for header detection
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!rawData || rawData.length === 0) {
            alert("Excel file is empty.");
            return;
        }

        const firstRow = rawData[0].map(cell => cell?.toString().toLowerCase().trim());

        const hasHeaders =
            firstRow.includes("Enrollment No") ||
            firstRow.includes("EnrollmentNo") ||
            firstRow.includes("Student Name") ||
            firstRow.includes("Name");

        let formattedStudents = [];

        if (hasHeaders) {
            // Step 2: Parse using headers
            const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
            formattedStudents = data.map((row) => {
                const Name = row["Name"] || row["Student Name"] || row["Name"] || row["Student Name"];
                const Enrollment = row["EnrollmentNo"] || row["Enrollment No"] || row["Enrollment No"] || row["EnrollmentNo"];
                if (Name && Enrollment) {
                    return {
                        Name: Name.toString().trim(),
                        EnrollmentNo: Enrollment.toString().trim()
                    };
                }
                return null;
            }).filter(Boolean);
        } else {
            // Step 3: Handle no-header case
            rawData.forEach((row) => {
                if (!row || row.length < 2) return;

                if (row.length === 2) {
                    // Format: [Name, EnrollmentNo]
                    const [Name, Enrollment] = row;
                    if (Name && Enrollment) {
                        formattedStudents.push({
                            Name: Name.toString().trim(),
                            EnrollmentNo: Enrollment.toString().trim()
                        });
                    }
                } else if (row.length >= 3) {
                    // Format: [Sl No, EnrollmentNo, Name]
                    const [_, Enrollment, Name] = row;
                    if (Name && Enrollment) {
                        formattedStudents.push({
                            Name: Name.toString().trim(),
                            EnrollmentNo: Enrollment.toString().trim()
                        });
                    }
                }
            });
        }
        
        setStudents(formattedStudents);
        setNumberOfStudents(formattedStudents.length);
    };

    reader.readAsBinaryString(file);
};




    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = await checkDuplicatesBeforeSubmit();
        if(!isValid) {
           alert("Student Data exist in the Current List. Enter New Student Details, Fix duplicates highlighted in red.");
            return;
        }

        const payload = {
            students
        };

        try {
            const response = await axios.post(
                `${conf.API_URL}/student/add/students/${classId}`,
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
        className={`border p-2 flex-1 ${duplicateFields.includes(index) ? "text-red-500 font-bold" : ""}`}
        required
        />
        <input
        type="text"
        placeholder={`Student ${index + 1} Enrollment No.`}
        value={student.EnrollmentNo}
        onChange={(e) => handleStudentChange(index, "EnrollmentNo", e.target.value)}
        className={`border p-2 flex-1 ${duplicateFields.includes(index) ? "text-red-500 font-bold" : ""}`}
        required
        />
     

        <div className="flex gap-2">
            {(student.Name || student.EnrollmentNo) && (
                <button
                    type="button"
                    onClick={() => handleRemoveField(index)}
                    className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                >
                    Remove Row
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
