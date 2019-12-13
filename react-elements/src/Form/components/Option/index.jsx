import React from 'react';

const Option = ({ value, children, ...rest }) => {
  return (
    <option value={value} key={value} {...rest}>
      {children}
    </option>
  );
};

export default Option;