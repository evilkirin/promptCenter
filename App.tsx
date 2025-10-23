import React, { useState, useCallback } from 'react';
import { Prompt } from './types';
import { usePrompts } from './hooks/usePrompts';
import Header from './components/Header';
import PromptList from './components/PromptList';
import PromptDetail from './components/PromptDetail';
import PromptEditModal from './components/PromptEditModal';

type ModalMode = 'create' | 'editDetails' | 'addVersion';

const App: React.FC = () => {
  const { prompts, addPrompt, updatePromptDetails, addVersionToPrompt, addComment, addRating } = usePrompts();
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>('1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>('create');

  const selectedPrompt = prompts.find(p => p.id === selectedPromptId) || null;

  const handleNewPrompt = useCallback(() => {
    setEditingPrompt(null);
    setModalMode('create');
    setIsModalOpen(true);
  }, []);

  const handleEditDetails = useCallback((prompt: Prompt) => {
    setEditingPrompt(prompt);
    setModalMode('editDetails');
    setIsModalOpen(true);
  }, []);
  
  const handleAddNewVersion = useCallback((prompt: Prompt) => {
    setEditingPrompt(prompt);
    setModalMode('addVersion');
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingPrompt(null);
  }, []);

  const handleSavePrompt = useCallback((data: any, mode: ModalMode) => {
    switch (mode) {
      case 'create':
        const newPrompt = addPrompt(data);
        setSelectedPromptId(newPrompt.id);
        break;
      case 'editDetails':
        if (editingPrompt) {
          updatePromptDetails(editingPrompt.id, data);
        }
        break;
      case 'addVersion':
        if (editingPrompt) {
          addVersionToPrompt(editingPrompt.id, data);
        }
        break;
    }
    handleCloseModal();
  }, [editingPrompt, addPrompt, updatePromptDetails, addVersionToPrompt, handleCloseModal]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 text-gray-200 antialiased">
      <Header />
      <div className="flex-grow flex overflow-hidden">
        <PromptList
          prompts={prompts}
          selectedPromptId={selectedPromptId}
          onSelectPrompt={setSelectedPromptId}
          onNewPrompt={handleNewPrompt}
        />
        <PromptDetail
          prompt={selectedPrompt}
          onRate={addRating}
          onComment={addComment}
          onEditDetails={handleEditDetails}
          onAddNewVersion={handleAddNewVersion}
        />
      </div>
      <PromptEditModal
        isOpen={isModalOpen}
        mode={modalMode}
        onClose={handleCloseModal}
        onSave={handleSavePrompt}
        prompt={editingPrompt}
      />
    </div>
  );
};

export default App;