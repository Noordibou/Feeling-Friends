import React from 'react'
import saveButton from '../images/button.png'

// different places this button is currently used:

// Edit seating chart
// // 
// <button
// className="relative overflow-hidden mx-4 rounded-xl"
// onClick={handleSave}
// >
// <img
//   alt="Save Seating Chart"
//   className=" object-auto w-72 h-full"
//   src={saveButton}
// />
// <h4 className="absolute text-[23px] font-[Poppins] inset-0 flex items-center justify-center text-black font-bold">
//   Save
// </h4>
// </button>
// </div>


// // on login screen
// <button
//     className="relative overflow-hidden w-[35rem] h-[4.9375rem] mt-[2rem] text-notebookPaper font-button text-button"
//     type="submit"
// >
//     <img className=" object-cover w-full" src={Button} />
//     <h4 className="absolute text-[23px] font-[Poppins] inset-0 flex items-center justify-center text-white font-bold">Login</h4>
// </button>


// on needsgoals screen

// <button className="relative overflow-hidden mt-5">
//   <img className=" object-cover w-full h-full" src={saveButton} alt="save goals"/>
//   <h4 className="absolute text-[23px] font-[Poppins] inset-0 flex items-center justify-center text-white font-bold">Save</h4>
// </button>


const BtnRainbow = ({btnText, handleSave}) => {

    return (
      
        <button
          className="relative overflow-hidden mx-4 rounded-xl"
          onClick={handleSave}
        >
          <img
            alt="Save Seating Chart"
            className={` object-auto h-20`}
            src={saveButton}
          />
          <h4 className="absolute text-[23px] font-[Poppins] inset-0 flex items-center justify-center text-black font-bold">
            {btnText}
          </h4>
        </button>
      
    );
}

export default BtnRainbow;