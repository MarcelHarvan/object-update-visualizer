
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TypesSection: React.FC = () => {
  const typeDefinitions = `// Update action enum
export enum UpdateAction {
    /** Deletes the property from the original object */
    DELETE = 'DELETE',
    /** Ignores the update and makes no changes to the original object */
    IGNORE = 'IGNORE',
    /** Replaces the value of the property in the original object with the update value */
    REPLACE = 'REPLACE',
    /** Additional Array rules */
    /** Merges original values with update, no check for duplicates */
    MERGE = 'MERGE',
    /** Merges original values with update, no duplicates */
    UNION = 'UNION',
    /** update if exists, insert if not */
    UPSERT_BY_KEY = 'UPSERT_BY_KEY'
}

// Rule definition interface
export interface PrimitiveRule {
    /** Represents action for update */
    action: UpdateAction;
    /** 
     * Represents update key for arrays of objects.
     */
    mergeKey?: string;
}`;

  const usageExample = `import { UpdateAction, updateObject } from 'object_updater';

// Define your source object (with TypeScript types)
interface User {
  name: string;
  age: number;
  tags: string[];
  contacts: Array<{id: number; name: string}>;
}

const original: User = {
  name: "Alice",
  age: 30,
  tags: ["developer", "engineer"],
  contacts: [
    { id: 1, name: "Bob" },
    { id: 2, name: "Charlie" }
  ]
};

const update = {
  name: "Alice Johnson",
  age: 31,
  tags: ["engineer", "designer"],
  contacts: [
    { id: 2, name: "Charles" },
    { id: 3, name: "David" }
  ]
};

// Define rules with full type safety
const rules = {
  name: { action: UpdateAction.REPLACE },
  age: { action: UpdateAction.IGNORE },
  tags: { action: UpdateAction.UNION },
  contacts: { 
    action: UpdateAction.UPSERT_BY_KEY, 
    mergeKey: "id" 
  }
};

// Apply rules with full type safety
const updatedUser = updateObject<User>(original, update, rules);

// TypeScript knows the return type is still User
console.log(updatedUser.name); // "Alice Johnson"
console.log(updatedUser.age);  // 30 (ignored update)`;

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
