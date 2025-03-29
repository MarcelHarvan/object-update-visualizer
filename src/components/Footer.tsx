
import React from 'react';
import { Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border py-8 mt-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-semibold text-lg">Generic Object Updater</h3>
            <p className="text-muted-foreground text-sm">
              A powerful library for declarative object updates in TypeScript
            </p>
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Generic Object Updater. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
