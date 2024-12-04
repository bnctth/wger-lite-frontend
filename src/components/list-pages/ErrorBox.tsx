import {ReactNode} from 'react';

/**
 * Component to display an error box
 * @param enabled - whether the error box should be displayed
 * @param children - the content of the error box
 * @constructor
 */
const ErrorBox = ({enabled, children}: { enabled: boolean, children: ReactNode }) => {
    return (<>
            {enabled && <div className="bg-danger-faded border-danger border-2 rounded p-2">{children}</div>}
        </>
    );
};

export default ErrorBox;