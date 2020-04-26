import React, { useState, useEffect } from 'sam-react';
// CSS loading works as usual, since we are able to reuse the CRA toolchain.
import './index.css';

const HiDiv = ({ name }: { readonly name: string }) => (
  <div className="hi">
    <span>Hi</span>
    <div>
      <span>{`Developer ${name}`}</span>
    </div>
  </div>
);

const MyInput = ({
  name,
  onChange,
}: {
  readonly name: string;
  readonly onChange: (name: string) => void;
}) => {
  const onInputChange = (event: Event): void => {
    // A little ugly here. We need a cast because I'm too lazy to implement react's virtual events...
    onChange((event.currentTarget as HTMLInputElement).value);
  };

  return <input value={name} onChange={onInputChange} />;
};

const MyTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setTimeout(() => setTime(new Date()), 200);
  });

  return (
    <div className="center">
      <span>{time.toLocaleTimeString()}</span>
    </div>
  );
};

const App = () => {
  const [name, setName] = useState('Sam');

  useEffect(() => {
    document.title = `Hello, ${name}`;
  });

  if (name.startsWith('Developer')) {
    // This ensures that the root is nuked!
    return <span>'Developer' is already in the template! Why Repeat?!</span>;
  }

  return (
    <div>
      <MyTime />
      <div className="center">
        <HiDiv name={name} />
        <MyInput name={name} onChange={setName} />
      </div>
    </div>
  );
};

React.mountToDOM(<App />, document.getElementById('root')!);
