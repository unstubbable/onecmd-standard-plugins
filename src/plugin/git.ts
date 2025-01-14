import type {Plugin} from 'onecmd';
import {isStringArray} from '../predicate/is-string-array';
import {serializeLines} from '../serializer/serialize-lines';

export const git = (): Plugin => ({
  setup: () => [
    {
      type: 'new',
      path: '.gitignore',
      attrs: {versioned: true, visible: true},
      is: isStringArray,

      create: (otherFiles) => [
        '# This file is generated by @onecmd/standard-plugins.',
        ...Object.entries(otherFiles)
          .filter(([, {versioned}]) => !versioned)
          .map(([path]) => path),
      ],

      serialize: serializeLines,
    },
  ],
});
