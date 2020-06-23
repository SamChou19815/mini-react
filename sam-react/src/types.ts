/*
 * You can see a lot of use of `any` in the codebase.
 * Usually you want to avoid that.
 * However, react runtime is too dynamic so that avoiding all uses of any is impossible.
 */

export type ComponentType<Props extends {} = any> = (props: Props) => ReactElement<any>;

export type ReactElement<Props extends {} = any> = {
  readonly component: ComponentType<Props> | 'div' | 'input' | 'a' | 'span' | 'img';
  readonly props: Props;
  readonly children: readonly ReactElement[];
};

export type UseStateReturns = [any, (value: any) => void];

export type StatefulComponent = {
  // The field for Component pattern matching
  readonly type: 'functional';
  // The render function
  readonly component: ComponentType;
  // The currently render shallow element. It's the react element that creates this component.
  currentElement: ReactElement;
  // The component that is rendered as a result of calling `component` function and instantiation.
  // This field will be late initialized.
  renderedComponent: Component;
  // The rendered node attached to the virtual DOM hierarchy.
  // It will be late initialized during mounting phase.
  realDOMNode: HTMLElement;
  // States
  readonly states: UseStateReturns[];
  currentStateIndex: number;
};
export type StatelessComponent = {
  // The field for Component pattern matching
  readonly type: 'intrinsic';
  // The tag
  component: 'div' | 'span' | 'a' | 'input' | 'img';
  // The currently render shallow element. It's the react element that creates this component.
  currentElement: ReactElement;
  // A list of children components.
  // Stateful components don't have them because children in stateful components
  // are just syntactic sugar of another prop.
  children: Component[];
  // The rendered node attached to the virtual DOM hierarchy.
  // It will be late initialized during mounting phase.
  realDOMNode: HTMLElement;
};
export type Component = StatefulComponent | StatelessComponent;
