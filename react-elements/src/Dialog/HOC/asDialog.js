import React, {
  useState
} from 'react';
import PropTypes from 'prop-types';

const asDialog = Component =>
  React.forwardRef((props, ref) => {
    const {
      active,
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
      <Component
      />
    );
  });

  export default asDialog;
