/**
 * Props for CheckboxList component
 */
export type CheckboxListProps = {
    /**
     * Names of the options
     */
    names: readonly string[],
    /**
     * Values of the options
     */
    values: boolean[],
    /**
     * Function to set the values of the options
     * @param val - new values of the options
     */
    setValues: (val: boolean[]) => void
}

/**
 * CheckboxList component
 *
 * @remarks
 * All 3 arrays must have the same length
 * @param values
 * @param setValues
 * @param names
 */
const CheckboxList = ({values, setValues, names}: CheckboxListProps) => {
    return (
        <div>
            {[...Array(names.length)].map((_, i) =>
                <div key={names[i]} className="flex justify-start items-center gap-2">
                    <input id={`chkbox-${i}`} className="w-4 h-4" checked={values[i]}
                           onChange={e => setValues([...values.slice(0, i), e.target.checked, ...values.slice(i + 1)])}
                           type="checkbox"/>
                    <label htmlFor={`chkbox-${i}`}>{names[i]}</label>
                </div>
            )}
        </div>
    );
};

export default CheckboxList;