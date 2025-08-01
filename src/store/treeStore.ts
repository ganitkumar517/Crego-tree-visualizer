import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { TreeNode, NodeType } from '../types';

interface TreeStore {
  nodes: Record<string, TreeNode>;
  selectedNodeId: string | null;
  
  // Actions
  addNode: (type: NodeType, parentId?: string) => string;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateNodeDescription: (nodeId: string, description: string) => void;
  clearTree: () => void;
  
  // Getters
  getRootNodes: () => TreeNode[];
  getNodeChildren: (nodeId: string) => TreeNode[];
  exportTree: () => string;
  importTree: (jsonData: string) => boolean;
}

export const useTreeStore = create<TreeStore>((set, get) => ({
  nodes: {},
  selectedNodeId: null,

  addNode: (type: NodeType, parentId?: string) => {
    const id = nanoid();
    const newNode: TreeNode = {
      id,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${id.slice(-4)}`,
      parentId,
      children: [],
      data: {
        createdAt: new Date().toISOString(),
        description: ''
      }
    };

    set((state) => {
      const updatedNodes = { ...state.nodes, [id]: newNode };
      
      // Update parent's children array if this is not a root node
      if (parentId && updatedNodes[parentId]) {
        updatedNodes[parentId] = {
          ...updatedNodes[parentId],
          children: [...updatedNodes[parentId].children, id]
        };
      }
      
      return { nodes: updatedNodes };
    });

    return id;
  },

  deleteNode: (nodeId: string) => {
    const { nodes } = get();
    const nodeToDelete = nodes[nodeId];
    if (!nodeToDelete) return;

    // Recursively collect all descendant IDs
    const collectDescendants = (id: string): string[] => {
      const node = nodes[id];
      if (!node) return [];
      
      const descendants = [id];
      for (const childId of node.children) {
        descendants.push(...collectDescendants(childId));
      }
      return descendants;
    };

    const idsToDelete = collectDescendants(nodeId);

    set((state) => {
      const updatedNodes = { ...state.nodes };
      
      // Remove all descendants
      idsToDelete.forEach(id => {
        delete updatedNodes[id];
      });

      // Update parent's children array if this node has a parent
      if (nodeToDelete.parentId && updatedNodes[nodeToDelete.parentId]) {
        updatedNodes[nodeToDelete.parentId] = {
          ...updatedNodes[nodeToDelete.parentId],
          children: updatedNodes[nodeToDelete.parentId].children.filter(id => id !== nodeId)
        };
      }

      return {
        nodes: updatedNodes,
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId
      };
    });
  },

  selectNode: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId });
  },

  updateNodeLabel: (nodeId: string, label: string) => {
    set((state) => ({
      nodes: {
        ...state.nodes,
        [nodeId]: {
          ...state.nodes[nodeId],
          label
        }
      }
    }));
  },

  updateNodeDescription: (nodeId: string, description: string) => {
    set((state) => ({
      nodes: {
        ...state.nodes,
        [nodeId]: {
          ...state.nodes[nodeId],
          data: {
            ...state.nodes[nodeId].data,
            description
          }
        }
      }
    }));
  },

  clearTree: () => {
    set({ nodes: {}, selectedNodeId: null });
  },

  getRootNodes: () => {
    const { nodes } = get();
    return Object.values(nodes).filter(node => !node.parentId);
  },

  getNodeChildren: (nodeId: string) => {
    const { nodes } = get();
    const node = nodes[nodeId];
    if (!node) return [];
    return node.children.map(childId => nodes[childId]).filter(Boolean);
  },

  exportTree: () => {
    const { nodes } = get();
    return JSON.stringify(nodes, null, 2);
  },

  importTree: (jsonData: string) => {
    try {
      const parsedNodes = JSON.parse(jsonData);
      // Basic validation
      if (typeof parsedNodes === 'object' && parsedNodes !== null) {
        // Validate that all nodes have required properties including children array
        const isValidNodeStructure = Object.values(parsedNodes).every((node: any) => {
          return node && 
                 typeof node === 'object' && 
                 typeof node.id === 'string' &&
                 typeof node.type === 'string' &&
                 typeof node.label === 'string' &&
                 Array.isArray(node.children) &&
                 (node.parentId === undefined || typeof node.parentId === 'string') &&
                 node.data && typeof node.data === 'object';
        });
        
        if (isValidNodeStructure) {
          set({ nodes: parsedNodes, selectedNodeId: null });
          return true;
        }
        return false;
      }
      return false;
    } catch {
      return false;
    }
  }
}));