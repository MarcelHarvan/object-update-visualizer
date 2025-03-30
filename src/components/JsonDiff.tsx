
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JsonDiffProps {
  before: any;
  after: any;
}

// Helper function to format JSON with syntax highlighting
const formatJson = (json: any): string => {
  return JSON.stringify(json, null, 2);
};

// Simple diff highlighting component
const JsonDiff: React.FC<JsonDiffProps> = ({ before, after }) => {
  const beforeStr = useMemo(() => formatJson(before), [before]);
  const afterStr = useMemo(() => formatJson(after), [after]);
  
  // Create a simple line-by-line diff
  const diffLines = useMemo(() => {
    const beforeLines = beforeStr.split('\n');
    const afterLines = afterStr.split('\n');
    const maxLines = Math.max(beforeLines.length, afterLines.length);
    
    const result = [];
    
    for (let i = 0; i < maxLines; i++) {
      const beforeLine = beforeLines[i] || '';
      const afterLine = afterLines[i] || '';
      
      const isDifferent = beforeLine !== afterLine;
      
      result.push({
        before: beforeLine,
        after: afterLine,
        isDifferent
      });
    }
    
    return result;
  }, [beforeStr, afterStr]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Object Diff</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="code-block text-xs font-mono rounded-md bg-muted p-4 overflow-auto">
            <h3 className="text-sm font-medium mb-2">Original Object</h3>
            <div>
              {diffLines.map((line, index) => (
                <div 
                  key={`before-${index}`} 
                  className={line.isDifferent ? 'diff-removed bg-red-100 dark:bg-red-900/30' : ''}
                >
                  {line.before}
                </div>
              ))}
            </div>
          </div>
          
          <div className="code-block text-xs font-mono rounded-md bg-muted p-4 overflow-auto">
            <h3 className="text-sm font-medium mb-2">After Update</h3>
            <div>
              {diffLines.map((line, index) => (
                <div 
                  key={`after-${index}`} 
                  className={line.isDifferent ? 'diff-added bg-green-100 dark:bg-green-900/30' : ''}
                >
                  {line.after}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JsonDiff;
