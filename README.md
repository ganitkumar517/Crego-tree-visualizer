# Loan Management Tree Visualizer

A comprehensive tree visualization system for managing hierarchical relationships among loan-related entities, built with React Flow and modern web technologies.

## 🌟 Features

- **Interactive Tree Visualization**: Drag-free, auto-layout tree structure using React Flow and Dagre
- **Three Node Types**: Account, Loan, and Collateral with enforced hierarchical relationships
- **Smart Side Panel**: Dynamic interface for viewing node details, adding children, and management
- **State Management**: Clean state handling with Zustand for optimal performance
- **Data Persistence**: JSON export/import functionality for saving and loading tree structures
- **Responsive Design**: Works seamlessly across desktop and tablet devices
- **Professional UI**: Modern, clean interface with Tailwind CSS and subtle animations

## 🏗️ Data Model

### Tree Structure
```typescript
interface TreeNode {
  id: string;              // Unique identifier (nanoid)
  type: NodeType;          // 'account' | 'loan' | 'collateral'
  label: string;           // Display name
  parentId?: string;       // Parent node ID (undefined for root)
  children: string[];      // Array of child node IDs
  data: {
    createdAt: string;     // ISO timestamp
    description?: string;  // Optional description
  };
}
```

### Node Relationships
- **Account**: Can have Loan and Collateral children
- **Loan**: Can have Collateral children only
- **Collateral**: Cannot have children (leaf nodes)
- **Root Constraints**: Only Account and Loan nodes can be root nodes

## 🎨 Node Types & Visual Design

### Account Nodes
- **Color**: Blue theme (#3B82F6)
- **Icon**: Building2 (representing financial institutions)
- **Purpose**: Customer accounts that can hold loans and collateral

### Loan Nodes
- **Color**: Green theme (#10B981)
- **Icon**: CreditCard (representing financial products)
- **Purpose**: Loans issued to accounts, secured by collateral

### Collateral Nodes
- **Color**: Orange theme (#F59E0B)
- **Icon**: Shield (representing security/protection)
- **Purpose**: Assets pledged against loans

## 🔧 Technical Architecture

### Core Technologies
- **React 18** with TypeScript for type safety
- **React Flow** for interactive diagrams with auto-layout
- **Dagre** for hierarchical graph layout algorithms
- **Zustand** for lightweight state management
- **Tailwind CSS** for consistent, responsive styling
- **Nanoid** for unique ID generation
- **Lucide React** for consistent iconography

### Component Structure
```
src/
├── components/
│   ├── CustomNode.tsx      # Individual node rendering
│   ├── TreeFlow.tsx        # Main React Flow container
│   ├── SidePanel.tsx       # Details and management panel
│   └── TopBar.tsx          # Header with root node actions
├── store/
│   └── treeStore.ts        # Zustand state management
├── types/
│   └── index.ts            # TypeScript definitions
└── App.tsx                 # Main application component
```

## 🎯 UX Design Decisions

### Side Panel Layout
- **Contextual Interface**: Shows different content based on selection state
- **Node Details**: Editable label, description, and metadata when node selected
- **Action Buttons**: Clearly grouped add/delete actions with visual hierarchy
- **Import/Export**: Accessible JSON operations for data persistence

### Add/Delete Flow
1. **Adding Nodes**: 
   - Root nodes via top bar buttons
   - Child nodes through side panel when parent selected
   - Immediate selection of newly created nodes
2. **Deleting Nodes**:
   - Confirmation dialog prevents accidental deletion
   - Cascade deletion removes all descendants
   - Automatic deselection when selected node deleted

### Visual Feedback
- **Selection States**: Scale animation and ring highlight for selected nodes
- **Hover Effects**: Subtle scaling and shadow changes for interactivity
- **Color Coding**: Consistent color themes for easy node type identification
- **Loading States**: Visual feedback for export operations

## ⚡ Auto-Layout System

- **Dagre Integration**: Automatic hierarchical positioning using industry-standard algorithms
- **Dynamic Updates**: Layout recalculates when nodes added/removed
- **Optimal Spacing**: Configured node separation (100px) and rank separation (80px)
- **Top-Down Flow**: Vertical tree layout with root nodes at top

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd loan-tree-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
npm run build
npm run preview  # Preview production build
```

## 💾 Data Persistence

### Export Functionality
- Downloads JSON file with complete tree structure
- Filename includes current date for organization
- Preserves all node data, relationships, and metadata

### Import Functionality
- Accepts JSON data via textarea input
- Validates data structure before import
- Replaces current tree (with user confirmation)
- Error handling for malformed data

## 🔒 Limitations & Trade-offs

### Current Limitations
1. **No Drag-and-Drop**: Enforces auto-layout but reduces direct manipulation
2. **Client-Side Only**: No backend persistence (by design)
3. **Single Tree**: No multi-tree or forest support
4. **No Undo/Redo**: Deletion operations are permanent
5. **Desktop-First**: Optimized for desktop use, limited mobile support

### Design Trade-offs
1. **Auto-Layout vs. Manual Control**: Chose consistency over flexibility
2. **State Management**: Zustand over Redux for simplicity and performance
3. **Component Architecture**: Monolithic nodes vs. composition for clarity
4. **Validation**: Runtime vs. compile-time for relationship rules

## 📱 Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile**: Limited support due to React Flow constraints
- **Responsive**: Optimized for screens 1024px+ width

## 🤝 Contributing

The codebase follows clean architecture principles:
- **Separation of Concerns**: Components, state, types in separate directories
- **Type Safety**: Full TypeScript coverage with strict configuration
- **Code Standards**: ESLint configuration for consistent style
- **Component Isolation**: Each component has single responsibility

## 📄 License

This project is created as part of a technical assessment and demonstrates production-ready React development practices.