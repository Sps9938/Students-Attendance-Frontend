import axios from "axios";
import React, { useEffect, useState } from "react";
import conf from "../../Conf/Conf";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiCopy, FiPlus, FiArrowLeft, FiUsers, FiFileText } from "react-icons/fi"; // icons
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // loading spinner
import  html2pdf  from "html2pdf.js";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

const FetchAllClass = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const getClasses = async () => {
    try {
      const res = await axios.get(`${conf.API_URL}/class/get/AllClass`, {
        withCredentials: true,
      });
      if (res?.data?.data) {
        setClasses(res.data.data);
      } else {
        navigate("/createclass");
        setClasses([]);
      }
    } catch (error) {
      console.error("Failed to fetch classes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  const handleEdit = (cls) => {
    setEditingId(cls._id);
    setEditData({
      className: cls.className,
      courseName: cls.courseName,
      Section: cls.Section,
      yearBatch: cls.yearBatch,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.post(`${conf.API_URL}/class/update/class/${id}`, editData, {
        withCredentials: true,
      });
      setEditingId(null);
      getClasses();
      alert("Class Updated Successfully");
    } catch (error) {
      console.error("Failed to update class", error);
    }
  };

  
  const handleCopy = (cls) => {
    navigator.clipboard
      .writeText(`https://smartattendance-dashboard.vercel.app/student/form/${cls._id}`)
      .then(() => {
        setCopiedId(cls._id);
        setTimeout(() => setCopiedId(null), 2000); // Hide after 2 sec
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-400">
      <h2 className="text-3xl font-bold mb-8 text-center">🎓 Your Classes</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">No classes found!</p>
          <button
            onClick={() => navigate("/createclass")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow"
          >
            ➕ Create Class
          </button>
        </div>
      ) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {classes.map((cls) => (
      <div
        key={cls._id}
        className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between"
      >
        {editingId === cls._id ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={editData.className}
              onChange={(e) =>
                setEditData({ ...editData, className: e.target.value })
              }
              className="border px-3 py-2 rounded"
              placeholder="Class Name"
            />
          <input
            type="text"
            value={editData.courseName}
            onChange={(e) =>
              setEditData({ ...editData, courseName: e.target.value })
            }
            className="border px-3 py-2 rounded"
            placeholder="Course Name"
          />
          <input
            type="text"
            value={editData.Section}
            onChange={(e) =>
              setEditData({ ...editData, Section: e.target.value })
            }
            className="border px-3 py-2 rounded"
            placeholder="Course Name"
          />
          <input
            type="text"
            value={editData.yearBatch}
            onChange={(e) =>
              setEditData({ ...editData, yearBatch: e.target.value })
            }
            className="border px-3 py-2 rounded"
            placeholder="Year Batch"
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handleUpdate(cls._id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
            >
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
        ) : (
        <>
          <div>
            <h3 className="text-2xl font-semibold mb-1">
              {cls.className} - {cls.courseName}
            </h3>
            <h3 className="text-1xl font-semibold mb-1">
              Section - {cls.Section}
            </h3>
            <p className="text-gray-600 mb-4">
              🎓 <strong>Batch:</strong> {cls.yearBatch}
            </p>

            {/* <a
              href={`http://localhost:5173/student/form/${cls._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm break-all"
            >
              🔗 Click to Open Student Form Link
            </a> */}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
          <button
          onClick={() => handleEdit(cls)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold text-sm rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-800 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <FiEdit className="w-4 h-4" />
          Edit
        </button>

            <button
              onClick={() => handleCopy(cls)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-full flex items-center gap-1"
            >
              <FiCopy />
              {copiedId === cls._id ? "Copied!" : "Copy Link(Student Page)"}
            </button>
                <button
        onClick={() => navigate(`/student/form/${cls._id}`)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold text-sm rounded-lg shadow-md hover:from-purple-600 hover:to-purple-800 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <FiPlus className="w-4 h-4" />
        Add Students
      </button>

      <button
        onClick={() => navigate(`/student/get/student/details/${cls._id}`)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <FiUsers className="w-4 h-4" />
        Get Students
    </button>
 
          <button
          onClick={() => navigate(`/class/report/${cls._id}`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-900 transition duration-200"
          >
          <FiFileText className="w-4 h-4" />
          Class Report
          </button>
           
          <FiArrowLeft 
          onClick={()=> navigate("/")}
          className="w-6 h-6 cursor-pointer">;
         
     </FiArrowLeft>
     
            </div>
          </>
        )}
      </div>
    ))}
  </div>
      )}
    </div>
  );
};

export default FetchAllClass;
