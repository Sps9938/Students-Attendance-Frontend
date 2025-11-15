import React, {useState, useEffect } from 'react';
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
    <div className="flex items-center justify-center h-screen bg-blue-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-20 rounded-xl shadow-lg max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Welcome</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">What would you like to do?</p>

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
