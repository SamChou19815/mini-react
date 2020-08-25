# mini-react

![CI Badge](https://github.com/SamChou19815/mini-react/workflows/CI/badge.svg)

Sam's Implementation of a simplified React for educational purpose. See the
[slides](https://developersam.com/build-simplified-react.pdf) I used for Cornell DTI's DevSesh.

## Scope

The project aims to implement a very primitive version of React for web. It should be simple enough
so that I could teach it to an average developer in a software project team in less than two hours.

## Getting Started

### I just want to play with it

1. Install [Yarn](https://classic.yarnpkg.com/lang/en/).
2. Clone the repo.
3. Run `yarn` in repo roots. It will install all dependencies and compile everything.
4. Run `yarn workspace demo start`

### I want to test my changes in `sam-react`

1. Install [Yarn](https://classic.yarnpkg.com/lang/en/).
2. Clone the repo.
3. Run `yarn` in repo roots.
4. Run `yarn workspace sam-react dev`. It will watch changes in `sam-react` and auto re-compile.
5. In another terminal, run `yarn workspace demo start`. Changes in `sam-react` will auto refresh
   your page.

## Supported React Features

- Native elements: only `<div />`, `<span />`, `<a />` and `<input />`
  - The only prop allowed for `div` is `className`.
  - The only prop allowed for `span` is `children`, which must be a string.
  - The only prop allowed for `a` is `href` and `children`, and `children` must be a string.
  - The only props allowed for `input` is `value` and `onChange`
- Plain text is automatically wrapped in `span`.
- No support for variable number of children in JSX.
- `useState` hook
  - Initializer must be a value instead of a function.
  - Returned `setState` only accepts new values instead of an update function.
- `useEffect` hook
  - No support for dependency array.
  - No support for unmount/update cleanup callback.

## Other Limitations

In addition to the features that are not supported, the project has these limitations:

- Reconcilator is not very efficient when dealing with children changes.
- The rerender schedular is naive.
- Conditional rendering and other techniques become more awkward to write.
- Zero support for a11y.
- It is not compatible with all the currently available React libraries.

## Disclaimer

If you use this project in your company's production environment, you should probably
[promote yourself to customer](https://i.redd.it/qqlqmc8evvt31.jpg).

My `mini-react` does not support all React features. For supported feature listed above, there is no
guarantee that it works as it claims, since the code has not been thoroughly tested. (The only
guarantee is that the demo site somehow works.)
