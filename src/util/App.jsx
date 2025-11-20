import React, { useState } from 'react';
import ProcessTab from './components/ProcessTab';
import GroupsTab from './components/GroupsTab';
import LevelsTab from './components/LevelsTab';

function App() {
  const [activeTab, setActiveTab] = useState('process');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-vazir">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-xl font-bold">Level Designer</h1>
      </header>
      
      <nav className="bg-gray-800 border-b border-gray-700 flex">
        <button 
          onClick={() => setActiveTab('process')}
          className={`px-6 py-3 font-medium ${activeTab === 'process' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Process
        </button>
        <button 
          onClick={() => setActiveTab('groups')}
          className={`px-6 py-3 font-medium ${activeTab === 'groups' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Groups
        </button>
        <button 
          onClick={() => setActiveTab('levels')}
          className={`px-6 py-3 font-medium ${activeTab === 'levels' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Levels
        </button>
      </nav>

      <main className="container mx-auto max-w-6xl">
        {activeTab === 'process' && <ProcessTab />}
        {activeTab === 'groups' && <GroupsTab />}
        {activeTab === 'levels' && <LevelsTab />}
      </main>
    </div>
  );
}

export default App;

