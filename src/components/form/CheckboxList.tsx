export type CheckboxListProps = {
    names: readonly string[],
    values: boolean[],
    setValues: (val: boolean[]) => void
}

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