import React from "react";
import TopNavigation from "./TopNavigation"; 
import Sidebar from "./Sidebar"; 

function Account() {
  return (
    <div className="flex font-inria italic  flex-col h-screen">
      <TopNavigation />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8 ml-64">
         
          <div id="content" className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Account Page</h1>
            <p className="text-lg text-gray-600 mb-6">Changing your chords</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;