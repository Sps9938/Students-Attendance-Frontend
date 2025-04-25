import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../index';
function Home() {
  const navigate = useNavigate();


  const handleCreateClass = () => {
    navigate('/createclass');
  };

  const handleGetClasses = () => {
    navigate('/getclasses');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue">
      <div className="bg-white p-20 rounded-xl shadow-lg max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome</h1>
        <p className="text-gray-600 mb-8">What would you like to do?</p>

        <div className="space-y-4">
          <Button onClick={handleCreateClass} className="w-full">
            Create New Class
          </Button>
          <Button onClick={handleGetClasses} className="w-full">
            Get Classes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
