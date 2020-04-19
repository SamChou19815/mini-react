/** The module that does all the crazy DOM manipulation and reconcilation. */

import { VirtualDOMNode, VirtualAndRealDOM } from './types';

const updateDivWithoutChildren = (
  props: { readonly className?: string },
  oldVirtualAndRealDOM?: VirtualAndRealDOM
): HTMLDivElement => {
  let div: HTMLDivElement;
  // We nuke the old DOM if the DOM type doesn't match between rerenders.
  // React also does this: https://reactjs.org/docs/reconciliation.html#tradeoffs
  if (oldVirtualAndRealDOM !== undefined && oldVirtualAndRealDOM.real instanceof HTMLDivElement) {
    div = oldVirtualAndRealDOM.real;
  } else {
    div = document.createElement('div');
  }
  if (
    oldVirtualAndRealDOM === undefined ||
    oldVirtualAndRealDOM.virtual.props.className !== props.className
  ) {
    div.className = props.className ?? '';
  }
  return div;
};

const updateSpanWithoutChildren = (
  props: { readonly children?: string },
  oldVirtualAndRealDOM?: VirtualAndRealDOM
): HTMLSpanElement => {
  // Not so different from the div case
  let span: HTMLSpanElement;
  if (oldVirtualAndRealDOM !== undefined && oldVirtualAndRealDOM.real instanceof HTMLSpanElement) {
    span = oldVirtualAndRealDOM.real;
  } else {
    span = document.createElement('span');
  }
  if (
    oldVirtualAndRealDOM === undefined ||
    oldVirtualAndRealDOM.virtual.props.children !== props.children
  ) {
    span.innerText = props.children ?? '';
  }
  return span;
};

const updateInputWithoutChildren = (
  props: { readonly value?: string; readonly onChange?: (event: Event) => void },
  oldVirtualAndRealDOM?: VirtualAndRealDOM
): HTMLInputElement => {
  let input: HTMLInputElement;
  if (oldVirtualAndRealDOM !== undefined && oldVirtualAndRealDOM.real instanceof HTMLInputElement) {
    input = oldVirtualAndRealDOM.real;
  } else {
    input = document.createElement('input');
  }
  if (
    oldVirtualAndRealDOM === undefined ||
    oldVirtualAndRealDOM.virtual.props.value !== props.value
  ) {
    input.value = props.value ?? '';
  }
  // Here is the `input` specific part.
  // We cannot set event listeners directly. We have to add or remove them.
  // This is why supporting all available DOM props is a little hard.
  if (
    oldVirtualAndRealDOM !== undefined &&
    oldVirtualAndRealDOM.virtual.props.onChange !== undefined
  ) {
    input.removeEventListener('input', oldVirtualAndRealDOM.virtual.props.onChange);
  }
  if (props.onChange !== undefined) {
    input.addEventListener('input', props.onChange);
  }
  return input;
};

const updateDOM = (
  virtualDOM: VirtualDOMNode,
  oldVirtualAndRealDOM?: VirtualAndRealDOM
): HTMLElement => {
  let element: HTMLElement;
  if (virtualDOM.component === 'div') {
    element = updateDivWithoutChildren(virtualDOM.props, oldVirtualAndRealDOM);
  } else if (virtualDOM.component === 'span') {
    element = updateSpanWithoutChildren(virtualDOM.props, oldVirtualAndRealDOM);
  } else if (virtualDOM.component === 'input') {
    element = updateInputWithoutChildren(virtualDOM.props, oldVirtualAndRealDOM);
  } else {
    throw new Error();
  }
  if (oldVirtualAndRealDOM === undefined || oldVirtualAndRealDOM.real !== element) {
    // Old dom element doesn't exist or is completely destroyed. All old children are lost.
    virtualDOM.children.forEach((child) => element.appendChild(updateDOM(child)));
    return element;
  }
  // Old chilren can be mostly preserved.
  const oldVirtualChildren = oldVirtualAndRealDOM.virtual.children;
  const oldDOMChildren = oldVirtualAndRealDOM.real.children;
  if (oldVirtualChildren.length !== oldDOMChildren.length) {
    throw new Error();
  }
  const newVirtualChildren = virtualDOM.children;
  // We try to reconcile children one by one.
  newVirtualChildren.forEach((newVirtualChild, index) => {
    const oldVirtualChild = oldVirtualChildren[index];
    if (oldVirtualChild == null) {
      // This happens when we have more new children than old children.
      element.appendChild(updateDOM(newVirtualChild));
    } else {
      const oldChildrenDOM = element.children.item(index) as HTMLElement;
      if (oldChildrenDOM == null) {
        throw new Error();
      }
      const newChildrenDOM = updateDOM(newVirtualChild, {
        virtual: oldVirtualChild,
        real: oldChildrenDOM,
      });
      // If an update cannot happen in-place, we need to nuke the old child.
      if (newChildrenDOM !== oldChildrenDOM) {
        element.replaceChild(newChildrenDOM, oldChildrenDOM);
      }
    }
  });
  // We need to remove children that is no longer there.
  if (oldVirtualChildren.length > newVirtualChildren.length) {
    for (let i = newVirtualChildren.length; i < oldVirtualChildren.length; i += 1) {
      element.removeChild(oldDOMChildren[i]);
    }
  }
  return element;
};

export default updateDOM;
