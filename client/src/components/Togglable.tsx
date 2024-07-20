import { useState, forwardRef, useImperativeHandle, Ref } from 'react';

interface TogglableProps {
  buttonLabel: string,
  children?: React.ReactNode
}

export interface TogglableRef {
  toggleVisibility: () => void;
}

export const Togglable = forwardRef((props: TogglableProps, refs: Ref<TogglableRef>) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return { toggleVisibility };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});

Togglable.displayName = "Togglable";
