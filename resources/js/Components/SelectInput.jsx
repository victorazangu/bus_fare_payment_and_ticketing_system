import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const SelectInput = forwardRef(function SelectInput(
    {
        options = [],
        className = '',
        isFocused = false,
        isMulti = false,
        ...props
    },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <select
            {...props}
            className={
                'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 ' +
                (isMulti ? 'h-auto min-h-[100px]' : '') + // Add some height for multi-select
                className
            }
            ref={localRef}
            multiple={isMulti} // This enables multi-select functionality
        >
            {!isMulti && <option value="">Select an option</option>}
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
});

export default SelectInput;
