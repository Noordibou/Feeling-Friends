import React from 'react';
import AboutFF from "../images/aboutFF.svg";
import GitHub from "../images/githubicon.svg";
import LinkedIn from "../images/linkedinicon.svg";
import FriendsWaving from "../images/friendswaving.svg";

export default function Footer() {
  return (
    <>
     <div className="flex max-sm:block justify-evenly bg-sandwich w-full mt-[4rem] p-[3rem] max-sm:p-[1.5rem]">
        <div className="lg:w-[50%]">
          <img
            className="border-b-[0.2rem] border-notebookPaper mb-[1rem]"
            src={AboutFF}
            alt="About Feeling Friends"
          />
          <p className="font-poppins text-sm">
          Feeling Friends was born during an accessibility-themed Hackathon in late 2023.
          </p>
          <div className="lg:flex justify-between lg:mt-[3rem] mt-[1rem]">
                <div className="lg:flex justify-between">
                <div className="flex font-poppins font-semibold text-notebookPaper pr-[1rem] lg:mr-[1rem] lg:border-r-[0.2rem] lg:border-b-[0rem] border-b-[0.2rem]">
                  Software Development
                </div>

                <div className="flex">
                <ul>
                <li className="font-poppins text-sm pt-[0.5rem] max-sm:text-xs">
                  Brianne Camesi<br />
                  <button className="p-[0.7rem] border-[0.1rem] rounded-[1.5rem] text-xs"><a href="https://bricamesi.vercel.app/" target="_blank">Portfolio</a></button>
                  <a href="https://github.com/freckledspider" target="_blank">
                    <img className="inline w-[28px] h-[28px] ml-[1rem] mr-[1rem]" src={GitHub} />
                  </a>{" "}
                  <a href="https://www.linkedin.com/in/briannecamesi/" target="_blank">
                    <img className="inline w-[25px] h-[25px]" src={LinkedIn} />
                  </a>
                </li>
                <li className="font-poppins text-sm pt-[1.5rem] max-sm:text-xs">
                  Noor Dibou<br />
                  <button className="p-[0.7rem] border-[0.1rem] rounded-[1.5rem] text-xs"><a href="https://noor-dibou.vercel.app/" target="_blank">Portfolio</a></button>
                  <a href="https://github.com/Noordibou" target="_blank">
                    <img className="inline w-[28px] h-[28px] ml-[1rem] mr-[1rem]" src={GitHub} />
                  </a>{" "}
                  <a href="https://linkedin.com/in/noordibou/" target="_blank">
                    <img className="inline w-[25px] h-[25px]" src={LinkedIn} />
                  </a>
                </li>
                <li className="font-poppins text-sm pt-[1.5rem] max-sm:text-xs">
                  Alex Grimes<br />
                  <button className="p-[0.7rem] border-[0.1rem] rounded-[1.5rem] text-xs"><a href="https://alex-grimes-fullstack.herokuapp.com/" target="_blank">Portfolio</a></button>
                  <a href="https://github.com/agrimes23" target="_blank">
                    <img className="inline w-[28px] h-[28px] ml-[1rem] mr-[1rem]" src={GitHub} />
                  </a>{" "}
                  <a href="https://www.linkedin.com/in/alex-grimes-dev/" target="_blank">
                    <img className="inline w-[25px] h-[25px]" src={LinkedIn} />
                  </a>
                </li>
              </ul>
            </div></div>

            <div className="lg:flex justify-between lg:mt-[0rem] mt-[1rem]">
            
                <div className="font-poppins font-semibold text-notebookPaper pr-[1rem] lg:mr-[1rem] lg:border-r-[0.2rem] lg:border-b-[0rem] border-b-[0.2rem]">
                  User Experience Design
                </div>
                <div>
                <ul>
                <li className="font-poppins text-sm pt-[0.5rem] max-sm:text-xs">
                  Anthony Sudol<br />
                  <button className="p-[0.7rem] border-[0.1rem] rounded-[1.5rem] text-xs"><a href="https://www.anthonysudol.com/" target="_blank">Portfolio</a></button>
                  <a href="https://github.com/howdytony" target="_blank">
                    <img className="inline w-[28px] h-[28px] ml-[1rem] mr-[1rem]" src={GitHub} />
                  </a>{" "}
                  <a href="https://www.linkedin.com/in/anthonysudol" target="_blank">
                    <img className="inline w-[25px] h-[25px]" src={LinkedIn} />
                  </a>
                </li>
                <li className="font-poppins text-sm pt-[1.5rem] max-sm:text-xs">
                  July Choi<br />
                  <button className="p-[0.7rem] border-[0.1rem] rounded-[1.5rem] text-xs"><a href="https://lifestance.com/provider/therapist/or/portland/july-choi/" target="_blank">Bio</a></button>
                </li>
                <li className="font-poppins text-sm pt-[1.5rem] max-sm:text-xs">
                  Sarah Shatto<br />
                  <a href="https://www.linkedin.com/in/sarahshatto/" target="_blank">
                    <img className="inline w-[25px] h-[25px]" src={LinkedIn} />
                  </a>
                </li>
              </ul></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-sandwich w-full pb-[2rem] text-center font-poppins font-semibold text-xs">
      <img className="max-sm:pt-[1rem] ml-auto mr-auto mb-[1rem]" src={FriendsWaving} alt="Friends Waving" />
      © 2024
      </div>
    </>
  );
}