import React from 'react';
import { Plus, GitBranch, Building2, CreditCard } from 'lucide-react';
import { useTreeStore } from '../store/treeStore';
import { ROOT_NODE_TYPES } from '../types';

export const TopBar: React.FC = () => {
  const { addNode, selectNode, nodes } = useTreeStore();
  const nodeCount = Object.keys(nodes).length;

  const handleAddRootNode = (type: 'account' | 'loan') => {
    const newNodeId = addNode(type);
    selectNode(newNodeId);
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <GitBranch size={24} className="text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Loan Tree Visualizer</h1>
        </div>
        <div className="h-6 w-px bg-gray-300"></div>
        <div className="text-sm text-gray-600">
          {nodeCount} node{nodeCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700">Add Root Node:</span>
        
        <button
          onClick={() => handleAddRootNode('account')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
        >
          <Building2 size={16} />
          <span className="font-medium">Account</span>
          <Plus size={14} />
        </button>

        <button
          onClick={() => handleAddRootNode('loan')}
          className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
        >
          <CreditCard size={16} />
          <span className="font-medium">Loan</span>
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};