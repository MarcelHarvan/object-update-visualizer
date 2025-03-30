import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RuleExplanationCard from '@/components/RuleExplanationCard';
import Playground from '@/components/Playground';
import DemoShowcase from '@/components/DemoShowcase';
import TypesSection from '@/components/TypesSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database } from 'lucide-react';
import { UpdateAction } from 'object_updater';

interface UseCase {
  title: string;
  description: string;
  action: UpdateAction;
  sourceObject: Record<string, any>;
  updateObject: Record<string, any>;
  rules: Record<string, any>;
}

const ruleExplanations = [
  {
    action: UpdateAction.REPLACE,
    title: 'Replace',
    description: 'Completely replaces the value at the specified path with a new value.',
    example: `{
  "name": {
    action: "${UpdateAction.REPLACE}"
  }
}`
  },
  {
    action: UpdateAction.IGNORE,
    title: 'Ignore',
    description: 'Keeps the original value, ignoring any updates to this property.',
    example: `{
  "config": {
    action: "${UpdateAction.IGNORE}"
  }
}`
  },
  {
    action: UpdateAction.DELETE,
    title: 'Delete',
    description: 'Completely removes the property from the original object.',
    example: `{
  "temporaryData": {
    action: "${UpdateAction.DELETE}"
  }
}`
  },
  {
    action: UpdateAction.MERGE,
    title: 'Merge',
    description: 'Deep merges arrays, combining values from both original and update arrays.',
    example: `{
  "settings": {
    action: "${UpdateAction.MERGE}"
  }
}`
  },
  {
    action: UpdateAction.UNION,
    title: 'Union',
    description: 'Creates a union of arrays, ensuring no duplicate values are added.',
    example: `{
  "permissions": {
    action: "${UpdateAction.UNION}"
  }
}`
  },
  {
    action: UpdateAction.UPSERT_BY_KEY,
    title: 'Upsert By Key',
    description: 'Updates existing items or inserts new ones in an array based on a key property.',
    example: `{
  "users": {
    action: "${UpdateAction.UPSERT_BY_KEY}",
    mergeKey: "id"
  }
}`
  }
];

const initialPlaygroundObject = {
  name: "Alice",
  age: 30,
  tags: ["developer", "engineer"],
  users: [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ],
  salary: 5000
};

const initialPlaygroundUpdate = {
  name: "Alice Johnson",
  age: 31,
  tags: ["engineer", "designer"],
  users: [
    { id: 2, name: "Bobby" },
    { id: 3, name: "Charlie" }
  ],
  salary: 6000
};

const initialPlaygroundRules = {
  name: { action: UpdateAction.REPLACE },
  age: { action: UpdateAction.IGNORE },
  tags: { action: UpdateAction.UNION },
  users: { action: UpdateAction.UPSERT_BY_KEY, mergeKey: "id" },
  salary: { action: UpdateAction.REPLACE }
};

const useCases: UseCase[] = [
  {
    title: 'Config Management',
    description: 'Merging user configuration with default settings',
    action: UpdateAction.MERGE,
    sourceObject: {
      theme: 'light',
      fontSize: 16,
      notifications: false
    },
    updateObject: {
      theme: 'dark',
      animations: true
    },
    rules: {
      theme: { action: UpdateAction.REPLACE },
      animations: { action: UpdateAction.REPLACE },
      fontSize: { action: UpdateAction.IGNORE },
      notifications: { action: UpdateAction.IGNORE }
    }
  },
  {
    title: 'Data Transformation',
    description: 'Transforming API data to fit application needs',
    action: UpdateAction.REPLACE,
    sourceObject: {
      user: {
        firstName: 'John',
        lastName: 'Doe',
        address: {
          street: '123 Main St',
          city: 'New York'
        }
      },
      orders: [
        { id: 1, status: 'processing' },
        { id: 2, status: 'shipped' }
      ]
    },
    updateObject: {
      user: {
        name: 'John Doe',
        location: 'New York'
      },
      orders: [
        { id: 2, status: 'delivered' },
        { id: 3, status: 'processing' }
      ]
    },
    rules: {
      user: { action: UpdateAction.REPLACE },
      orders: { action: UpdateAction.UPSERT_BY_KEY, mergeKey: 'id' }
    }
  },
  {
    title: 'State Management',
    description: 'Handling complex state updates in frontend applications',
    action: UpdateAction.UPSERT_BY_KEY,
    sourceObject: {
      todos: [
        { id: 1, text: 'Learn TypeScript', completed: false },
        { id: 2, text: 'Build a project', completed: false }
      ],
      filter: 'all',
      stats: {
        completed: 0,
        total: 2
      }
    },
    updateObject: {
      todos: [
        { id: 1, completed: true },
        { id: 3, text: 'Write tests', completed: false }
      ],
      stats: {
        completed: 1,
        total: 3
      }
    },
    rules: {
      todos: { action: UpdateAction.UPSERT_BY_KEY, mergeKey: 'id' },
      stats: { action: UpdateAction.REPLACE },
      filter: { action: UpdateAction.IGNORE }
    }
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-docs-background">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 md:py-24 border-b">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-2 bg-docs-accent rounded-full mb-4">
                <Database className="w-6 h-6 text-docs-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                Generic Object Updater
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                A powerful, TypeScript-first library for declarative object updates with configurable rules
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight size={16} />
                </Button>
                <Button size="lg" variant="outline">
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Update Rules</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powerful and configurable ways to handle object updates with declarative rules
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ruleExplanations.map((rule) => (
                <RuleExplanationCard
                  key={String(rule.action)}
                  action={rule.action}
                  title={rule.title}
                  description={rule.description}
                  example={rule.example}
                />
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-b from-transparent to-muted/30">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Interactive Playground
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Try different update rules and see the results in real-time with visual feedback
              </p>
            </div>
            
            <Playground
              initialObject={initialPlaygroundObject}
              initialUpdate={initialPlaygroundUpdate}
              initialRules={initialPlaygroundRules}
            />
          </div>
        </section>
        
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Common Use Cases
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See how Generic Object Updater can be used in real-world scenarios
              </p>
            </div>
            
            <DemoShowcase useCases={useCases} />
          </div>
        </section>
        
        <section className="py-16 bg-gradient-to-b from-transparent to-muted/30">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                TypeScript-Powered
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Enjoy full type safety and IntelliSense support throughout your codebase
              </p>
            </div>
            
            <TypesSection />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
