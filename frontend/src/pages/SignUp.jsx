import React from "react";
import Back from "../components/common/Back"
import { Link } from "react-router-dom"

const SignUp = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="bg-white h-180 w-340 rounded-3xl shadow-[0_10px_60px_rgba(0,0,0,0.4)] p-2 flex">
        <div className="w-[40%] h-full rounded-l-3xl overflow-hidden">
          <img src="/sign-img.png" className="object-cover h-full w-full" />
        </div>
        <div className="w-[60%] h-full rounded-r-3xl p-15 flex flex-col justify-between">
          <Back />
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-[poppins]">Sign-Up to</h3>
            <h1 className="text-9xl font-[oran]">ANKER</h1>
          </div>
          <div className="flex flex-col gap-4">
            <input
              className="bg-[#F1EEEA] rounded-full text-[1rem] p-3 outline-none "
              type="text"
              placeholder="Enter email"
            />
            <input
              className="bg-[#F1EEEA] rounded-full text-[1rem] p-3 outline-none "
              type="text"
              placeholder="Enter password"
            />
            <p className="text-[0.9rem]">
              Already have an account? <Link to="/login" className="text-blue-700">Log-In</Link>
            </p>
          </div>
          <div>
            <Link>
              <div className="flex items-center gap-2">
                <span className="text-black text-[1rem] font-[poppins] py-3 px-6 rounded-full bg-[#F1EEEA] hover:bg-[#E56E3A] hover:text-white hover:scale-110 duration-100 ease-in">Submit</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
