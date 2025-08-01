import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Building2, CreditCard, Shield, ChevronRight } from 'lucide-react';
import { TreeNode } from '../types';
import { useTreeStore } from '../store/treeStore';

const nodeConfig = {
  account: {
    icon: Building2,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-700'
  },
  loan: {
    icon: CreditCard,
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-700'
  },
  collateral: {
    icon: Shield,
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-700'
  }
};

interface CustomNodeProps extends NodeProps {
  data: TreeNode;
}

export const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  const { selectNode, selectedNodeId } = useTreeStore();
  const config = nodeConfig[data.type];
  const Icon = config.icon;
  const isSelected = selectedNodeId === data.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(data.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative min-w-48 cursor-pointer transition-all duration-200 ease-in-out
        ${isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102 shadow-md hover:shadow-lg'}
      `}
    >
      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />

      <div
        className={`
          rounded-lg border-2 ${config.borderColor} ${config.lightColor}
          ${isSelected ? 'ring-2 ring-blue-400 ring-opacity-75' : ''}
          p-4 transition-all duration-200
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${config.color} text-white`}>
              <Icon size={16} />
            </div>
            <span className={`font-semibold text-sm ${config.textColor}`}>
              {data.type.toUpperCase()}
            </span>
          </div>
          {isSelected && (
            <ChevronRight size={16} className="text-blue-500" />
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="font-medium text-gray-900 text-sm truncate">
            {data.label}
          </h3>
          <p className="text-xs text-gray-500">
            ID: {data.id.slice(-8)}
          </p>
          {data.children.length > 0 && (
            <p className="text-xs text-gray-600">
              {data.children.length} child{data.children.length !== 1 ? 'ren' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Bottom handle for children */}
      {data.children.length > 0 && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
        />
      )}
    </div>
  );
};