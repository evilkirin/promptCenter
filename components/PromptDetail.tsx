
import React, { useState, useEffect } from 'react';
import { Prompt, Rating as RatingType } from '../types';
import Rating from './Rating';
import CommentSection from './CommentSection';
import VersionHistory from './VersionHistory';
import { EditIcon, PlusIcon, TagIcon, UserIcon, CopyIcon, CheckIcon, CompareIcon } from './IconComponents';

declare global {
    interface Window {
        diff_match_patch: any;
        marked?: { parse: (markdown: string) => string };
    }
}

interface PromptDetailProps {
  prompt: Prompt | null;
  onRate: (promptId: string, rating: Omit<RatingType, 'userId'>) => void;
  onComment: (promptId: string, comment: { author: string; content: string }) => void;
  onEditDetails: (prompt: Prompt) => void;
  onAddNewVersion: (prompt: Prompt) => void;
}

const PromptDetail: React.FC<PromptDetailProps> = ({ prompt, onRate, onComment, onEditDetails, onAddNewVersion }) => {
  const [viewedVersionNumber, setViewedVersionNumber] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [isDiffLibReady, setIsDiffLibReady] = useState(false);
  const [isMarkedLibReady, setIsMarkedLibReady] = useState(false);

  useEffect(() => {
    const pollForLibrary = (
        libName: string,
        setReady: (isReady: boolean) => void
    ) => {
        if ((window as any)[libName]) {
            setReady(true);
            return null;
        }

        let attempt = 0;
        const interval = setInterval(() => {
            if ((window as any)[libName]) {
                setReady(true);
                clearInterval(interval);
            } else if (attempt > 25) { // ~5 seconds
                console.error(`${libName} library failed to load after 5 seconds.`);
                clearInterval(interval);
            }
            attempt++;
        }, 200);
        return () => clearInterval(interval);
    };

    const cleanupDiff = pollForLibrary('diff_match_patch', setIsDiffLibReady);
    const cleanupMarked = pollForLibrary('marked', setIsMarkedLibReady);

    return () => {
        if (cleanupDiff) cleanupDiff();
        if (cleanupMarked) cleanupMarked();
    };
  }, []);

  useEffect(() => {
    if (prompt) {
      setViewedVersionNumber(prompt.currentVersion);
      setShowDiff(false); // Reset diff on prompt change
    }
  }, [prompt]);

  if (!prompt) {
    return (
      <main className="flex-grow flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400">选择一个提示词</h2>
          <p className="text-gray-500">从左侧列表中选择一个提示词以查看其详细信息。</p>
        </div>
      </main>
    );
  }

  const handleSelectVersion = (versionNumber: number) => {
    setViewedVersionNumber(versionNumber);
    setShowDiff(false); // Reset diff on version change
  };

  const viewedVersion = prompt.versions.find(v => v.versionNumber === viewedVersionNumber) || prompt.versions.find(v => v.versionNumber === prompt.currentVersion)!;
  const previousVersion = viewedVersion ? prompt.versions.find(v => v.versionNumber === viewedVersion.versionNumber - 1) : null;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(viewedVersion.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleRate = (score: number) => {
      onRate(prompt.id, { score });
  };
  
  const handleAddComment = (comment: { author: string; content: string }) => {
      onComment(prompt.id, comment);
  };

  return (
    <main className="flex-grow flex flex-col bg-gray-900 overflow-y-auto">
      <div className="p-6 md:p-8 flex-grow">
        {/* Header */}
        <div className="border-b border-gray-700 pb-4 mb-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-white">{prompt.title}</h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center"><UserIcon className="w-4 h-4 mr-1.5" /> By {prompt.author}</span>
                    </div>
                </div>
                 <div className="flex space-x-3 flex-shrink-0">
                    <button onClick={() => onEditDetails(prompt)} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                        <EditIcon className="w-5 h-5" />
                        <span>编辑详情</span>
                    </button>
                    <button onClick={() => onAddNewVersion(prompt)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                        <PlusIcon className="w-5 h-5" />
                        <span>添加版本</span>
                    </button>
                </div>
            </div>
            <p className="mt-4 text-gray-300">{prompt.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
                {prompt.tags.map(tag => (
                    <span key={tag} className="flex items-center bg-gray-700 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                        <TagIcon className="w-3 h-3 mr-1.5" />
                        {tag}
                    </span>
                ))}
            </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                {/* Prompt Content */}
                <div className="bg-gray-800/50 rounded-lg p-4 relative">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-200">
                          提示词内容 (版本 {viewedVersion.versionNumber}{viewedVersion.versionNumber !== prompt.currentVersion && ' - 预览'})
                        </h3>
                        <div className="flex items-center space-x-2">
                             {previousVersion && (
                                <button
                                    onClick={() => setShowDiff(!showDiff)}
                                    disabled={!isDiffLibReady}
                                    title={!isDiffLibReady ? '对比库正在加载中...' : (showDiff ? '隐藏对比' : '与上一版本对比')}
                                    className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 font-medium py-1.5 px-3 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CompareIcon className="w-4 h-4" />
                                    <span>{showDiff ? '隐藏对比' : '对比'}</span>
                                </button>
                            )}
                            <button
                                onClick={handleCopyToClipboard}
                                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 font-medium py-1.5 px-3 rounded-md transition-colors duration-200"
                            >
                                {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                                <span>{copied ? '已复制!' : '复制'}</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-md whitespace-pre-wrap font-mono text-sm text-gray-300 min-h-[150px]">
                        {showDiff && isDiffLibReady && previousVersion ? (
                            <div className="diff-container">
                                <style>{`
                                    .diff-container del {
                                        background-color: rgba(239, 68, 68, 0.2) !important;
                                        color: #f87171 !important;
                                        text-decoration: none !important;
                                        border-radius: 4px;
                                        padding: 2px 4px;
                                    }
                                    .diff-container ins {
                                        background-color: rgba(16, 185, 129, 0.2) !important;
                                        color: #34d399 !important;
                                        text-decoration: none !important;
                                        border-radius: 4px;
                                        padding: 2px 4px;
                                    }
                                `}</style>
                                <div dangerouslySetInnerHTML={{ __html: (() => {
                                    const dmp = new window.diff_match_patch();
                                    const diffs = dmp.diff_main(previousVersion.content, viewedVersion.content);
                                    dmp.diff_cleanupSemantic(diffs);
                                    return dmp.diff_prettyHtml(diffs);
                                })() }} />
                            </div>
                        ) : (
                            viewedVersion.content
                        )}
                    </div>
                </div>

                {/* Rating */}
                <div className="mt-6 border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">评价此提示词</h3>
                    <div className="flex items-center space-x-4">
                      <Rating rating={prompt.averageRating} onRate={handleRate} />
                      <span className="text-sm text-gray-400">({prompt.ratings.length} 评价)</span>
                    </div>
                </div>

                {/* Comments */}
                <div className="mt-6 border-t border-gray-700 pt-6">
                  <CommentSection comments={prompt.comments} onAddComment={handleAddComment} />
                </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
                <div className="bg-gray-800/50 rounded-lg p-4 sticky top-6">
                  <VersionHistory 
                    versions={prompt.versions} 
                    currentVersionNumber={prompt.currentVersion}
                    viewedVersionNumber={viewedVersionNumber!}
                    onSelectVersion={handleSelectVersion}
                    isMarkedLibReady={isMarkedLibReady}
                  />
                </div>
            </div>
        </div>
      </div>
    </main>
  );
};

export default PromptDetail;