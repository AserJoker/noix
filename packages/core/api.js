const package = require('./dist/noix.core.lib');
const functions = package.GetClasses('API');
const values = package.GET_API_VALUES();
const fs = require('fs');
const path = require('path');
const formatValue = (value) => {
  if (typeof value === 'string') return `'${value}'`;
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return `[${value.map((v) => formatValue(v)).join(',')}]`;
    }
    return `{${Object.keys(value)
      .map((name) => `${name}:${formatValue(value[name])}`)
      .join('\n')}}`;
  }
  return String(value);
};
fs.writeFileSync(
  path.resolve(__dirname, './dist/noix.core.api.js'),
  `let _$ = window.QueryInterface;
  export const initAPI = (QueryInterface)=>_$=QueryInterface;
${functions
  .map((fun) => {
    const apiName = package.GetMetadata(fun, undefined, 'API').split('.');
    return `export const ${apiName[apiName.length - 1]}=_$('${apiName.join(
      '.'
    )}');`;
  })
  .join('\n')}
${Object.keys(values)
  .map((name) => `export const ${name} = ${formatValue(values[name])}`)
  .join('\n')}
`
);
