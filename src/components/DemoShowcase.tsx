
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UpdateAction, updateObject, UpdateRule } from '@/lib/objectUpdater';
import JsonDiff from './JsonDiff';
import { Code } from 'lucide-react';

interface UseCase {
  title: string;
  description: string;
  sourceObject: any;
  rules: UpdateRule[];
  action: UpdateAction;
}

interface DemoShowcaseProps {
  useCases: UseCase[];
}

const DemoShowcase: React.FC<DemoShowcaseProps> = ({ useCases }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Common Use Cases</CardTitle>
        <CardDescription>
          Real-world examples of using update rules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={useCases[0]?.title.toLowerCase().replace(/\s+/g, '-')}>
          <TabsList className="grid grid-cols-3 mb-6">
            {useCases.map((useCase) => (
              <TabsTrigger 
                key={useCase.title} 
                value={useCase.title.toLowerCase().replace(/\s+/g, '-')}
              >
                {useCase.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {useCases.map((useCase) => {
            const result = updateObject(useCase.sourceObject, useCase.rules);
            
            return (
              <TabsContent 
                key={useCase.title} 
                value={useCase.title.toLowerCase().replace(/\s+/g, '-')}
                className="space-y-4"
              >
                <div>
                  <Badge variant="outline" className="mb-2">
                    {useCase.action}
                  </Badge>
                  <p>{useCase.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Code size={16} />
                      Update Rules
                    </h3>
                    <div className="code-block">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(useCase.rules, null, 2)}
                      </pre>
                    </div>
                  </div>
                  
                  <JsonDiff 
                    before={useCase.sourceObject} 
                    after={result} 
                  />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DemoShowcase;
