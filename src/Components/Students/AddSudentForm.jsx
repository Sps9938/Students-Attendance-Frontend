import axios from "axios";
import React, {useState} from "react";
import conf from "../../Conf/Conf";
import { Navigate, useNavigate } from "react-router-dom";

function AddStudentsForm({ classToken }) {
    const navigate = useNavigate();
    const [numberOfStudents, setNumberOfStudents] = useState(1);
    const [students, setStudents] = useState([{
        Name: "",
        EnrollmentNo: ""
    }])

    const handleNumberChange = (e) => {
        const value = parseInt(e.target.value);
        setNumberOfStudents(value);


       const updatedStudents = Array.from({length:value}, () => ({
        Name: "",
        EnrollmentNo: "",
       }))
        setStudents(updatedStudents);
    }

    const handleStudentChange = (index, field, value) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = value;
        setStudents(updatedStudents);

        
    }
    const handleRemoveField = (index, field) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = ""; 
        setStudents(updatedStudents);
    };


    const handleSubmit = async(e) => {
        e.preventDefault();

        // console.log("Students: ", students);
        
        const payload = {
            classToken: classToken,
            students: students,
        }
        // console.log("Payload", payload);
        

        try {
            

            const response = await axios.post(`${conf.API_URL}/student/add/students`, payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }    
            )

            setStudents([]);
            console.log("success", response);
            navigate("/");
            alert("Students added successfully");
            

        } catch (error) {
            console.error("Eroor adding students", error);
            
        }
    }

const handleBack = () => {
    navigate("/getclasses")
}

    return (
    <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Add Students</h1>

        {/* Number Selector */}
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

            {/* Student Inputs */}
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
                
            {/* Remove Field Button */}
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

        {/* Submit Button */}
      <div className="flex justify-center gap-3"> 
      <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
            Submit
        </button>
        <button
            onClick={handleBack}
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
