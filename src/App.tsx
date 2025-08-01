import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { TopBar } from './components/TopBar';
import { TreeFlow } from './components/TreeFlow';
import { SidePanel } from './components/SidePanel';
import '@xyflow/react/dist/style.css';

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <ReactFlowProvider>
          <TreeFlow />
        </ReactFlowProvider>
        <SidePanel />
      </div>
    </div>
  );
}

export default App;