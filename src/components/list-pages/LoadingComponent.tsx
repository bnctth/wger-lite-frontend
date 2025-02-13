/**
 * Component for displaying a loading message.
 * @constructor
 */
const LoadingComponent = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="text-4xl py-40 animate-pulse">Loading...</h1>
    </div>
  );
};

export default LoadingComponent;
