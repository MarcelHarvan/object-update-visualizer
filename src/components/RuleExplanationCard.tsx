
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UpdateAction } from '@/lib/objectUpdater';
import { 
  Replace, 
  XCircle, 
  Trash2, 
  MergeIcon, 
  GitMerge, // Replacing Union with GitMerge
  RefreshCcw 
} from 'lucide-react';

interface RuleExplanationCardProps {
  action: UpdateAction;
  title: string;
  description: string;
  example: string;
}

const iconMap: Record<UpdateAction, React.ReactNode> = {
  'REPLACE': <Replace className="h-5 w-5" />,
  'IGNORE': <XCircle className="h-5 w-5" />,
  'DELETE': <Trash2 className="h-5 w-5" />,
  'MERGE': <MergeIcon className="h-5 w-5" />,
  'UNION': <GitMerge className="h-5 w-5" />, // Using GitMerge instead of Union
  'UPSERT_BY_KEY': <RefreshCcw className="h-5 w-5" />,
};

const colorMap: Record<UpdateAction, string> = {
  'REPLACE': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'IGNORE': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  'DELETE': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'MERGE': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'UNION': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'UPSERT_BY_KEY': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
};

const RuleExplanationCard: React.FC<RuleExplanationCardProps> = ({
  action,
  title,
  description,
  example
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge 
            className={`flex items-center gap-1 ${colorMap[action]} border-0`}
          >
            {iconMap[action]}
            <span>{action}</span>
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="code-block text-xs">
          <pre>{example}</pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default RuleExplanationCard;
