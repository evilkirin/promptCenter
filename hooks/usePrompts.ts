import { useState, useCallback } from 'react';
import { Prompt, Comment, Rating, Version } from '../types';

const MOCK_PROMPTS: Prompt[] = [
  {
    id: '1',
    title: '创意故事开篇',
    author: '张三',
    description: '一个多功能的提示词，旨在通过呈现一个引人入胜的神秘场景来启动创意写作。适用于奇幻、科幻或悬疑类型。',
    tags: ['创意写作', '奇幻', '故事'],
    averageRating: 4.5,
    ratings: [{ userId: 'user1', score: 4 }, { userId: 'user2', score: 5 }],
    comments: [
      { id: 'c1', author: '李四', content: '这真的帮助我解决了写作瓶颈！', timestamp: new Date(Date.now() - 86400000).toISOString() }
    ],
    versions: [
        { id: 'v1', content: '你在一片古老的森林中央发现了一个发光的球体。它是什么？你接下来会怎么做？', description: '提示词的初始简单版本。', versionNumber: 1, timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: 'v2', content: '在一片古老、飒飒作响的森林中心，你偶然发现了一个脉动的水晶球体，它静置于一个长满青苔的基座上。当你靠近时，它发出低沉而有共鸣的嗡嗡声。请描述这个球体、它的周围环境以及你角色的第一个动作。', description: '增加了更多描述性语言以增强沉浸感并引导用户。这个版本更适合激发详细的创意写作。\n\n**变更:**\n* 使用了更具感染力的词汇。\n* 明确了球体是水晶材质且放置在基座上。', versionNumber: 2, timestamp: new Date().toISOString() }
    ],
    currentVersion: 2,
  },
  {
    id: '2',
    title: '技术问题解析器',
    author: '王五',
    description: '一个挑战AI用具体的类比，以简单易懂的语言解释复杂技术主题的提示词。',
    tags: ['技术', '解释', '通俗易懂'],
    averageRating: 4.8,
    ratings: [{ userId: 'user1', score: 5 }, { userId: 'user3', score: 4.5 }],
    comments: [],
    versions: [
        { id: 'v3', content: '向一个10岁的孩子解释区块链的概念。请使用乐高积木作为类比。', description: '技术解析器提示词的第一个版本。', versionNumber: 1, timestamp: new Date().toISOString() }
    ],
    currentVersion: 1,
  },
];


export const usePrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>(MOCK_PROMPTS);

  const addPrompt = useCallback((data: { title: string; author: string; description: string; content: string; tags: string[]; versionDescription: string; }) => {
    const newPrompt: Prompt = {
      id: crypto.randomUUID(),
      title: data.title,
      author: data.author,
      description: data.description,
      tags: data.tags,
      averageRating: 0,
      ratings: [],
      comments: [],
      versions: [
        {
          id: crypto.randomUUID(),
          content: data.content,
          description: data.versionDescription || '初始版本。',
          versionNumber: 1,
          timestamp: new Date().toISOString()
        }
      ],
      currentVersion: 1
    };
    setPrompts(prev => [newPrompt, ...prev]);
    return newPrompt;
  }, []);

  const updatePromptDetails = useCallback((promptId: string, data: { title: string; author: string; description: string; tags: string[] }) => {
      setPrompts(prev => prev.map(p => {
          if (p.id === promptId) {
              return {
                  ...p,
                  title: data.title,
                  author: data.author,
                  description: data.description,
                  tags: data.tags
              };
          }
          return p;
      }));
  }, []);

  const addVersionToPrompt = useCallback((promptId: string, data: { content: string; versionDescription: string }) => {
    setPrompts(prev => prev.map(p => {
      if (p.id === promptId) {
        const newVersionNumber = p.currentVersion + 1;
        const newVersion: Version = {
            id: crypto.randomUUID(),
            content: data.content,
            description: data.versionDescription,
            versionNumber: newVersionNumber,
            timestamp: new Date().toISOString(),
        };
        return { 
            ...p,
            versions: [...p.versions, newVersion],
            currentVersion: newVersionNumber
        };
      }
      return p;
    }));
  }, []);

  const addComment = useCallback((promptId: string, comment: { author: string; content: string }) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      ...comment,
      timestamp: new Date().toISOString()
    };
    setPrompts(prev => prev.map(p =>
      p.id === promptId ? { ...p, comments: [...p.comments, newComment] } : p
    ));
  }, []);

  const addRating = useCallback((promptId: string, rating: Omit<Rating, 'userId'>) => {
    const newRating: Rating = { ...rating, userId: `user-${crypto.randomUUID()}` }; // Mock user ID
    
    setPrompts(prev => prev.map(p => {
      if (p.id === promptId) {
        const newRatings = [...p.ratings, newRating];
        const totalScore = newRatings.reduce((sum, r) => sum + r.score, 0);
        const averageRating = parseFloat((totalScore / newRatings.length).toFixed(1));
        return { ...p, ratings: newRatings, averageRating };
      }
      return p;
    }));
  }, []);

  return { prompts, addPrompt, updatePromptDetails, addVersionToPrompt, addComment, addRating };
};