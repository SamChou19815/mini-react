import { ComponentType, ReactElement } from './types';
import { useState as unstrictlyTypedUseState, useEffect } from './renderer-runtime';
import mountToDOM from './react-dom';

// Expose a setState that's more nicely typed instead of using any.
// The framework has to use any since it's too dynamic.
const useState = <T>(initialValue: T): readonly [T, (newValue: T) => void] =>
  unstrictlyTypedUseState(initialValue);

/**
 * The adapter for TypeScript and babel to transform JSX.
 * We name it the same way React did, and with the exact signature.
 * In this way, we are able to reuse the existing toolchain!
 */
const createElement = <Props extends {}>(
  component: ComponentType<Props> | 'div' | 'input',
  props: Props,
  ...children: readonly ReactElement[]
): ReactElement<Props> => ({
  component,
  props,
  children,
});

/**
 * This export code might look a little weird, but it's used to support something like:
 *
 * ```typescript
 * import React, { useState } from 'sam-react';
 *
 * useState(...); // useful shorthand
 * React.createElement(...); // useful for babel.
 * ```
 */
const ReactWithoutDefault = { useState, useEffect, createElement, mountToDOM };
export { ReactWithoutDefault as default, useState, useEffect, createElement, mountToDOM };
