import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RuleExplanationCard from '@/components/RuleExplanationCard';
import Playground from '@/components/Playground';
import DemoShowcase from '@/components/DemoShowcase';
import TypesSection from '@/components/TypesSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database } from 'lucide-react';
import { UpdateAction, UpdateRule } from '@/lib/objectUpdater';

interface UseCase {
  title: string;
  description: string;
  action: UpdateAction;
  sourceObject: Record<string, any>;
  rules: UpdateRule[];
}

const ruleExplanations = [
  {
    action: 'REPLACE' as UpdateAction,
    title: 'Replace',
    description: 'Completely replaces the value at the specified path with a new value.',
    example: `{
  action: 'REPLACE',
  path: 'theme.colors.primary',
  value: '#8B5CF6'
}`
  },
  {
    action: 'IGNORE' as UpdateAction,
    title: 'Ignore',
    description: 'Keeps the original value, ignoring any updates to this property.',
    example: `{
  action: 'IGNORE',
  path: 'config.readOnly'
}`
  },
  {
    action: 'DELETE' as UpdateAction,
    title: 'Delete',
    description: 'Completely removes the property at the specified path.',
    example: `{
  action: 'DELETE',
  path: 'user.temporaryData'
}`
  },
  {
    action: 'MERGE' as UpdateAction,
    title: 'Merge',
    description: 'Deep merges objects, combining properties from both original and update.',
    example: `{
  action: 'MERGE',
  path: 'settings',
  value: { darkMode: true }
}`
  },
  {
    action: 'UNION' as UpdateAction,
    title: 'Union',
    description: 'Creates a union of arrays, ensuring no duplicate values are added.',
    example: `{
  action: 'UNION',
  path: 'permissions',
  value: ['read', 'write']
}`
  },
  {
    action: 'UPSERT_BY_KEY' as UpdateAction,
    title: 'Upsert By Key',
    description: 'Updates existing items or inserts new ones in an array based on a key property.',
    example: `{
  action: 'UPSERT_BY_KEY',
  path: 'users',
  value: [{ id: 123, name: 'Alex' }],
  keyProperty: 'id'
}`
  }
];

const initialPlaygroundObject = {
  config: {
    theme: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#10B981'
      },
      fonts: {
        heading: 'Inter',
        body: 'Roboto'
      }
    },
    features: [
      { id: 'dashboard', enabled: true },
      { id: 'reports', enabled: false },
      { id: 'analytics', enabled: true }
    ]
  },
  user: {
    id: 1,
    name: 'John Doe',
    preferences: {
      notifications: true,
      darkMode: false
    }
  }
};

const initialPlaygroundRules: UpdateRule[] = [
  {
    action: 'REPLACE',
    path: 'config.theme.colors.primary',
    value: '#FCD34D'
  },
  {
    action: 'MERGE',
    path: 'user.preferences',
    value: {
      darkMode: true,
      compactView: true
    }
  },
  {
    action: 'UPSERT_BY_KEY',
    path: 'config.features',
    value: [
      { id: 'reports', enabled: true },
      { id: 'chat', enabled: true }
    ],
    keyProperty: 'id'
  }
];

const useCases: UseCase[] = [
  {
    title: 'Config Management',
    description: 'Merging user configuration with default settings',
    action: 'MERGE' as UpdateAction,
    sourceObject: {
      theme: 'light',
      fontSize: 16,
      notifications: false
    },
    rules: [
      {
        action: 'MERGE',
        path: '',
        value: {
          theme: 'dark',
          animations: true
        }
      }
    ]
  },
  {
    title: 'Data Transformation',
    description: 'Transforming API data to fit application needs',
    action: 'REPLACE' as UpdateAction,
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
    rules: [
      {
        action: 'REPLACE',
        path: 'user',
        value: {
          name: 'John Doe',
          location: 'New York'
        }
      },
      {
        action: 'UPSERT_BY_KEY',
        path: 'orders',
        value: [
          { id: 2, status: 'delivered' },
          { id: 3, status: 'processing' }
        ],
        keyProperty: 'id'
      }
    ]
  },
  {
    title: 'State Management',
    description: 'Handling complex state updates in frontend applications',
    action: 'UPSERT_BY_KEY' as UpdateAction,
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
    rules: [
      {
        action: 'UPSERT_BY_KEY',
        path: 'todos',
        value: [
          { id: 1, completed: true },
          { id: 3, text: 'Write tests', completed: false }
        ],
        keyProperty: 'id'
      },
      {
        action: 'REPLACE',
        path: 'stats',
        value: {
          completed: 1,
          total: 3
        }
      }
    ]
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-docs-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero section */}
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
        
        {/* Rules explanation section */}
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
                  key={rule.action}
                  action={rule.action}
                  title={rule.title}
                  description={rule.description}
                  example={rule.example}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Interactive playground section */}
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
              initialRules={initialPlaygroundRules}
            />
          </div>
        </section>
        
        {/* Use cases section */}
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
        
        {/* TypeScript section */}
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
