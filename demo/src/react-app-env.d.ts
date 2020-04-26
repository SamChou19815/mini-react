/// <reference types="react-scripts" />

import { ReactElement } from 'sam-react/lib/types';

/*
 * Thanks to TypeScript support for JSX parsing and type checking, we are able to write JSX
 * directly in the source code.
 *
 * However, it's worth noting that TypeScript doesn't have built-in support for React's JSX.
 * Instead, it supports the open JSX standard, and any library can define its specific
 * elements of JSX. (This is what allows you to write JSX in TypeScript in Vue!)
 *
 * The following code declares our specific JSX features that we support.
 * React declares similar stuff here:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts
 */

declare global {
  namespace JSX {
    interface Element extends ReactElement {}
    interface IntrinsicElements {
      div: { readonly className?: string };
      span: { readonly children?: string };
      a: { readonly href?: string; readonly children?: string };
      input: { readonly value?: string; readonly onChange?: (event: Event) => void };
    }
  }
}
