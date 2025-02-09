import GoBack from "./GoBack";
const SimpleTopNav = ({ pageTitle, fontsize }) => {
  return (
    <div className="flex justify-around items-center ">
      <div className="">
        <GoBack />
      </div>
      {pageTitle ? (
        <h1 className={`${fontsize} w-full text-center font-header1`}>
          {pageTitle}
        </h1>
      ) : null}
    </div>
  );
};
export default SimpleTopNav;
