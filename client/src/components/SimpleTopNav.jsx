import GoBack from "./GoBack";
const SimpleTopNav = ({ pageTitle }) => {
  return (
    <div className="flex justify-around items-center mt-8">
      <div className="mx-8">
        <GoBack />
      </div>
      <span className="text-header1 w-full text-center font-header1">
        {pageTitle}
      </span>
    </div>
  );
};
export default SimpleTopNav;