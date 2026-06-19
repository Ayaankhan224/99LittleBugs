import React, { useState } from "react";
import { FaCode } from "react-icons/fa";
import { IconContext } from "react-icons";
import { RxCross2 } from "react-icons/rx";
import { TransitionLink } from "../../pages/Loading";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center w-full">
      <h1 className="font-[oran] text-4xl font-semibold leading-9">
        ANKER
      </h1>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="font-[poppins] text-[0.9rem] font-medium text-neutral-800">
            Hi, <span className="text-[#E56E3A] font-bold capitalize">{user.username}</span>
          </span>
          <button
            onClick={logout}
            className="text-white font-[poppins] text-[0.8rem] bg-[#111] py-2 px-5 rounded-full tracking-wider cursor-pointer hover:scale-110 duration-100 ease-in"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 items-start gap-2">
          <TransitionLink to="/signup">
            <h3 className="text-white font-[poppins] text-[0.8rem] bg-[#E56E3A] py-2 px-5 rounded-full tracking-wider cursor-pointer hover:scale-110 duration-100 ease-in text-center">
              SignUp
            </h3>
          </TransitionLink>
          <TransitionLink to="/login">
            <h3 className="text-white font-[poppins] text-[0.8rem] bg-[#111] py-2 px-5 rounded-full tracking-wider cursor-pointer hover:scale-110 duration-100 ease-in text-center">
              LogIn
            </h3>
          </TransitionLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;
