#!/usr/bin/env node
const path = require('path');
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM();
global.window = jsdom.window;
Object.keys(jsdom.window).forEach((name) => {
  if (name !== 'localStorage' && name !== 'sessionStorage') {
    global[name] = jsdom.window[name];
  }
});
global.localStorage = {};
if (process.argv[2]) {
  const packageName = process.argv[2];
  const package = require(path.resolve(
    process.cwd(),
    './dist/' + packageName + '.lib'
  ));
  const functions = package.GetClasses('API');
  const values = package.GET_API_VALUES();
  const fs = require('fs');
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
    path.resolve(process.cwd(), './dist/' + packageName + '.api.js'),
    `let _$ = window?window.QueryInterface:global.QueryInterface;
${functions
  .filter((fun) => {
    const apiName = package.GetMetadata(fun, undefined, 'API');
    return String(apiName).startsWith('api.' + process.argv[3]);
  })
  .map((fun) => {
    const apiName = package.GetMetadata(fun, undefined, 'API').split('.');
    return `export const ${apiName[apiName.length - 1]}=_$('${apiName.join(
      '.'
    )}');`;
  })
  .join('\n')}
${Object.keys(values)
  .filter((name) => name.startsWith(process.argv[3]))
  .map(
    (name) =>
      `export const ${name.split('.')[1]} = ${formatValue(values[name])}`
  )
  .join('\n')}
`
  );
} else {
  console.error('ERROR:undefined package name');
}
