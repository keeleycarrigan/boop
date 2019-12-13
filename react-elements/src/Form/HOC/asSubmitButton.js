import React from 'react';
import PropTypes from 'prop-types';

import withFormConnection from 'Form/HOC/withFormConnection';

function asSubmitButton(Component) {
  function BasicSubmit(props) {
    const {
      buttonRef,
      formApi,
      onClick,
      onKeyDown,
      ...rest
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

  BasicSubmit.propTypes = {
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
  }

  return withFormConnection(BasicSubmit);
}

export default asSubmitButton;
