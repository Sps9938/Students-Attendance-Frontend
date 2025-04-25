import axios from "axios";
import React, {useEffect, useState} from "react";
import conf from "../../Conf/Conf";
import { useNavigate } from "react-router-dom";

const FetchAllClass = () => {
const navigate = useNavigate();
const [classes, setClasses] = useState([]);
const [loading, setLoading] = useState(true);
const [EditData, setEditData] = useState(null);
const [EditingId, setEditingId] = useState(null)


    const getClasses = async () => {
        try {
           
            const res = await axios.get(`${conf.API_URL}/class/get/AllClass`,{
                withCredentials: true,
            });
            console.log(res);
            
            if(res?.data?.data){
                setClasses(res.data.data);
                console.log("Fetched classes sucessfully",  res.data.data);
            
                
            } 
            else{
              navigate("/createclass")
              setClasses([]);
            }
            console.log("classes is: ", classes);
            
           
        } catch (error) {
            console.error("Failed to fetch classes", error);   
        } finally {
            setLoading(false);
        }
    };

useEffect(() => {

  getClasses();
},[])


const handleEdit = async(cls) => {
setEditingId(cls._id);
setEditData( {
  className: cls.className,
  courseName: cls.courseName,
  yearBatch: cls.yearBatch,
});
};

const handleUpdate = async(id) => {
  try {
    
    const res = await axios.post(`${conf.API_URL}/class/update/class/${id}`, EditData,{
      withCredentials: true,
    });

    const updateClass = res.data.data;
    console.log("Class Updated successfully", updateClass);
    setEditingId(null)
    getClasses();
    alert("Class Updated Sucessfully");
   
    
  } catch (error) {
    console.error("Failed to update class", error);
    
  }
}

const handleDelete = async(id) => {
  try {
    
   const confirmDelte = window.confirm("Are you Sure to Delete this Class");
   if(!confirmDelte) return;

    await axios.delete(`${conf.API_URL}/class/delete/class/${id}`, {
      withCredentials: true,
    });

    getClasses();




  } catch (error) {
    console.error("Failed to delete class", error);
    
  }
}


return (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-6 text-center">Your Classes</h2>
  {loading ? (
    <p className="text-center text-gray-300">Loading classes...</p>
  ) : classes.length === 0 ? (
   navigate("/createclass")
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {classes.map((cls) => (
      <div
        key={cls._id}
        className="border border-gray-700 rounded-xl p-4 shadow hover:shadow-md transition duration-300"
      >
        {EditingId === cls._id ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={EditData.className}
              onChange={(e) =>
                setEditData({ ...EditData, className: e.target.value })
              }
              className="border px-2 py-1 rounded"
              placeholder="Class Name"
            />
            <input
              type="text"
              value={EditData.courseName}
              onChange={(e) =>
                setEditData({ ...EditData, courseName: e.target.value })
              }
              className="border px-2 py-1 rounded"
              placeholder="Course Name"
            />
            <input
              type="text"
              value={EditData.yearBatch}
              onChange={(e) =>
                setEditData({ ...EditData, yearBatch: e.target.value })
              }
              className="border px-2 py-1 rounded"
              placeholder="Year Batch"
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={() => handleUpdate(cls._id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="bg-gray-400 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-2">
              {cls.className} - {cls.courseName}
            </h3>
            <p className="text-sm text-black">
              <strong>Batch:</strong> {cls.yearBatch}
            </p>
            <p className="text-sm text-black">
              <strong>Class Token:</strong> {cls.classToken}
            </p>
            <p className="text-sm text-black">
              <strong>Copy Class Link:</strong> {cls.link}
            </p>
            <a
              href={cls.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-3 text-blue-900 hover:underline truncate"
            >
              🔗 Click Class Link
            </a>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(cls)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cls._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    ))}
  </div>
    )}
    
  </div>
);
}


export default FetchAllClass;