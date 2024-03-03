import React from "react";
import saveButton from '../../images/button.png'
import BtnRainbow from "../../components/BtnRainbow";


export default function NeedsGoals() {
  return (
    <>
      <div className="h-screen">
        <h1 className="text-header1 font-header1 text-center pt-[4rem] pb-[0.5rem]">
          <a href="javascript:history.back()">&lt;</a> &nbsp; &nbsp; Class Name
        </h1>
        <h2 className="text-header2 font-header2 text-center">Room 123</h2>
        <h4 className="text-body font-body text-center">
          Set preset goal options for your students
        </h4>
        <br />

        <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[1.5rem] rounded-[1rem]">
          <h2 className="text-header2 font-header2 text-center">
            "What's your most important <u>goal</u> for the day?"
          </h2>

          {/* Divs in place of buttons for this selection probably. Here is one div since they will probably need to be listed from the backend depending on how many choices the teacher has made */}
          <div className="bg-white rounded-[1rem] border-graphite border-[4px] p-[1.5rem] flex justify-between mt-[1rem] mb-[1rem]">
            <div className="text-body font-body">
              Finish homework during study hall
            </div>
            <div className="text-body font-body">
              <a href="/">Edit</a> &nbsp; <a href="/">X</a>
            </div>
          </div>

          {/* Add new goal div */}
          <div className="rounded-[1rem] border-graphite border-[4px] p-[1.5rem] mt-[1rem] mb-[1rem]">
            <h4 className="text-body font-body text-center">Add new goal +</h4>
          </div>

          <div className="flex justify-between">
            <div>
              <span className="text-body font-body">
                Allow students to input custom goals?
              </span>
            </div>
            <div>
              <label for="customGoals" className="text-body font-body">
                Yes
              </label>{" "}
              <input
                type="checkbox"
                id="yes"
                name="checkbox"
                value="1"
                className="w-5 h-5 mr-[2rem]"
              />
              <label for="customGoals" className="text-body font-body">
                No
              </label>{" "}
              <input
                type="checkbox"
                id="no"
                name="checkbox"
                value="1"
                className="w-5 h-5"
              />
            </div>
          </div>

          <div className="mt-5"> 
            <BtnRainbow textColor="text-white" btnText="Save" handleSave={() => console.log("Saved! Need actual save function though")}/>
          </div>
         
        </div>
        <div className="bg-sandwich w-[90%] ml-auto mr-auto p-[1.5rem] rounded-[1rem] mt-[3rem]">
          <h2 className="text-header2 font-header2 text-center">
            "What do you <u>need</u> from an adult to succeed today?"
          </h2>

          <div className="bg-white rounded-[1rem] border-graphite border-[4px] p-[1.5rem] flex justify-between mt-[1rem] mb-[1rem]">
            <div className="text-body font-body">
              Finish homework during study hall
            </div>
            <div className="text-body font-body">
              <a href="/">Edit</a> &nbsp; <a href="/">X</a>
            </div>
          </div>

          {/* Add new need div */}
          <div className="rounded-[1rem] border-graphite border-[4px] p-[1.5rem] mt-[1rem] mb-[1rem]">
            <h4 className="text-body font-body text-center">Add new need +</h4>
          </div>

          <div className="flex justify-between">
            <div>
              <span className="text-body font-body">
                Allow students to input custom needs?
              </span>
            </div>
            <div>
              <label for="customGoals" className="text-body font-body">
                Yes
              </label>{" "}
              <input
                type="checkbox"
                id="yes"
                name="checkbox"
                value="1"
                className="w-5 h-5 mr-[2rem]"
              />
              <label for="customGoals" className="text-body font-body">
                No
              </label>{" "}
              <input
                type="checkbox"
                id="no"
                name="checkbox"
                value="1"
                className="w-5 h-5"
              />
            </div>
          </div>
          <div className="mt-5"> 
            <BtnRainbow textColor="text-white" btnText="Save" handleSave={() => console.log("Saved! Need actual save function though")}/>
          </div>
        </div>
      </div>
    </>
  );
}
