/**
 * Generic Object Updater with Rules
 * A library for updating plain JavaScript objects using declarative rules
 */

export type UpdateAction = 
  | 'REPLACE'  // Replace the value entirely
  | 'IGNORE'   // Keep the original value
  | 'DELETE'   // Remove the property
  | 'MERGE'    // Deep merge objects
  | 'UNION'    // Union arrays 
  | 'UPSERT_BY_KEY'; // Update or insert array items by key

export interface UpdateRule<T = any> {
  action: UpdateAction;
  path?: string | string[]; // dot notation path or path array
  value?: T;
  keyProperty?: string; // For UPSERT_BY_KEY action
}

// Helper to get value at path
function getValueAtPath(obj: any, path: string[]): any {
  return path.reduce((current, key) => {
    return current !== undefined && current !== null ? current[key] : undefined;
  }, obj);
}

// Helper to set value at path
function setValueAtPath(obj: any, path: string[], value: any): any {
  if (path.length === 0) return value;
  
  const result = { ...obj };
  let current = result;
  
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (current[key] === undefined || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }
  
  const lastKey = path[path.length - 1];
  current[lastKey] = value;
  
  return result;
}

// Helper to delete value at path
function deleteValueAtPath(obj: any, path: string[]): any {
  if (path.length === 0) return undefined;
  
  const result = { ...obj };
  let current = result;
  
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (current[key] === undefined || current[key] === null) {
      return result; // Path doesn't exist, nothing to delete
    }
    current = current[key];
  }
  
  const lastKey = path[path.length - 1];
  if (current[lastKey] !== undefined) {
    delete current[lastKey];
  }
  
  return result;
}

// Helper to deep merge objects
function deepMerge(target: any, source: any): any {
  if (!source) return target;
  if (!target) return source;
  
  const result = { ...target };
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
          target[key] !== null && typeof target[key] === 'object' && !Array.isArray(target[key])) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

// Main update function
export function updateObject<T extends Record<string, any>>(
  original: T, 
  rules: UpdateRule[]
): T {
  let result = { ...original };
  
  for (const rule of rules) {
    const pathArray = rule.path 
      ? (typeof rule.path === 'string' ? rule.path.split('.') : rule.path)
      : [];
    
    switch (rule.action) {
      case 'REPLACE':
        result = setValueAtPath(result, pathArray, rule.value);
        break;
        
      case 'IGNORE':
        // Do nothing, keep original value
        break;
        
      case 'DELETE':
        result = deleteValueAtPath(result, pathArray);
        break;
        
      case 'MERGE':
        const currentValue = getValueAtPath(result, pathArray);
        const mergedValue = deepMerge(currentValue, rule.value);
        result = setValueAtPath(result, pathArray, mergedValue);
        break;
        
      case 'UNION':
        const currentArray = getValueAtPath(result, pathArray) || [];
        const newArray = rule.value || [];
        
        if (Array.isArray(currentArray) && Array.isArray(newArray)) {
          // Create union of arrays without duplicates
          const unionArray = [...currentArray];
          
          for (const item of newArray) {
            if (!unionArray.some(existingItem => 
              JSON.stringify(existingItem) === JSON.stringify(item)
            )) {
              unionArray.push(item);
            }
          }
          
          result = setValueAtPath(result, pathArray, unionArray);
        }
        break;
        
      case 'UPSERT_BY_KEY':
        const currentItems = getValueAtPath(result, pathArray) || [];
        const newItems = rule.value || [];
        const keyProp = rule.keyProperty || 'id';
        
        if (Array.isArray(currentItems) && Array.isArray(newItems) && keyProp) {
          const updatedItems = [...currentItems];
          
          for (const newItem of newItems) {
            const keyValue = newItem[keyProp];
            const existingIndex = updatedItems.findIndex(item => item[keyProp] === keyValue);
            
            if (existingIndex >= 0) {
              // Update existing item
              updatedItems[existingIndex] = { ...updatedItems[existingIndex], ...newItem };
            } else {
              // Insert new item
              updatedItems.push(newItem);
            }
          }
          
          result = setValueAtPath(result, pathArray, updatedItems);
        }
        break;
    }
  }
  
  return result as T;
}
