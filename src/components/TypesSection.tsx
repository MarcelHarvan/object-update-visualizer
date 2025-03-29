
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TypesSection: React.FC = () => {
  const typeDefinitions = `// Update action types
export type UpdateAction = 
  | 'REPLACE'  // Replace the value entirely
  | 'IGNORE'   // Keep the original value
  | 'DELETE'   // Remove the property
  | 'MERGE'    // Deep merge objects
  | 'UNION'    // Union arrays 
  | 'UPSERT_BY_KEY'; // Update or insert array items by key

// Rule definition interface
export interface UpdateRule<T = any> {
  action: UpdateAction;
  path?: string | string[]; // dot notation path or path array
  value?: T;
  keyProperty?: string; // For UPSERT_BY_KEY action
}

// Main update function
export function updateObject<T extends Record<string, any>>(
  original: T, 
  rules: UpdateRule[]
): T;
`;

  const usageExample = `import { updateObject } from 'generic-object-updater';

// Define your source object (with TypeScript types)
interface Config {
  theme: {
    colors: {
      primary: string;
      secondary: string;
    };
    spacing: number[];
  };
  features: Array<{id: string; enabled: boolean}>;
}

const config: Config = {
  theme: {
    colors: {
      primary: '#8B5CF6',
      secondary: '#06B6D4'
    },
    spacing: [0, 4, 8, 16, 32]
  },
  features: [
    { id: 'feature1', enabled: true },
    { id: 'feature2', enabled: false }
  ]
};

// Apply rules with full type safety
const updatedConfig = updateObject<Config>(config, [
  {
    action: 'REPLACE',
    path: 'theme.colors.primary',
    value: '#10B981'
  },
  {
    action: 'UPSERT_BY_KEY',
    path: 'features',
    value: [
      { id: 'feature2', enabled: true },
      { id: 'feature3', enabled: true }
    ],
    keyProperty: 'id'
  }
]);

// TypeScript knows the return type is still Config
console.log(updatedConfig.theme.colors.primary); // TypeScript aware!`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>TypeScript Type Safety</CardTitle>
        <CardDescription>
          Generic Object Updater is built with TypeScript for strong type safety
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Type Definitions</h3>
            <div className="code-block">
              <pre className="text-xs">{typeDefinitions}</pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Type-Safe Usage</h3>
            <div className="code-block">
              <pre className="text-xs">{usageExample}</pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypesSection;
