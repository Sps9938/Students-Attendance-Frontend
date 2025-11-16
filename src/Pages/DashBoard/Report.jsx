// @ts-ignore
import html2pdf from "html2pdf.js";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import conf from "../../Conf/Conf";
import axios from "axios";
import { ClassReport } from "../../Components";
function Report(){
// console.log("welcome to report page");
const navigate = useNavigate();
const {classId} = useParams();
const [students, setStudents] = useState();
const [attendanceRecords, setAttendanceRecords] = useState();
const [cls, setCls] = useState();
const contentRef = useRef();
const [std, setStd] = useState();
// console.log("class id is: ", classId);

const transformAttendanceData = (students)=> {
    const dateMap = {};
    students.forEach((student) => {
        student.attendance.forEach(({date, status}) => {
              const formattedDate = new Date(date).toISOString().split("T")[0]; 
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

const handleDownloadAndSendPDF = () => {
  const confirmDelete = window.confirm("Are you sure to delete this class?");
  if (!confirmDelete) return;

  const element = contentRef.current;
  if (!element) {
    console.error("❌ contentRef is null");
    return;
  }

  const hiddenElements = element.querySelectorAll(".no-pdf");
  hiddenElements.forEach(el => el.style.display = "none");

  const breakElements = element.querySelectorAll(".pdf-page-break");
  breakElements.forEach((el) => {
    el.style.pageBreakBefore = "always";
    el.style.breakBefore = "page";
  });

  const fileName = `${cls.className?.replace(/\s+/g, "_") || "Student"}_Attendance_Summary.pdf`;

  const opt = {
    margin: 0.5,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "landscape" }
  };

  html2pdf()
    .set(opt)
    .from(element)
    .outputPdf("blob")
    .then(async (pdfBlob) => {
      hiddenElements.forEach(el => el.style.display = "");
      breakElements.forEach((el) => {
        el.style.pageBreakBefore = "";
        el.style.breakBefore = "";
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.download = fileName;
      link.click();

      const formData = new FormData();
      formData.append("pdf", new File([pdfBlob], fileName, { type: "application/pdf" }));
      formData.append("classId", cls._id);

      try {
        await Promise.all(
          students.map(async (student) => {
            try {
              await axios.delete(`${conf.API_URL}/student/delete/student/${student._id}`, {
                withCredentials: true,
              });
            } catch (err) {
              console.error("Failed to delete student:", student._id, err.response?.data || err.message);
            }
          })
        );

        const res = await axios.post(
          `${conf.API_URL}/class/delete-with-archive/${cls._id}`,
          formData,
          {
            withCredentials: true,
          }
        );

        alert("✅ PDF sent and class deleted.");
        navigate("/deleted/classes");

      } catch (err) {
        console.error("❌ Upload or delete failed", err);
        alert("❌ Something went wrong.");
      }
    })
    .catch((err) => {
      hiddenElements.forEach(el => el.style.display = "");
      breakElements.forEach((el) => {
        el.style.pageBreakBefore = "";
        el.style.breakBefore = "";
      });
      console.error("❌ PDF generation failed", err);
      alert("❌ PDF generation failed.");
    });
};

  return (
   <div> 
      <h2 className="text-xl font-bold mb-4 text-red-500">Class Report Overview</h2>  
<div className="flex justify-center gap-3">
      <button
        onClick={handleDownloadAndSendPDF}
        className="mb-6 inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg shadow hover:bg-red-700 transition"
      >
        Delete Class With Backup(DownLoad Report)
      </button>
    
</div>

    <div ref={contentRef}>
        {students && cls && attendanceRecords && (
    <ClassReport students={students} cls={cls} attendanceRecords={attendanceRecords}/>
)}
    </div>
    </div>
  )

}

export default Report;