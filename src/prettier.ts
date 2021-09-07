import {dirname, resolve} from 'path';
import deepmerge from 'deepmerge';
import type {Plugin} from 'onecmd';
import {serializeJson} from './util/serialize-json';
import {serializeText} from './util/serialize-text';

export const prettier = (): Plugin => ({
  commands: [
    {
      type: 'fmt',
      path: resolve(dirname(require.resolve('prettier')), 'bin-prettier.js'),

      getArgs: ({check}) => [
        check ? '--list-different' : '--write',
        '**/*.{html,js,json,md,ts,tsx,yml}',
      ],
    },
  ],
  sources: [
    {
      type: 'string',
      path: '.prettierignore',
      generate: (otherSources) => Object.keys(otherSources).join('\n'),
      serialize: serializeText,
    },
    {
      type: 'object',
      path: '.prettierrc.json',

      generate: () => ({
        bracketSpacing: false,
        printWidth: 80,
        proseWrap: 'always',
        quoteProps: 'consistent',
        singleQuote: true,
      }),

      serialize: serializeJson,
    },
  ],
  dependencies: [
    {
      type: 'object',
      path: '.vscode/extensions.json',

      generate: (input) =>
        deepmerge(input, {recommendations: ['esbenp.prettier-vscode']}),
    },
    {
      type: 'object',
      path: '.vscode/settings.json',
      generate: (input) => deepmerge(input, {'editor.formatOnSave': true}),
    },
    {
      type: 'object',
      path: '.eslintrc.json',
      generate: (input) => deepmerge(input, {extends: ['prettier']}),
    },
    {
      type: 'string',
      path: '.editorconfig',

      generate: (input) =>
        [
          ...input.split('\n'),
          '[*.{html,js,json,md,ts,tsx,yml}]',
          'insert_final_newline = false',
          'trim_trailing_whitespace = false',
        ].join('\n'),
    },
  ],
});
