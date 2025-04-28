import { useParams } from "react-router-dom";
 import { AddStudentsForm } from "../Components";

const AddStudentsPage = () => {
  const { classToken } = useParams();

  return <AddStudentsForm classToken={classToken} />;
};

export default AddStudentsPage;
