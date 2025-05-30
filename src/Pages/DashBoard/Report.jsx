import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import conf from "../../Conf/Conf";
import axios from "axios";
import { ClassReport } from "../../Components";
import { set } from "react-hook-form";
import  html2pdf  from "html2pdf.js";

function Report(){
// console.log("welcome to report page");
const navigate = useNavigate();
const {classId} = useParams();
const [students, setStudents] = useState();
const [attendanceRecords, setAttendanceRecords] = useState();
const [cls, setCls] = useState();
const contentRef = useRef();

// console.log("class id is: ", classId);

const transformAttendanceData = (students)=> {
    const dateMap = {};
    students.forEach((student) => {
        student.attendance.forEach(({date, status}) => {
            const formattedDate = new Date(date).toLocaleDateString();
            if(!dateMap[formattedDate]){
                dateMap[formattedDate] = [];
            }
            dateMap[formattedDate].push({
                Name: student.Name,
                EnrollmentNo: student.EnrollmentNo,
                status,
            })
        })
    })

    return Object.keys(dateMap)
        .sort()
        .map((date) => ({
            date,
            records: dateMap[date],
        }))

}
useEffect(() => {
    const fetchStudent = async() => {
        try {
            
            const response = await axios.get(`${conf.API_URL}/student/get/student/details/${classId}`,{
                withCredentials: true,
            });
            // console.log("resonse: ", response);
            
            if(response?.data.data){
                setStudents(response.data.data.students);
                // console.log("students are: ",response.data.data.students );
                
                const transformed = transformAttendanceData(response.data.data.students);
                if(transformed)
                    setAttendanceRecords(transformed);
                // console.log("transformed: ", transformed);
                
            }

            const res = await axios.get(`${conf.API_URL}/class/get/single/class/${classId}`,{
                withCredentials: true,
            });
            if(res?.data){
                setCls(res.data.data);
            }
        } catch (error) {
            console.error("Failed to Fetched student details",error);
            alert("Failed to Fetched student details")
        }
    }
    fetchStudent();
},[classId])

// console.log("students length is: ",students.length);;
// console.log("classs is: ", cls);
// console.log("attendancRecord : ", attendanceRecords);
 const handleDeleteWithBackup = async () => {
    // console.log("Welcome to handle delted page");
    
    const element = contentRef.current;
     if (!element) {
        console.error("❌ contentRef is null");
        return;
    }

    const hiddenElements = element.querySelectorAll(".no-pdf");

    hiddenElements.forEach(el => el.style.display = "none");

    const opt = {
      margin: 0.5,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    html2pdf().set(opt).from(element).outputPdf("blob").then(async (pdfBlob) => {
      hiddenElements.forEach(el => el.style.display = "");

    console.log("✅ PDF blob created", pdfBlob);

    const pdfFile = new File(
      [pdfBlob],
      `${cls?.className?.replace(/\s+/g, "_")}_report.pdf`,
      { type: "application/pdf" }
    );
      const formData = new FormData();
      formData.append("file",pdfFile);

      formData.append("upload_preset", "class_reports");  formData.append("folder", "deleted-classes");

      formData.append("folder", "deleted-classes");

      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dev80yysh/raw/upload", {
        method: "POST",
        body: formData
      });

      const data = await cloudRes.json();

    console.log("🌐 Cloudinary response:", data);

    if (!data.secure_url) {
      alert("❌ Cloudinary upload failed.");
      return;
    }
     const pdfUrl = data.secure_url;

      await axios.post(`${conf.API_URL}/class/delete-with-archive/${cls._id}`, {
        pdfUrl
      }, { withCredentials: true });

     
    alert("✅ Class deleted and PDF archived.");
    window.location.reload();
    }).catch(err => {
    console.error("❌ PDF generation or upload failed", err);
  });

  };
  return (
   <div> 
      <h2 className="text-xl font-bold mb-4">Class Report Overview</h2>     
      <button
        onClick={handleDeleteWithBackup}
        className="mb-6 inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg shadow hover:bg-red-700 transition"
      >
        Delete Class With Backup
      </button>

    <div ref={contentRef}>
        {students && cls && attendanceRecords && (
    <ClassReport students={students} cls={cls} attendanceRecords={attendanceRecords}/>
)}
    </div>
    </div>
  )

}

export default Report;