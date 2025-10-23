
import React from 'react';
import { Prompt } from '../types';
import PromptListItem from './PromptListItem';
import { PlusIcon } from './IconComponents';

interface PromptListProps {
  prompts: Prompt[];
  selectedPromptId: string | null;
  onSelectPrompt: (id: string) => void;
  onNewPrompt: () => void;
}

const PromptList: React.FC<PromptListProps> = ({ prompts, selectedPromptId, onSelectPrompt, onNewPrompt }) => {
  return (
    <aside className="w-1/3 max-w-sm bg-gray-800/50 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">所有提示词</h2>
        <button
            onClick={onNewPrompt}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-200"
        >
            <PlusIcon className="w-5 h-5" />
            <span>新建</span>
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {prompts.map(prompt => (
          <PromptListItem
            key={prompt.id}
            prompt={prompt}
            isSelected={prompt.id === selectedPromptId}
            onSelect={onSelectPrompt}
          />
        ))}
      </div>
    </aside>
  );
};

export default PromptList;