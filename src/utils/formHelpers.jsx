import React from 'react';
import { HStack } from '@chakra-ui/react';

export const cnpjMask = '99.999.999/9999-99';
export const cpfMask = '999.999.999-99';
export const cepMask = '99999-999';
export const beforeMaskedValueChangePhone = (newState) => {
  let { value } = newState;

  const newValue = value.replace(/\D/g, '');
  if (newValue.length === 11) {
    value = newValue.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }

  return {
    ...newState,
    value
  };
};

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type='checkbox' ref={resolvedRef} {...rest} />
      </>
    );
  }
);

export const rowSelectionHook = (contentCallback) => (hooks) =>
  hooks.visibleColumns.push((columns) => [
    {
      id: 'selection',
      Header: ({ getToggleAllRowsSelectedProps, selectedFlatRows }) => (
        <HStack style={{ width: 0 }}>
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          {contentCallback && contentCallback(selectedFlatRows)}
        </HStack>
      ),
      Cell: ({ row }) => (
        <div style={{ width: 0 }}>
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        </div>
      )
    },
    ...columns
  ]);
