
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Replace, 
  XCircle, 
  Trash2, 
  MergeIcon, 
  GitMerge,
  RefreshCcw 
} from 'lucide-react';

// Import UpdateAction from the object_updater package
import { UpdateAction } from 'object_updater';

interface RuleExplanationCardProps {
  action: UpdateAction;
  title: string;
  description: string;
  example: string;
}

const iconMap: Record<string, React.ReactNode> = {
  [UpdateAction.DELETE]: <Trash2 className="h-5 w-5" />,
  [UpdateAction.IGNORE]: <XCircle className="h-5 w-5" />,
  [UpdateAction.REPLACE]: <Replace className="h-5 w-5" />,
  [UpdateAction.MERGE]: <MergeIcon className="h-5 w-5" />,
  [UpdateAction.UNION]: <GitMerge className="h-5 w-5" />,
  [UpdateAction.UPSERT_BY_KEY]: <RefreshCcw className="h-5 w-5" />
};

const colorMap: Record<string, string> = {
  [UpdateAction.DELETE]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  [UpdateAction.IGNORE]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  [UpdateAction.REPLACE]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [UpdateAction.MERGE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [UpdateAction.UNION]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [UpdateAction.UPSERT_BY_KEY]: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
};

const RuleExplanationCard: React.FC<RuleExplanationCardProps> = ({
  action,
  title,
  description,
  example
}) => {
  // Convert action to string to ensure it's not being passed as an object
  const actionKey = String(action);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge 
            className={`flex items-center gap-1 ${colorMap[actionKey]} border-0`}
          >
            {iconMap[actionKey]}
            <span>{actionKey}</span>
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="code-block text-xs font-mono rounded-md bg-muted p-3">
          <pre>{example}</pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default RuleExplanationCard;
