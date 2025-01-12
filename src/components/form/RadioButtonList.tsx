/**
 * Props for RadioButtonList component
 */
export type RadioButtonListProps = {
  /**
   * Names of the options
   */
  names: readonly string[];
  /**
   * Index of the selected option
   */
  selected: number;
  /**
   * Function to set the selected option
   * @param val - Index of the selected option
   */
  setSelected: (val: number) => void;
};

/**
 * Radio button list component
 * @param setSelected - Function to set the selected option
 * @param selected - Index of the selected option
 * @param names - Names of the options
 */
const RadioButtonList = ({
                           setSelected,
                           selected,
                           names
                         }: RadioButtonListProps) => {
  return (
    <fieldset>
      {[...Array(names.length)].map((_, i) => (
        <div key={names[i]} className="flex justify-start items-center gap-2">
          <input
            id={`radio-${i}`}
            className="w-4 h-4"
            checked={i === selected}
            onChange={(e) => e.target.checked && setSelected(i)}
            type="radio"
          />
          <label htmlFor={`radio-${i}`}>{names[i]}</label>
        </div>
      ))}
    </fieldset>
  );
};

export default RadioButtonList;
