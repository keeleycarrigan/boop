import React from 'react';

const Option = ({ value, inputRef, children, ...rest }) => {
  return (
    <option ref={inputRef} value={value} key={value} {...rest}>
      {children}
    </option>
  );
};

export default Option;