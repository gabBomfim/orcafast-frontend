import React from 'react';
import Resource from '../components/Resource/Resource';
import resolve from './resolve';

export default (WrappedComponent, receivedProps) => (props) => {
  const propsForResource = resolve(receivedProps, props);
  return (
    <Resource {...propsForResource}>
      {(resourceProps) => (
        <WrappedComponent {...props} resourceProps={resourceProps} />
      )}
    </Resource>
  );
};
