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
      <div className="header">
        <div className="header-container">
          <span>Developer Sam</span>
        </div>
      </div>
      <div className="hidden-below-header" />
      <MyTime />
      <div className="center">
        <HiDiv name={name} />
        <MyInput name={name} onChange={setName} />
      </div>
      <div className="note">
        <div className="note-header">
          <span>Developer Note</span>
        </div>
        <div>
          <span>This is just a random site. The design is ugly.</span>
        </div>
        <div>
          <span>The inputbox can auto sync with the text on the left. </span>
          <span>However, it appears like the website is built with React, </span>
          <span>so there is really nothing to brag about.</span>
        </div>
        <div>
          <span>The only noteworthy thing is: </span>
          <span>the React is </span>
          <a href="https://github.com/SamChou19815/mini-react">Sam's React</a>
          <span> (although a simplied one).</span>
        </div>
        <div>
          <span>Feel free to open developer console to read the code.</span>
          <span>The source maps will help you.</span>
        </div>
      </div>
      <div className="note">
        <div className="note-header">
          <span>Links</span>
        </div>
        <div>
          <a href="https://developersam.com">Developer Sam</a>
        </div>
        <div>
          <a href="https://github.com/SamChou19815">Sam's GitHub</a>
        </div>
        <div>
          <a href="https://github.com/SamChou19815/mini-react">This project's GitHub</a>
        </div>
      </div>
      <div className="footer">
        <span>{`Copyright © ${new Date().getFullYear()} Developer Sam`}</span>
      </div>
    </div>
  );
};

React.mountToDOM(<App />, document.getElementById('root')!);
