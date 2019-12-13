import React from 'react';

import {
  withFormConnection,
} from '../HOC/with';

const BasicSubmit = React.forwardRef((props, ref) => {
  const {
    children,
    ...rest,
  } = props;

  return (
    <button
      {...rest}
      ref={ref}
    >
      {children}
    </button>
  )
});

export function asSubmitButton (Component) {
  function BasicSubmit (props) {
    const {
      buttonRef,
      controller,
      formApi,
      onClick,
      onKeyDown,
      ...rest,
    } = props;

    function handleClick(e) {
      formApi.submitForm(e);
      onClick(e);
    }

    function handleKeyDown(e) {
      formApi.submitForm(e);
      onKeyDown(e);
    }

    return (
      <Component
        {...rest}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        ref={buttonRef}
        type={'button'}
      />
    )
  }

  BasicSubmit.defaultProps = {
    onClick: () => { },
    onKeyDown: () => { },
  }

  return withFormConnection(BasicSubmit);
}

BasicSubmit.defaultProps = {
  onClick: () => {},
  onKeyDown: () => { },
}

export default asSubmitButton(BasicSubmit);