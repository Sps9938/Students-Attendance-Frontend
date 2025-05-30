import axios from "axios";
import React, { useEffect, useState } from "react";
import conf from "../../Conf/Conf";

function GetDeletdClasses(){
    const [deletedClasses, setDeletedClasses] = useState();


    useEffect(()=> {
        const fetchDeleted = async () => {
          try {
              const response = await axios.get(`${conf.API_URL}/class/get/all-deleted-classes`,{
                  withCredentials: true,
              })
            //   console.log("response", response);
              
              if(response?.data?.data){
                  setDeletedClasses(response.data.data);
              }
          } catch (error) {
            console.error("Failed to Fetch deletd classes:", error);
            
          }
        }
        fetchDeleted();
    },[])
// console.log("delete classes", deletedClasses);

return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Archived (Deleted) Classes</h2>

      {deletedClasses?.length === 0 ? (
        <p className="text-gray-600">No deleted class records available.</p>
      ) : (
        <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
            <tr>
            <th className="border px-4 py-2 text-left">Class Name</th>
            <th className="border px-4 py-2 text-left">Course</th>
            <th className="border px-4 py-2 text-left">Teacher</th>
            <th className="border px-4 py-2 text-left">Batch Year</th>
            <th className="border px-4 py-2 text-left">Deleted At</th>
            <th className="border px-4 py-2 text-left">Report (PDF)</th>
            </tr>
        </thead>
        <tbody>
            {deletedClasses?.map((cls, index) => (
            <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{cls.className}</td>
                <td className="border px-4 py-2">{cls.courseName}</td>
                <td className="border px-4 py-2">{cls.teacherName}</td>
                <td className="border px-4 py-2">{cls.yearBatch}</td>
                <td className="border px-4 py-2">
                {new Date(cls.deletedAt).toLocaleDateString("en-GB")}
                </td>
                <td className="border px-4 py-2">
                <a
                    href={cls.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    View PDF
                </a>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
      )}
    </div>
  );
}
export default GetDeletdClasses;