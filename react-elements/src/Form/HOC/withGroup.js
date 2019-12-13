import React from 'react';

import { GroupContext } from 'Form/Context';

const withGroup = Component =>
  React.forwardRef((props, ref) => (
    <GroupContext.Consumer>
      {({ fieldApi, fieldState, groupApi, multiselect, }) => (
        <Component
          fieldApi={fieldApi}
          fieldState={fieldState}
          groupApi={groupApi}
          isGroup={true}
          multiselect={multiselect}
          ref={ref}
          {...props}
        />
      )}
    </GroupContext.Consumer>
  ));

export default withGroup;
