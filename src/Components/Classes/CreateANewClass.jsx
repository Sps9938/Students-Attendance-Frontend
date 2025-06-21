import React,{useState} from "react";
import axios from 'axios';
// import { addClass } from "../../Store/classSlice";
import { useDispatch } from "react-redux";
import conf from "../../Conf/Conf";
import { Input, Button } from "../index";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function CreateClass(){

const dispatch = useDispatch();
// const [ classLink, setClassLink ] = useState("");
const [createdClass, setCreatedClass] = useState(null);
const { register, handleSubmit, reset } = useForm();
const navigate = useNavigate();

const createNewClass = async(data) => {
    

    try {
        
       const res = await axios.post(`${conf.API_URL}/class/create-class`, data, {
        withCredentials: true,
       });

       if(res){
        const createClass = res?.data?.data;
        // dispatch(addClass(createdClass));
       setCreatedClass(createClass)
        reset();
        alert("class created sucessfully");
        // navigate("/getclasses");
       }
    } catch (error) {
        console.error("class creation failed", err);
        alert("class to create class, please try again.");

    }
}
    

return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create a New Class</h2>

      <form onSubmit={handleSubmit(createNewClass)} className="space-y-4">
        <Input
          label="Class Name"
          placeholder="Enter class name"
          {...register("className", { required: true})}
        />
        <Input
          label="Course Name"
          placeholder="Enter course name"
          {...register("courseName", { required: true})}
        />
        <Input
          label="Batch Year"
          placeholder="YYYY-YYYY"
          {...register("yearBatch", {
            required: true,
            pattern: {
              value: /^\d{4}-\d{4}$/,
              message: "Format should be YYYY-YYYY",
            },
          })}
        />
        <Button type="submit" className="w-full">
          Create Class
        </Button>
      </form>
      

      {createdClass && (
        <div className="mt-4 p-2 bg-green-100 rounded border border-green-400">
<<<<<<< HEAD
          <p>Students Add Page: Link:</p>
=======
          <p>Add Student Page: Link:</p>
>>>>>>> 52e5ebba3961c7b2e38086eabc39a54a92389153
          <a
            href={`http://localhost:5173/student/form/${createdClass.classToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {`http://localhost:5173/student/form/${createdClass.classToken}`}
          </a>

          <Button
        type="button"
        className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
        onClick={() => navigate("/getclasses")}
      >
        View All Classes
      </Button>
        </div>
      )}

    </div>
  );

}
export default CreateClass;