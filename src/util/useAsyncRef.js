import React, { useRef, useState } from 'react';

// Got this from https://css-tricks.com/dealing-with-stale-props-and-states-in-reacts-functional-components/
// This creates a ref but returns an accessor and setter just like state
// This is used when you have asynchronous callbacks and need to access the current value of a piece of state
// WARNING when you access the value, you must use .current since it's a ref underneath
const useAsyncReference = (value, isProp = false) => {
  const ref = useRef(value);
  const [, forceRender] = useState(false);

  function updateState(newState) {
    if (!Object.is(ref.current, newState)) {
      ref.current = newState;
      forceRender(s => !s);
    }
  }

  if (isProp) {
    ref.current = value;
    return ref;
  }

  return [ref, updateState];
}

export default useAsyncReference;
