import withAuth from "../../hoc/withAuth";

const Insight = () => {
      
    return (
      <>

          {/* having these help the colors render for some reason. Without, the colors don't show */}
          <div className="hidden bg-lightBlue"></div>
          <div className="hidden bg-lightLavender"></div>
          <div className="hidden bg-lightYellow"></div>
          <div className="hidden bg-pink"></div>
          <div className="hidden bg-lightOrange"></div>
  
      </>
    );
  };

export default withAuth(['student'])(Insight)
