
import React from 'react';
import { Book, Code, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GITHUB_URL, README_URL, WEB_NAME } from '@/Constrains';

const Header: React.FC = () => {
  return (
    <header className="border-b border-border py-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2">
          <Database className="w-8 h-8 text-docs-primary" />
          <div>
            <h1 className="font-bold text-xl md:text-2xl tracking-tight">
              {WEB_NAME}
            </h1>
            <p className="text-muted-foreground text-sm">TypeScript-powered declarative object manipulation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <a href={README_URL} target='_blank' rel="noopener noreferrer">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Book size={16} />
            <span>Docs</span>
          </Button>
          </a>
          <a href={GITHUB_URL} target='_blank' rel="noopener noreferrer">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Code size={16} />
            <span>GitHub</span>
          </Button>
          </a>
          {/* <Button variant="outline" size="sm">
            Install
          </Button>
          <Button size="sm">
            Try it Out
          </Button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
