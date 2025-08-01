import React, { useState } from 'react';
import { X, Plus, Trash2, Building2, CreditCard, Shield, Download, Upload, FileText } from 'lucide-react';
import { useTreeStore } from '../store/treeStore';
import { NODE_RELATIONSHIPS, NodeType } from '../types';

const nodeIcons = {
  account: Building2,
  loan: CreditCard,
  collateral: Shield
};

const nodeColors = {
  account: 'text-blue-600',
  loan: 'text-green-600',
  collateral: 'text-orange-600'
};

export const SidePanel: React.FC = () => {
  const {
    selectedNodeId,
    nodes,
    selectNode,
    addNode,
    deleteNode,
    updateNodeLabel,
    updateNodeDescription,
    exportTree,
    importTree,
    clearTree
  } = useTreeStore();

  const [isExporting, setIsExporting] = useState(false);
  const [importData, setImportData] = useState('');
  const [showImport, setShowImport] = useState(false);

  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;
  const allowedChildren = selectedNode ? NODE_RELATIONSHIPS[selectedNode.type] : [];

  const handleExport = () => {
    setIsExporting(true);
    const jsonData = exportTree();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tree-structure-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => setIsExporting(false), 1000);
  };

  const handleImport = () => {
    if (importTree(importData)) {
      setImportData('');
      setShowImport(false);
      selectNode(null);
    } else {
      alert('Invalid JSON format. Please check your data.');
    }
  };

  const handleAddChild = (type: NodeType) => {
    if (selectedNode) {
      const newNodeId = addNode(type, selectedNode.id);
      selectNode(newNodeId);
    }
  };

  const handleDeleteNode = () => {
    if (selectedNode && confirm(`Are you sure you want to delete "${selectedNode.label}" and all its children?`)) {
      deleteNode(selectedNode.id);
      selectNode(null);
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Tree Manager</h2>
          {selectedNode && (
            <button
              onClick={() => selectNode(null)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedNode ? (
          /* Node Details */
          <div className="p-4 space-y-6">
            {/* Node Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {React.createElement(nodeIcons[selectedNode.type], {
                  size: 24,
                  className: nodeColors[selectedNode.type]
                })}
                <div>
                  <h3 className="font-medium text-gray-900">{selectedNode.type.toUpperCase()}</h3>
                  <p className="text-sm text-gray-500">ID: {selectedNode.id}</p>
                </div>
              </div>

              {/* Editable Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={selectedNode.label}
                  onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter node label"
                />
              </div>

              {/* Editable Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={selectedNode.data.description || ''}
                  onChange={(e) => updateNodeDescription(selectedNode.id, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Enter description (optional)"
                />
              </div>

              {/* Node Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Children:</span>
                  <span className="ml-2 font-medium">{selectedNode.children.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 font-medium">
                    {new Date(selectedNode.data.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Add Children */}
            {allowedChildren.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Add Child Node</h4>
                <div className="space-y-2">
                  {allowedChildren.map((childType) => {
                    const Icon = nodeIcons[childType];
                    return (
                      <button
                        key={childType}
                        onClick={() => handleAddChild(childType)}
                        className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      >
                        <Icon size={18} className={nodeColors[childType]} />
                        <span className="font-medium text-gray-700">
                          Add {childType.charAt(0).toUpperCase() + childType.slice(1)}
                        </span>
                        <Plus size={16} className="text-gray-400 ml-auto" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Delete Node */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleDeleteNode}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 size={18} />
                <span className="font-medium">Delete Node</span>
              </button>
            </div>
          </div>
        ) : (
          /* No Selection State */
          <div className="p-4 space-y-6">
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Node Selected</h3>
              <p className="text-gray-500">
                Click on a node in the tree to view its details and manage its children.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Tree Actions</h4>
              
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                <Download size={18} />
                <span className="font-medium">
                  {isExporting ? 'Exporting...' : 'Export Tree'}
                </span>
              </button>

              <button
                onClick={() => setShowImport(!showImport)}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Upload size={18} />
                <span className="font-medium">Import Tree</span>
              </button>

              {showImport && (
                <div className="space-y-2">
                  <textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm font-mono"
                    rows={4}
                    placeholder="Paste JSON data here..."
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleImport}
                      className="flex-1 p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Import
                    </button>
                    <button
                      onClick={() => {
                        setShowImport(false);
                        setImportData('');
                      }}
                      className="flex-1 p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear the entire tree?')) {
                    clearTree();
                  }
                }}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 size={18} />
                <span className="font-medium">Clear Tree</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};