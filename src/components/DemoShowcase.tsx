
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UpdateAction } from 'object_updater';
import { 
  Replace, 
  XCircle, 
  Trash2, 
  MergeIcon, 
  GitMerge, 
  RefreshCcw 
} from 'lucide-react';

interface PrimitiveRule {
  action: UpdateAction;
  mergeKey?: string;
}

interface UseCase {
  title: string;
  description: string;
  action: UpdateAction;
  sourceObject: Record<string, any>;
  updateObject: Record<string, any>;
  rules: Record<string, PrimitiveRule>;
}

interface DemoShowcaseProps {
  useCases: UseCase[];
}

const iconMap: Record<UpdateAction, React.ReactNode> = {
  'DELETE': <Trash2 className="h-5 w-5" />,
  'IGNORE': <XCircle className="h-5 w-5" />,
  'REPLACE': <Replace className="h-5 w-5" />,
  'MERGE': <MergeIcon className="h-5 w-5" />,
  'UNION': <GitMerge className="h-5 w-5" />,
  'UPSERT_BY_KEY': <RefreshCcw className="h-5 w-5" />,
};

const colorMap: Record<UpdateAction, string> = {
  'DELETE': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'IGNORE': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  'REPLACE': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'MERGE': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'UNION': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'UPSERT_BY_KEY': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

const DemoShowcase: React.FC<DemoShowcaseProps> = ({ useCases }) => {
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
      
      {useCases.map((useCase, index) => (
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
                <Badge className={`flex items-center gap-1 ${colorMap[useCase.action]} border-0`}>
                  {iconMap[useCase.action]}
                  <span>{useCase.action}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Original Object</h3>
                  <div className="code-block p-3 text-xs">
                    <pre>{JSON.stringify(useCase.sourceObject, null, 2)}</pre>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Update</h3>
                  <div className="code-block p-3 text-xs">
                    <pre>{JSON.stringify(useCase.updateObject, null, 2)}</pre>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Rules</h3>
                  <div className="code-block p-3 text-xs">
                    <pre>{JSON.stringify(useCase.rules, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DemoShowcase;
