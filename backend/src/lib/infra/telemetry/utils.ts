export const isAsyncFunction = (fn: any) => {
  // util.types.isAsyncFunction(fn); // Node 10+
  // Note that the above only reports back what the JavaScript engine is seeing; in particular, the return value may not match the original source code if a transpilation tool was used.
  return fn && fn.constructor && fn.constructor.name === 'AsyncFunction';
};
