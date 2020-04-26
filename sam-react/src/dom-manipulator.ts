/** The module that does all the crazy DOM manipulation and reconcilation. */

import { ReactElement, Component } from './types';

const updateDivWithoutChildren = (
  props: { readonly className?: string },
  component?: Component
): HTMLDivElement => {
  let div: HTMLDivElement;
  // We nuke the old DOM if the DOM type doesn't match between rerenders.
  // React also does this: https://reactjs.org/docs/reconciliation.html#tradeoffs
  if (component !== undefined && component.realDOMNode instanceof HTMLDivElement) {
    div = component.realDOMNode;
  } else {
    div = document.createElement('div');
  }
  if (component === undefined || component.currentElement.props.className !== props.className) {
    div.className = props.className ?? '';
  }
  return div;
};

const updateSpanWithoutChildren = (
  props: { readonly children?: string },
  component?: Component
): HTMLSpanElement => {
  // Not so different from the div case
  let span: HTMLSpanElement;
  if (component !== undefined && component.realDOMNode instanceof HTMLSpanElement) {
    span = component.realDOMNode;
  } else {
    span = document.createElement('span');
  }
  if (component === undefined || component.currentElement.props.children !== props.children) {
    span.innerText = props.children ?? '';
  }
  return span;
};

const updateAnchorWithoutChildren = (
  props: { readonly href?: string; readonly children?: string },
  component?: Component
): HTMLAnchorElement => {
  // Not so different from the div case
  let a: HTMLAnchorElement;
  if (component !== undefined && component.realDOMNode instanceof HTMLAnchorElement) {
    a = component.realDOMNode;
  } else {
    a = document.createElement('a');
  }
  if (component === undefined || component.currentElement.props.href !== props.href) {
    a.href = props.href ?? '';
  }
  if (component === undefined || component.currentElement.props.children !== props.children) {
    a.innerText = props.children ?? '';
  }
  return a;
};

const updateInputWithoutChildren = (
  props: { readonly value?: string; readonly onChange?: (event: Event) => void },
  component?: Component
): HTMLInputElement => {
  let input: HTMLInputElement;
  if (component !== undefined && component.realDOMNode instanceof HTMLInputElement) {
    input = component.realDOMNode;
  } else {
    input = document.createElement('input');
  }
  if (component === undefined || component.currentElement.props.value !== props.value) {
    input.value = props.value ?? '';
  }
  // Here is the `input` specific part.
  // We cannot set event listeners directly. We have to add or remove them.
  // This is why supporting all available DOM props is a little hard.
  if (component !== undefined && component.currentElement.props.onChange !== undefined) {
    input.removeEventListener('input', component.currentElement.props.onChange);
  }
  if (props.onChange !== undefined) {
    input.addEventListener('input', props.onChange);
  }
  return input;
};

const updateDOMWithoutChildren = (
  virtualDOM: ReactElement,
  oldComponent?: Component
): HTMLElement => {
  let element: HTMLElement;
  if (virtualDOM.component === 'div') {
    element = updateDivWithoutChildren(virtualDOM.props, oldComponent);
  } else if (virtualDOM.component === 'span') {
    element = updateSpanWithoutChildren(virtualDOM.props, oldComponent);
  } else if (virtualDOM.component === 'a') {
    element = updateAnchorWithoutChildren(virtualDOM.props, oldComponent);
  } else if (virtualDOM.component === 'input') {
    element = updateInputWithoutChildren(virtualDOM.props, oldComponent);
  } else {
    throw new Error();
  }
  return element;
};

export default updateDOMWithoutChildren;
