/**
 * Shared ReactSelect styles — matches the `app` input variant.
 * white bg | gray.200 border at rest | emerald.500 focus ring
 *
 * Usage:
 *   import { appSelectStyles } from '../../theme/selectStyles'
 *   <ReactSelect styles={appSelectStyles} ... />
 */
export const appSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'white',
        borderColor: state.isFocused ? '#00d97e' : '#E5E7EB',
        borderWidth: '1.5px',
        borderRadius: '0.75rem',
        padding: '0.1rem',
        minHeight: '48px',
        boxShadow: state.isFocused ? '0 0 0 2px #00d97e' : 'none',
        '&:hover': {
            borderColor: '#D1D5DB',
        },
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        zIndex: 10,
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? '#00d97e'
            : state.isFocused
                ? '#ECFDF5'
                : 'transparent',
        color: state.isSelected
            ? 'white'
            : state.isFocused
                ? '#059669'
                : '#374151',
        cursor: 'pointer',
        fontWeight: state.isSelected ? '600' : 'normal',
        '&:active': {
            backgroundColor: '#00d97e',
            color: 'white',
        },
    }),
    input: (provided) => ({
        ...provided,
        color: '#111827',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#111827',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#9CA3AF',
    }),
    menuPortal: (provided) => ({
        ...provided,
        zIndex: 9999,
    }),
}
