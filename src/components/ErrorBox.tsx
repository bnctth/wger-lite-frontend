import {ReactNode} from 'react';

const ErrorBox = ({enabled, children}: { enabled: boolean, children: ReactNode }) => {
    return (<>
            {enabled && <div className="bg-error-faded border-error border-2 rounded p-2">{children}</div>}
        </>
    );
};

export default ErrorBox;