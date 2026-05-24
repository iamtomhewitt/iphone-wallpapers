export const merge = (obj1: Record<string, any>, obj2: Record<string, any>) => {
  return Object.fromEntries(
    [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])]
      .map(key => [key, (obj1[key] || 0) + (obj2[key] || 0)]),
  );
};