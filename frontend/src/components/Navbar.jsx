import React from "react";
import { IoIosMenu } from "react-icons/io";
import { IconContext } from "react-icons";

const Navbar = () => {
  return (
    <div className="flex justify-between">
      <h1 className="font-[oran] text-4xl font-semibold leading-9">
        99
        <br />
        Little
        <br />
        Bugs
      </h1>
      <div className="flex items-start gap-2">
        <IconContext.Provider value={{ color:"white", size: "1.5em" }}>
          <div className="bg-black rounded-full p-2 cursor-pointer hover:scale-110 duration-100 ease-in">
            <IoIosMenu />
          </div>
        </IconContext.Provider>
        <h3 className="text-white bg-[#E56E3A] py-2 px-5 rounded-full tracking-wider cursor-pointer hover:scale-110 duration-100 ease-in">SOURCE</h3>
      </div>
    </div>
  );
};

export default Navbar;
