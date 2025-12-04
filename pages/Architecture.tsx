import React, { useState } from 'react';
import { PROJECT_STRUCTURE } from '../services/mockData';
import { FileNode } from '../types';
import { Folder, File, ChevronRight, ChevronDown, Copy, FileCode } from 'lucide-react';

const FileTreeItem: React.FC<{ 
  node: FileNode; 
  depth?: number; 
  onSelect: (node: FileNode) => void;
  selectedPath: string;
  currentPath: string;
}> = ({ node, depth = 0, onSelect, selectedPath, currentPath }) => {
  const [isOpen, setIsOpen] = useState(true);
  const fullPath = `${currentPath}/${node.name}`;
  const isSelected = selectedPath === fullPath;

  return (
    <div>
      <div 
        className={`flex items-center py-1.5 px-2 cursor-pointer hover:bg-slate-800/50 rounded transition-colors ${isSelected ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400'}`}
        style={{ paddingLeft: `${depth * 1.5}rem` }}
        onClick={() => {
          if (node.type === 'folder') setIsOpen(!isOpen);
          else onSelect(node);
        }}
      >
        <span className="mr-1.5 opacity-70">
          {node.type === 'folder' ? (
            isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : <div className="w-3.5" />}
        </span>
        <span className="mr-2">
          {node.type === 'folder' ? <Folder size={16} className="text-blue-400" /> : <File size={16} className="text-slate-500" />}
        </span>
        <span className="text-sm truncate">{node.name}</span>
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map((child, idx) => (
            <FileTreeItem 
              key={idx} 
              node={child} 
              depth={depth + 1} 
              onSelect={(n) => onSelect({ ...n, name: child.name })} // passing simple node
              selectedPath={selectedPath}
              currentPath={fullPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Architecture: React.FC = () => {
  const [activeFile, setActiveFile] = useState<FileNode | null>(PROJECT_STRUCTURE[0].children![0].children![0].children![0]); // Select kratos.yml by default

  const handleSelect = (node: FileNode) => {
    if (node.type === 'file') {
      setActiveFile(node);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-800 bg-slate-900 z-10">
        <h1 className="text-2xl font-bold text-white mb-2">System Architecture & Configuration</h1>
        <p className="text-slate-400">Explore the recommended folder structure and configuration for the Ory Stack.</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">
          <div className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Project Explorer
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-4">
            {PROJECT_STRUCTURE.map((node, i) => (
              <FileTreeItem 
                key={i} 
                node={node} 
                onSelect={handleSelect}
                selectedPath={activeFile ? `/${activeFile.name}` : ''} // Simplified matching logic for demo
                currentPath=""
              />
            ))}
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 bg-slate-950 overflow-hidden flex flex-col">
          {activeFile ? (
            <>
              <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-mono text-slate-300">{activeFile.name}</span>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                  <Copy size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <pre className="text-sm font-mono leading-relaxed text-slate-300">
                  <code>{activeFile.content || "// Select a file to view its content"}</code>
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-600">
              <p>Select a file from the explorer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};