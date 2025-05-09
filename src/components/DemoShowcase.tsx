
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Replace, 
  XCircle, 
  Trash2, 
  MergeIcon, 
  GitMerge, 
  RefreshCcw 
} from 'lucide-react';
import JsonDiff from './JsonDiff';
// Import from object_updater package instead of the local file
import { UpdateAction, updateObject } from 'object_updater';

interface UseCase {
  title: string;
  description: string;
  action: UpdateAction;
  sourceObject: Record<string, any>;
  updateObject: Record<string, any>;
  rules: Record<string, any>;
}

interface DemoShowcaseProps {
  useCases: UseCase[];
}

// Update icon map to use string keys
const iconMap: Record<string, React.ReactNode> = {
  [UpdateAction.DELETE.toString()]: <Trash2 className="h-5 w-5" />,
  [UpdateAction.IGNORE.toString()]: <XCircle className="h-5 w-5" />,
  [UpdateAction.REPLACE.toString()]: <Replace className="h-5 w-5" />,
  [UpdateAction.MERGE.toString()]: <MergeIcon className="h-5 w-5" />,
  [UpdateAction.UNION.toString()]: <GitMerge className="h-5 w-5" />,
  [UpdateAction.UPSERT_BY_KEY.toString()]: <RefreshCcw className="h-5 w-5" />
};

// Update color map to use string keys
const colorMap: Record<string, string> = {
  [UpdateAction.DELETE.toString()]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  [UpdateAction.IGNORE.toString()]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  [UpdateAction.REPLACE.toString()]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [UpdateAction.MERGE.toString()]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [UpdateAction.UNION.toString()]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [UpdateAction.UPSERT_BY_KEY.toString()]: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
};

const DemoShowcase: React.FC<DemoShowcaseProps> = ({ useCases }) => {

  
  const useCasesWithResults = useMemo(() => {
    return useCases.map(useCase => {
      const sourceObjectCopy = JSON.parse(JSON.stringify(useCase.sourceObject));
      // Apply the update to the source object
      const updatedObject = updateObject(
        sourceObjectCopy,
        useCase.updateObject,
        useCase.rules
      );
      
      return {
        ...useCase,
        resultObject: updatedObject
      };
    });
  }, [useCases, updateObject]);
  
  return (
    <Tabs defaultValue={useCases[0]?.title.toLowerCase().replace(/\s+/g, '-') || '0'}>
      <TabsList className="mb-4">
        {useCases.map((useCase, index) => (
          <TabsTrigger 
            key={index} 
            value={useCase.title.toLowerCase().replace(/\s+/g, '-')}
          >
            {useCase.title}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {useCasesWithResults.map((useCase, index) => {
        // Convert action to string
        const actionKey = useCase.action.toString();
        
        return (
          <TabsContent 
            key={index} 
            value={useCase.title.toLowerCase().replace(/\s+/g, '-')}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{useCase.title}</CardTitle>
                    <CardDescription>{useCase.description}</CardDescription>
                  </div>
                  <Badge className={`flex items-center gap-1 ${colorMap[actionKey]} border-0`}>
                    {iconMap[actionKey]}
                    <span>{actionKey}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Original Object</h3>
                    <div className="code-block p-3 text-xs font-mono rounded-md bg-muted">
                      <pre>{JSON.stringify(useCase.sourceObject, null, 2)}</pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Update</h3>
                    <div className="code-block p-3 text-xs font-mono rounded-md bg-muted">
                      <pre>{JSON.stringify(useCase.updateObject, null, 2)}</pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Rules</h3>
                    <div className="code-block p-3 text-xs font-mono rounded-md bg-muted">
                      <pre>{JSON.stringify(useCase.rules, null, 2)}</pre>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Result After Update</h3>
                  <JsonDiff before={useCase.sourceObject} after={useCase.resultObject} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default DemoShowcase;
