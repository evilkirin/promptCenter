import React from 'react';
import { Prompt } from '../types';
import Rating from './Rating';

interface PromptListItemProps {
  prompt: Prompt;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PromptListItem: React.FC<PromptListItemProps> = ({ prompt, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(prompt.id)}
      className={`
        p-4 border-l-4 cursor-pointer transition-all duration-200
        ${isSelected
          ? 'bg-gray-700/50 border-blue-500'
          : 'bg-transparent border-transparent hover:bg-gray-800/60 hover:border-gray-600'
        }
      `}
    >
      <h3 className="font-semibold text-white truncate">{prompt.title}</h3>
      <p className="text-sm text-gray-400 truncate">{prompt.description}</p>
      <div className="mt-2">
        <Rating rating={prompt.averageRating} readOnly />
      </div>
    </div>
  );
};

export default PromptListItem;