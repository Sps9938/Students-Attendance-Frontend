import React from "react";
import { useNavigate } from "react-router-dom";

function GetEachStudent({student}){

const navigate = useNavigate();
    
  if (!student) return <p className="text-center text-gray-500">Loading student details...</p>;

  const { Name, EnrollmentNo, attendance, percentage } = student;

  return (


   <div className="max-w-3xl mx-auto mt-10 p-8 bg-gradient-to-r from-white to-blue-50 shadow-2xl rounded-3xl border border-gray-200">

     <button
    onClick={() => navigate(-1)}
    className="mb-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition"
  >
    ← Back to Student List
  </button>
  <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">🎓 Student Profile</h2>

  <div className="mb-8 grid grid-cols-[160px_auto] gap-y-4 text-lg">
    <span className="font-semibold text-gray-800">Name:</span>
    <span className="text-gray-700">{Name}</span>

    <span className="font-semibold text-gray-800">Enrollment No:</span>
    <span className="text-gray-700">{EnrollmentNo}</span>

    <span className="font-semibold text-gray-800">Percentage:</span>
    <span className={`font-bold ${percentage >= 75 ? 'text-blue-400' : 'text-red-500'}`}>
      {percentage}%
    </span>
  </div>

  <h3 className="text-2xl font-semibold text-gray-800 mb-4">📅 Attendance Records</h3>
  <div className="overflow-hidden rounded-xl border border-gray-300 shadow-sm">
    <table className="w-full text-left table-auto">
      <thead className="bg-blue-100 text-blue-900 uppercase text-sm">
        <tr>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {attendance.map((record) => (
          <tr key={record._id} className="even:bg-white odd:bg-gray-50 hover:bg-blue-50 transition">
            <td className="px-4 py-3 text-gray-700">{new Date(record.date).toLocaleDateString()}</td>
            <td className={`px-4 py-3 font-semibold ${record.status === 'Present' ? 'text-blue-600' : 'text-red-600'}`}>
              {record.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};
export default GetEachStudent;