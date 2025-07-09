import { useParams } from "react-router-dom";
 import { AddStudentsForm } from "../Components";

const AddStudentsPage = () => {
  const { classId } = useParams();
// console.log("class id is: ", classId);

  return <AddStudentsForm classId={classId} />;
};

export default AddStudentsPage;
