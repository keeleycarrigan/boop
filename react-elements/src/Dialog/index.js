import React, {
  useState
} from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

import {
  DialogActions,
  DialogBox,
  DialogContent,
  DialogWrap,
} from 'Dialog/styles';

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

function Dialog(props) {
  const {
    active,
    children,
    onClose,
  } = props;
  const isControlled = active !== null;
  const initActive = isControlled ? active : false;
  const [isActive, setActive] = useState(initActive);

  const closeModal = (e) => {
    e.preventDefault();

    if (!isControlled) {
      setActive(false);
    }

    onClose();
  }

  return (
    <Transition in={isActive} timeout={duration}>
      {state => (
        <DialogWrap
          style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}
        >
          <DialogBox tabindex="-1">
            <DialogContent>
              {children}
              <DialogActions>
                <a href="#" role="button" onClick={closeModal} aria-label="Close">x</a>
              </DialogActions>
            </DialogContent>
          </DialogBox>
        </DialogWrap>
      )}
    </Transition>
  );
}

Dialog.propTypes = {
  active: PropTypes.bool,
  onClose: PropTypes.func,
};

Dialog.defaultProps = {
  active: null,
  onClose: () => {},
};

export default Dialog;
