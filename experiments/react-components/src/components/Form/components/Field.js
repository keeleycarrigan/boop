import React, { PureComponent } from 'react';

import { bindToField } from '../HOC/with';

class BaseField extends PureComponent {
  constructor(props) {
    super(props);
    this.me = React.createRef();
  }
  componentDidMount() {
    this.props.register();
  }
  componentWillUnmount() {
    this.props.deregister();
  }
  componentDidUpdate() {
    if (this.props.debug && this.me) {
      this.me.current.style.backgroundColor = 'red';
      setTimeout(() => {
        this.me.current.style.backgroundColor = 'white';
      }, 500);
    }
  }
  render() {
    const {
      children,
      component,
      debug,
      deregister,
      fieldApi,
      fieldState,
      inputRef,
      register,
      render,
      ...rest
    } = this.props;
    const props = {
      fieldApi,
      fieldState,
      inputRef: debug ? this.me : inputRef,
      ...rest
    };

    if (component) {
      return React.createElement(component, props, children);
    }

    if (render) {
      return render(props);
    }

    if (typeof children === 'function') {
      return children(props);
    }

    return children;
  }
}
const Field = bindToField(BaseField);

export default Field;