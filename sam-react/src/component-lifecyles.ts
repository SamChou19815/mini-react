/** The module that provides the mount and update component lifecycle. */

import { StatefulComponent, StatelessComponent, Component, ReactElement } from './types';
import updateDOMWithoutChildren from './dom-manipulator';
import { renderWithRuntime } from './renderer-runtime';

export const instantiateComponent = (reactElement: ReactElement): Component => {
  // Contrary to your belief, each intrinsic elements are components.
  // They have to be wrapped in a component for the uniformity between virtual DOM tree.
  if (
    reactElement.component === 'div' ||
    reactElement.component === 'span' ||
    reactElement.component === 'input'
  ) {
    return {
      type: 'intrinsic',
      component: reactElement.component,
      currentElement: reactElement,
      realDOMNode: null!,
      children: [],
    };
  }
  return {
    type: 'functional',
    component: reactElement.component,
    currentElement: reactElement,
    renderedComponent: null!,
    realDOMNode: null!,
    states: [],
    currentStateIndex: 0,
  };
};

const mountChildren = (children: readonly ReactElement[], parentDOM: HTMLElement): Component[] =>
  children.map((childElement) => {
    const childComponent = instantiateComponent(childElement);
    const realChildDOMNode = mountComponent(childComponent);
    parentDOM.appendChild(realChildDOMNode);
    return childComponent;
  });

export const mountComponent = (component: Component): HTMLElement => {
  if (component.type === 'intrinsic') {
    const realDOMNode = updateDOMWithoutChildren(component.currentElement);
    // Don't forget to mount children of div!
    component.children = mountChildren(component.currentElement.children, realDOMNode);
    component.realDOMNode = realDOMNode;
    return realDOMNode;
  }
  const currentElement = renderWithRuntime(component);
  const renderedComponent = instantiateComponent(currentElement);
  component.renderedComponent = renderedComponent;
  const realDOMNode = mountComponent(renderedComponent);
  component.realDOMNode = realDOMNode;
  return realDOMNode;
};

const updateStatefulComponent = (
  component: StatefulComponent,
  nextElement: ReactElement
): Component | null => {
  component.currentElement = nextElement;
  const previousRenderedElement = component.renderedComponent.currentElement;
  const nextRenderedElement = renderWithRuntime(component);
  if (previousRenderedElement.component !== nextRenderedElement.component) {
    // Component type doesn't match. Nuke everything!
    const newComponent = instantiateComponent(nextElement);
    const newDOMNode = mountComponent(newComponent);
    component.renderedComponent = newComponent;
    component.realDOMNode.replaceWith(newDOMNode);
    component.realDOMNode = newDOMNode;
    return null;
  }
  const updatedNewComponent = updateComponent(component.renderedComponent, nextRenderedElement);
  if (updatedNewComponent !== null) {
    component.renderedComponent = updatedNewComponent;
    component.realDOMNode = updatedNewComponent.realDOMNode;
  }
  return null;
};

const updateStatelessComponent = (
  component: StatelessComponent,
  nextElement: ReactElement
): Component | null => {
  if (component.currentElement.component !== nextElement.component) {
    // Component type doesn't match. Nuke everything!
    const newComponent = instantiateComponent(nextElement);
    const newDOMNode = mountComponent(newComponent);
    component.realDOMNode.replaceWith(newDOMNode);
    newComponent.realDOMNode = newDOMNode;
    return newComponent;
  }
  // Guaranteed won't change tag!
  const element = updateDOMWithoutChildren(nextElement, component);
  if (component.children.length !== nextElement.children.length) {
    // Using a naive implementation here: => Nuke everything if children lengths differ.
    element.childNodes.forEach((childNode) => element.removeChild(childNode));
    component.children = mountChildren(nextElement.children, element);
  } else {
    // Now we can safely match old and new children one by one.
    const length = nextElement.children.length;
    for (let i = 0; i < length; i += 1) {
      const oldChildComponent = component.children[i];
      const newChildElement = nextElement.children[i];
      const updatedNewChildComponent = updateComponent(oldChildComponent, newChildElement);
      if (updatedNewChildComponent !== null) {
        component.children[i] = updatedNewChildComponent;
      }
    }
  }
  component.currentElement = nextElement;
  return null;
};

export const updateComponent = (
  component: Component,
  nextElement: ReactElement
): Component | null =>
  component.type === 'intrinsic'
    ? updateStatelessComponent(component, nextElement)
    : updateStatefulComponent(component, nextElement);
