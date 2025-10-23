import React, { useState, useEffect } from 'react';
import { Prompt } from '../types';

type ModalMode = 'create' | 'editDetails' | 'addVersion';

interface PromptEditModalProps {
  isOpen: boolean;
  mode: ModalMode;
  onClose: () => void;
  onSave: (data: any, mode: ModalMode) => void;
  prompt: Prompt | null;
}

const PromptEditModal: React.FC<PromptEditModalProps> = ({ isOpen, mode, onClose, onSave, prompt }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    tags: '',
    content: '',
    versionDescription: '',
  });

  useEffect(() => {
    if (isOpen) {
      const latestVersion = prompt ? prompt.versions.find(v => v.versionNumber === prompt.currentVersion) : null;
      setFormData({
        title: prompt?.title || '',
        author: prompt?.author || '',
        description: prompt?.description || '',
        tags: prompt?.tags.join(', ') || '',
        content: latestVersion?.content || '',
        versionDescription: mode === 'addVersion' ? '' : (latestVersion?.description || '初始版本。'),
      });
    }
  }, [prompt, isOpen, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    onSave({ ...formData, tags: tagsArray }, mode);
  };

  if (!isOpen) return null;

  const getTitle = () => {
    switch(mode) {
      case 'create': return '创建新提示词';
      case 'editDetails': return '编辑提示词详情';
      case 'addVersion': return '添加新版本';
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-6">{getTitle()}</h2>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-4">
          
          {(mode === 'create' || mode === 'editDetails') && (
            <>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">标题</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-input" />
              </div>
              <div className="mb-4">
                <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-1">作者</label>
                <input type="text" name="author" value={formData.author} onChange={handleChange} required className="form-input" />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">提示词简介</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="form-input" placeholder="简要概括这个提示词的功能。"/>
              </div>
              <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">标签 (用逗号分隔)</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="form-input" />
              </div>
            </>
          )}

          {(mode === 'create' || mode === 'addVersion') && (
            <>
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">提示词内容</label>
                <textarea name="content" value={formData.content} onChange={handleChange} required rows={8} className="form-input font-mono text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="versionDescription" className="block text-sm font-medium text-gray-300 mb-1">版本说明</label>
                <textarea name="versionDescription" value={formData.versionDescription} onChange={handleChange} required rows={3} className="form-input" placeholder="说明这个版本的变更内容。"/>
              </div>
            </>
          )}

          <style>{`
            .form-input {
              width: 100%;
              background-color: #374151;
              border: 1px solid #4B5563;
              border-radius: 0.375rem;
              padding: 0.5rem 0.75rem;
              color: #E5E7EB;
              placeholder-color: #9CA3AF;
            }
            .form-input:focus {
              outline: none;
              border-color: #3B82F6;
              box-shadow: 0 0 0 2px #3B82F6;
            }
          `}</style>
        </form>
         <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-700">
            <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">取消</button>
            <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">保存</button>
        </div>
      </div>
    </div>
  );
};

export default PromptEditModal;