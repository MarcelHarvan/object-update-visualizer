
import React from 'react';
import { Book, Code, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="border-b border-border py-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2">
          <Database className="w-8 h-8 text-docs-primary" />
          <div>
            <h1 className="font-bold text-xl md:text-2xl tracking-tight">
              Generic Object Updater
            </h1>
            <p className="text-muted-foreground text-sm">TypeScript-powered declarative object manipulation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Book size={16} />
            <span>Docs</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Code size={16} />
            <span>GitHub</span>
          </Button>
          <Button variant="outline" size="sm">
            Install
          </Button>
          <Button size="sm">
            Try it Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
