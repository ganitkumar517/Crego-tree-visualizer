import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Background,
  Controls,
  MiniMap
} from '@xyflow/react';
import dagre from 'dagre';
import { CustomNode } from './CustomNode';
import { useTreeStore } from '../store/treeStore';

const nodeTypes = {
  custom: CustomNode,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 80 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 120 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 100,
        y: nodeWithPosition.y - 60,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export const TreeFlow: React.FC = () => {
  const { nodes: storeNodes, selectNode } = useTreeStore();

  const { nodes: reactFlowNodes, edges: reactFlowEdges } = useMemo(() => {
    const nodes: Node[] = Object.values(storeNodes).map((node) => ({
      id: node.id,
      type: 'custom',
      position: { x: 0, y: 0 },
      data: node,
      draggable: false,
    }));

    const edges: Edge[] = [];
    Object.values(storeNodes).forEach((node) => {
      node.children.forEach((childId) => {
        edges.push({
          id: `${node.id}-${childId}`,
          source: node.id,
          target: childId,
          type: 'smoothstep',
          style: { stroke: '#6b7280', strokeWidth: 2 },
          animated: false,
        });
      });
    });

    return getLayoutedElements(nodes, edges);
  }, [storeNodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  // Update nodes and edges when store changes
  React.useEffect(() => {
    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
  }, [reactFlowNodes, reactFlowEdges, setNodes, setEdges]);

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="flex-1 bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Strict}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background color="#e5e7eb" size={1} />
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          nodeColor={(node) => {
            const nodeData = node.data as any;
            switch (nodeData.type) {
              case 'account': return '#3b82f6';
              case 'loan': return '#10b981';
              case 'collateral': return '#f59e0b';
              default: return '#6b7280';
            }
          }}
          maskColor="rgba(255, 255, 255, 0.8)"
          className="!bg-white !border !border-gray-200 !rounded-lg"
        />
      </ReactFlow>
    </div>
  );
};