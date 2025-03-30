
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlayIcon, RefreshCw } from 'lucide-react';
import { UpdateAction, Updater } from 'object_updater';
import JsonDiff from './JsonDiff';
import {
  BarChart,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar, 
  Pie
} from 'recharts';

interface PlaygroundProps {
  initialObject: Record<string, any>;
  initialUpdate: Record<string, any>;
  initialRules: Record<string, any>;
  title?: string;
  description?: string;
}

const COLORS = ['#8B5CF6', '#06B6D4', '#FCD34D', '#F87171', '#10B981', '#A78BFA'];

const Playground: React.FC<PlaygroundProps> = ({
  initialObject,
  initialUpdate,
  initialRules,
  title = 'Interactive Playground',
  description = 'Try different update rules and see the results in real-time'
}) => {
  const [originalObject, setOriginalObject] = useState(initialObject);
  const [updateObject, setUpdateObject] = useState(initialUpdate);
  const [rules, setRules] = useState(initialRules);
  const [resultObject, setResultObject] = useState({});
  const [rulesText, setRulesText] = useState('');
  const [objectText, setObjectText] = useState('');
  const [updateText, setUpdateText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const updater = new Updater();
  
  // Format the initial data
  useEffect(() => {
    setObjectText(JSON.stringify(initialObject, null, 2));
    setUpdateText(JSON.stringify(initialUpdate, null, 2));
    setRulesText(JSON.stringify(initialRules, null, 2));
  }, [initialObject, initialUpdate, initialRules]);

  // Apply the rules on input change
  useEffect(() => {
    try {
      const parsedObject = JSON.parse(objectText);
      const parsedUpdate = JSON.parse(updateText);
      const parsedRules = JSON.parse(rulesText);
      
      setOriginalObject(parsedObject);
      setUpdateObject(parsedUpdate);
      setRules(parsedRules);
      
      // Using the object_updater library with Updater class
      const result = updater.updateObject(parsedObject, parsedUpdate, parsedRules);
      setResultObject(result);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [objectText, updateText, rulesText]);

  // Reset to initial values
  const handleReset = () => {
    setObjectText(JSON.stringify(initialObject, null, 2));
    setUpdateText(JSON.stringify(initialUpdate, null, 2));
    setRulesText(JSON.stringify(initialRules, null, 2));
  };

  // Apply rules button
  const handleApply = () => {
    try {
      const parsedObject = JSON.parse(objectText);
      const parsedUpdate = JSON.parse(updateText);
      const parsedRules = JSON.parse(rulesText);
      
      // Using the object_updater library with Updater class
      const result = updater.updateObject(parsedObject, parsedUpdate, parsedRules);
      setResultObject(result);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Generate chart data based on objects
  const getBarChartData = () => {
    if (typeof originalObject !== 'object' || !originalObject) return [];
    
    const chartData = [];
    
    // Handle tags array comparison
    if (Array.isArray(originalObject.tags)) {
      chartData.push({
        name: 'Tags',
        before: originalObject.tags.length,
        after: resultObject.tags ? resultObject.tags.length : 0
      });
    }
    
    // Handle users array comparison
    if (Array.isArray(originalObject.users)) {
      chartData.push({
        name: 'Users',
        before: originalObject.users.length,
        after: resultObject.users ? resultObject.users.length : 0
      });
    }
    
    // Handle salary comparison if it exists
    if ('salary' in originalObject || 'salary' in resultObject) {
      const beforeSalary = originalObject.salary || 0;
      const afterSalary = resultObject.salary || 0;
      
      chartData.push({
        name: 'Salary',
        before: beforeSalary,
        after: afterSalary
      });
    }
    
    // Add any numeric properties from both objects
    const allKeys = new Set([
      ...Object.keys(originalObject), 
      ...Object.keys(resultObject)
    ]);
    
    allKeys.forEach(key => {
      // Skip already added special properties
      if (['tags', 'users', 'salary'].includes(key)) return;
      
      const beforeValue = originalObject[key];
      const afterValue = resultObject[key];
      
      // Add only if either value is a number
      if (typeof beforeValue === 'number' || typeof afterValue === 'number') {
        chartData.push({
          name: key,
          before: typeof beforeValue === 'number' ? beforeValue : 0,
          after: typeof afterValue === 'number' ? afterValue : 0
        });
      }
    });
    
    return chartData;
  };

  const getPieChartData = () => {
    const chartData = [];
    
    // Tags comparison
    if (Array.isArray(originalObject.tags) && Array.isArray(resultObject.tags)) {
      // Count unique tags before and after
      const uniqueTagsBefore = new Set(originalObject.tags).size;
      const uniqueTagsAfter = new Set(resultObject.tags).size;
      
      chartData.push(
        { name: 'Tags (Before)', value: uniqueTagsBefore },
        { name: 'Tags (After)', value: uniqueTagsAfter }
      );
    }
    
    // Users comparison
    if (Array.isArray(originalObject.users) && Array.isArray(resultObject.users)) {
      chartData.push(
        { name: 'Users (Before)', value: originalObject.users.length },
        { name: 'Users (After)', value: resultObject.users.length }
      );
    }
    
    return chartData;
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Original Object</h3>
            <textarea
              className="w-full h-60 code-block p-3 font-mono text-xs"
              value={objectText}
              onChange={(e) => setObjectText(e.target.value)}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Update</h3>
            <textarea
              className="w-full h-60 code-block p-3 font-mono text-xs"
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
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
