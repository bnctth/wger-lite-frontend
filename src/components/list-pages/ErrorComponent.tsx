/**
 * Component for displaying an error message.
 */
const EmptyComponent = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h1 className="text-4xl py-40 text-center">Something went wrong...</h1>
      <h2 className="text-2xl text-center">Try again later!</h2>
    </div>
  );
};

export default EmptyComponent;
