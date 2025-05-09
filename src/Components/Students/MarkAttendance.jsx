import React,{useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import conf from "../../Conf/Conf";

function MarkAttendance() {
    const navigate = useNavigate();
    const {classId} = useParams();
    const [students, setStudents] = useState([]);
    const[marked, setMarked] = useState({});
    useEffect(() => {
    const fetchStudents = async () => {
        try {
        const res = await axios.post(`${conf.API_URL}/student/get/student/details/${classId}`);
        setStudents(res.data.data.students);
        } catch (err) {
        console.error("Error fetching students", err);
        }
    };
    fetchStudents();
      }, [classId]);


    const handleMark = async(studentId, index, status) => {
       

        try {
            const hitMark = await axios.post(`${conf.API_URL}/student/mark/attendance/${studentId}`, {status},{
                withCredentials:true,
            })
        
            setMarked((prev) => ({
                ...prev,
                [index]: status === "Present" ? "✅" : "❌",
            }));

        } catch (error) {
            alert("Error marking attendance");
        }
    }

    const handleSubmit = () => {
        navigate(`/student/get/student/details/${classId}`)
    }
    return (
<div className="p-4">
  <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>
  <div className="grid grid-cols-5 gap-4">
    {students.map((student, idx) => (
      <div
        key={student._id}
        className={`relative w-16 h-16 flex items-center justify-center text-xl font-bold rounded-full cursor-pointer
          ${marked[idx] === "✅" ? "bg-green-200" : marked[idx] === "❌" ? "bg-red-200" : "bg-gray-100 hover:bg-gray-300"}
        `}
        onClick={() => handleMark(student._id, idx, "Present")}
        onDoubleClick={() => handleMark(student._id, idx, "Absent")}
      >
       
        <span>{marked[idx] ? marked[idx] : idx + 1}</span>

 
        <span className="absolute bottom-1 right-1 text-xs text-gray-500">
          {idx + 1}
        </span>
      </div>
    ))}
  </div>
  <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Submit & View Student Form
      </button>
</div>

)

}
    export default MarkAttendance;