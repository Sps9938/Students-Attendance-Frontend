import axios from "axios";
import React, {useEffect, useState} from "react";
import conf from "../../Conf/Conf";
import { useNavigate } from "react-router-dom";

const FetchAllClass = () => {
const navigate = useNavigate();
const [classes, setClasses] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
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
        } catch (error) {
            console.error("Failed to fetch classes", error);   
        } finally {
            setLoading(false);
        }
    };
    getClasses();
},[])

return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Classes</h2>
  
      {loading ? (
        <p className="text-center text-gray-300">Loading classes...</p>
      ) : classes.length === 0 ? (
        <p className="text-center text-gray-500">No classes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="border border-gray-700 rounded-xl p-4 shadow hover:shadow-md transition duration-300"
            >
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
                <strong>Copy Class Link: </strong> {cls.link}
              </p>
              <a
                href={cls.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 text-blue-900 hover:underline truncate"
              >
                🔗 Click Class Link 
              </a>
           
            </div>
          ))}
        </div>
      )}
    </div>
  );

}


export default FetchAllClass;