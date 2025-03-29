
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlayIcon, RefreshCw } from 'lucide-react';
import { updateObject, UpdateRule } from '@/lib/objectUpdater';
import JsonDiff from './JsonDiff';
import { Bar, Pie } from 'recharts';
import { 
  BarChart,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PlaygroundProps {
  initialObject: Record<string, any>;
  initialRules: UpdateRule[];
  title?: string;
  description?: string;
}

const COLORS = ['#8B5CF6', '#06B6D4', '#FCD34D', '#F87171', '#10B981', '#A78BFA'];

const Playground: React.FC<PlaygroundProps> = ({
  initialObject,
  initialRules,
  title = 'Interactive Playground',
  description = 'Try different update rules and see the results in real-time'
}) => {
  const [originalObject, setOriginalObject] = useState(initialObject);
  const [rules, setRules] = useState(initialRules);
  const [resultObject, setResultObject] = useState({});
  const [rulesText, setRulesText] = useState('');
  const [objectText, setObjectText] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Format the initial data
  useEffect(() => {
    setObjectText(JSON.stringify(originalObject, null, 2));
    setRulesText(JSON.stringify(initialRules, null, 2));
  }, [initialObject, initialRules]);

  // Apply the rules on input change
  useEffect(() => {
    try {
      const parsedObject = JSON.parse(objectText);
      const parsedRules = JSON.parse(rulesText);
      setOriginalObject(parsedObject);
      setRules(parsedRules);
      
      const result = updateObject(parsedObject, parsedRules);
      setResultObject(result);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [objectText, rulesText]);

  // Reset to initial values
  const handleReset = () => {
    setObjectText(JSON.stringify(initialObject, null, 2));
    setRulesText(JSON.stringify(initialRules, null, 2));
  };

  // Apply rules button
  const handleApply = () => {
    try {
      const parsedObject = JSON.parse(objectText);
      const parsedRules = JSON.parse(rulesText);
      
      const result = updateObject(parsedObject, parsedRules);
      setResultObject(result);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Generate chart data based on objects
  const getBarChartData = () => {
    if (typeof originalObject !== 'object' || !originalObject) return [];
    
    const before = Object.entries(originalObject).map(([key, value]) => {
      return {
        name: key,
        before: typeof value === 'number' ? value : 
               (typeof value === 'object' && value !== null ? 
                 Object.keys(value).length : 
                 value ? 1 : 0)
      };
    });
    
    const after = Object.entries(resultObject).map(([key, value]) => {
      return {
        name: key,
        after: typeof value === 'number' ? value : 
              (typeof value === 'object' && value !== null ? 
                Object.keys(value).length : 
                value ? 1 : 0)
      };
    });
    
    // Merge before and after data
    const combined: any[] = [];
    
    [...before, ...after].forEach(item => {
      const existingItem = combined.find(i => i.name === item.name);
      if (existingItem) {
        combined[combined.indexOf(existingItem)] = {...existingItem, ...item};
      } else {
        combined.push(item);
      }
    });
    
    return combined;
  };

  const getPieChartData = () => {
    const beforeKeys = Object.keys(originalObject).length;
    const afterKeys = Object.keys(resultObject).length;
    
    return [
      { name: 'Before', value: beforeKeys },
      { name: 'After', value: afterKeys }
    ];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Source Object</h3>
            <textarea
              className="w-full h-60 code-block p-3 font-mono text-xs"
              value={objectText}
              onChange={(e) => setObjectText(e.target.value)}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Update Rules</h3>
            <textarea
              className="w-full h-60 code-block p-3 font-mono text-xs"
              value={rulesText}
              onChange={(e) => setRulesText(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            onClick={handleApply}
            className="flex items-center gap-2"
          >
            <PlayIcon size={16} />
            Apply Rules
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Reset
          </Button>
        </div>
        
        <JsonDiff before={originalObject} after={resultObject} />
        
        <div className="mt-6">
          <Tabs defaultValue="bar">
            <TabsList className="mb-4">
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="pie">Pie Chart</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bar">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getBarChartData()}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="before" fill="#8B5CF6" name="Before" />
                    <Bar dataKey="after" fill="#06B6D4" name="After" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="pie">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getPieChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getPieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default Playground;
