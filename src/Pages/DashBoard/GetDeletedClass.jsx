import axios from "axios";
import React, { useEffect, useState } from "react";
import conf from "../../Conf/Conf";
import { useParams } from "react-router-dom";

function GetDeletdClasses(){

    const [deletedClasses, setDeletedClasses] = useState();
  // const {classId} = useParams();
// console.log("classId is: ", classId);

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


// const makeDownloadableCloudinaryURL = (url) => {
//   return url.replace("/upload", "upload/f1_attachment:ClassReport/");
// }

const handleReport = (url) => {
  try {
    window.open(url, "_blank");
  } catch (error) {
    console.error("❌ Failed to open PDF:", error);
    alert("Failed to open file.");
  }
};

const handleDelete = async(classId) => {
   const confirmed = window.confirm("Are you sure want to delete this class");
        if(!confirmed) {
            // navigate(-1);
            return;
     }


     try {

    const res = await axios.delete(`${conf.API_URL}/class/makedeleteAllDeletedClasses/${classId}`,{
      withCredentials: true,
    })

    // if(res?.data?.success){
    //   console.log("class deleted successfully");
      
    // }
    window.location.reload();
      
     } catch (error) {
        console.error("class not deleted", error);
     }

}


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
                <td className="border px-4 py-2">{cls.yearBatch}</td>
                <td className="border px-4 py-2">
                {new Date(cls.deletedAt).toLocaleDateString("en-GB")}
                </td>
                <td className="border px-4 py-2">

        <div className="flex justify-center gap-4">
               <button
              className="btn btn-sm btn-outline-primary underline text-blue-600"
              onClick={() => handleReport(cls.pdfUrl)}
            >
              Get Report
            </button>
              <button
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md transition duration-200"
              onClick={() => handleDelete(cls._id)}
            >
        🗑️
      </button>
        </div>

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