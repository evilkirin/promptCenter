
import React from 'react';
import { Version } from '../types';
import { ClockIcon } from './IconComponents';

declare global {
    interface Window {
        marked?: { parse: (markdown: string) => string };
    }
}

interface VersionHistoryProps {
  versions: Version[];
  currentVersionNumber: number;
  viewedVersionNumber: number;
  onSelectVersion: (versionNumber: number) => void;
  isMarkedLibReady: boolean;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ versions, currentVersionNumber, viewedVersionNumber, onSelectVersion, isMarkedLibReady }) => {
  // Show most recent first
  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
        <ClockIcon className="w-5 h-5 mr-2" />
        版本历史
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {sortedVersions.map(version => {
          const isViewed = viewedVersionNumber === version.versionNumber;
          return (
            <div
              key={version.id}
              onClick={() => onSelectVersion(version.versionNumber)}
              className={`
                p-3 rounded-lg cursor-pointer transition-all duration-200 border
                ${isViewed
                  ? 'bg-blue-900/50 border-blue-600'
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700/80'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">版本 {version.versionNumber}</span>
                {version.versionNumber === currentVersionNumber && (
                  <span className="text-xs bg-green-500 text-white font-bold px-2 py-1 rounded-full">
                    最新
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(version.timestamp).toLocaleString()}
              </p>
              {isViewed && version.description && (
                <div className="mt-3 pt-3 border-t border-blue-700/50 text-sm">
                  {isMarkedLibReady && window.marked ? (
                    <div 
                      className="prose prose-sm prose-invert max-w-none prose-a:text-blue-400 prose-strong:text-gray-100"
                      dangerouslySetInnerHTML={{ __html: window.marked.parse(version.description) }}
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-gray-400">
                      {version.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default VersionHistory;