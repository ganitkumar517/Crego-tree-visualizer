# 💼 Loan Management Tree Visualizer

An interactive tree visualizer for managing hierarchical loan entities — built with React Flow, Zustand, and Tailwind CSS.

🔗 **Live Demo**: [https://crego-tree-visualizer.netlify.app](https://crego-tree-visualizer.netlify.app)  
💻 **GitHub Repo**: [https://github.com/ganitkumar517/Crego-tree-visualizer](https://github.com/ganitkumar517/Crego-tree-visualizer)

---

## 🌟 Features

- Auto-layout tree using React Flow + Dagre (no drag-drop)
- Node types: **Account**, **Loan**, **Collateral**
- Hierarchy rules enforced:
  - `Account` → Loan, Collateral
  - `Loan` → Collateral
  - `Collateral` → No children
- Side panel with node info, add/delete actions
- Zustand for state management
- JSON Export/Import functionality
- Fully responsive UI with Tailwind CSS

---

## 🏗️ Tree Data Model

```ts
interface TreeNode {
  id: string;
  type: 'Account' | 'Loan' | 'Collateral';
  label: string;
  parentId?: string;
  children: string[];
  data: {
    createdAt: string;
    description?: string;
  };
}


