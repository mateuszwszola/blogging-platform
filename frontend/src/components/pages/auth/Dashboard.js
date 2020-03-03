import React from 'react';

function Dashboard() {
  return (
    <main className="mt-16 flex-auto flex-shrink-0">
      <div className="h-full">
        <div className="w-64 max-w-sm h-full bg-gray-800">
          <div className="px-2 py-4 text-white">
            <h2 className="text-center text-xl">Manage Blogs</h2>
            <div className="h-full mt-8 flex flex-col items-center">
              <button>#1 BlogName</button>
              <button>#2 BlogName</button>
              <button>#3 BlogName</button>
              <button>#4 BlogName</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
