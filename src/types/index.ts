export type NodeType = 'account' | 'loan' | 'collateral';

export interface TreeNode {
  id: string;
  type: NodeType;
  label: string;
  parentId?: string;
  children: string[];
  data: {
    createdAt: string;
    description?: string;
  };
}

export interface NodePosition {
  x: number;
  y: number;
}

export const NODE_RELATIONSHIPS: Record<NodeType, NodeType[]> = {
  account: ['loan', 'collateral'],
  loan: ['collateral'],
  collateral: []
};

export const ROOT_NODE_TYPES: NodeType[] = ['account', 'loan'];