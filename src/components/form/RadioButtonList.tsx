export type RadioButtonListProps = {
    names: readonly string[],
    selected: number,
    setSelected: (val: number) => void
}

const RadioButtonList = ({setSelected, selected, names}: RadioButtonListProps) => {
    return (
        <fieldset>
            {[...Array(names.length)].map((_, i) =>
                <div key={names[i]} className="flex justify-start items-center gap-2">
                    <input id={`radio-${i}`} className="w-4 h-4" checked={i === selected}
                           onChange={e => e.target.checked && setSelected(i)}
                           type="radio"/>
                    <label htmlFor={`radio-${i}`}>{names[i]}</label>
                </div>
            )}
        </fieldset>
    );
};

export default RadioButtonList;