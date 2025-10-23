
import React, { useState } from 'react';
import { Comment } from '../types';
import { UserIcon } from './IconComponents';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (comment: { author: string; content: string }) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
    const [newComment, setNewComment] = useState('');
    const [author, setAuthor] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() && author.trim()) {
            onAddComment({ author, content: newComment });
            setNewComment('');
            setAuthor('');
        }
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">评论 ({comments.length})</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="bg-gray-800 p-3 rounded-lg flex items-start space-x-3">
                           <div className="bg-gray-700 rounded-full p-2 mt-1">
                             <UserIcon className="w-5 h-5 text-gray-400" />
                           </div>
                           <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-blue-400">{comment.author}</span>
                                <span className="text-xs text-gray-500">
                                    {new Date(comment.timestamp).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-300">{comment.content}</p>
                           </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">暂无评论。快来发表第一条评论吧！</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 border-t border-gray-700 pt-4">
                <div className="mb-2">
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="你的名字"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-2">
                     <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="添加一条评论..."
                        rows={3}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                    提交评论
                </button>
            </form>
        </div>
    );
};

export default CommentSection;