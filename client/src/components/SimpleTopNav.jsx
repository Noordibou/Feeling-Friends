import GoBack from "./GoBack";
const SimpleTopNav = ({ pageTitle, fontsize }) => {
  return (
    <div className="flex justify-around items-center ">
      <div className="">
        <GoBack />
      </div>
      <span className={`${fontsize} w-full text-center font-header1`}>
        {pageTitle}
      </span>
    </div>
  );
};
export default SimpleTopNav;