export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface Version {
  id: string;
  content: string;
  description: string; // Acts as "release notes" for the version
  timestamp: string;
  versionNumber: number;
}

export interface Rating {
  userId: string; // In a real app, this would be a unique user ID
  score: number;
}

export interface Prompt {
  id:string;
  title: string;
  description: string; // Overarching description for the prompt
  author: string;
  tags: string[];
  averageRating: number;
  ratings: Rating[];
  comments: Comment[];
  versions: Version[];
  currentVersion: number;
}