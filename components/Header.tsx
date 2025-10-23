
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-lg">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          提示词展示中心
        </h1>
        <p className="text-sm text-gray-400">发现、分享和优化最佳提示词</p>
      </div>
    </header>
  );
};

export default Header;