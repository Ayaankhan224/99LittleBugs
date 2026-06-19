import React, { useRef } from "react";
import Info from "../components/Contact/Info";
import gsap from "gsap";
import { GoArrowDownLeft } from "react-icons/go";

const Contact = () => {
  const btn = useRef(null);

  const handleEnter = () => {
    gsap.to(".btn", {
      x: 60,
      scale: 4,
      duration: 0.8,
      backgroundColor: "#111",
      rotate: 180,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    gsap.to(".btn", {
      x: 0,
      scale: 1,
      duration: 0.8,
      backgroundColor: "#fff",
      rotate: -180,
      ease: "power3.out",
    });
  };

  const handleClick = () => {
    gsap.timeline({
      repeat: 5,
      onComplete: () =>{
        gsap.to
      }
    })
    .to(".letter", {
      y: -20,
      stagger: {
        each: 0.05,
      },
      duration: 0.25,
      ease: "sine.out",
    })
    .to(
      ".letter",
      {
        y: 0,
        stagger: {
          each: 0.05,
        },
        duration: 0.25,
        ease: "sine.in",
      },
      0.1
    );
  };

  return (
    <div className="h-screen w-screen">
      <Info />
      <div className="w-full h-[65%] flex ">
        <div className="w-[60%] h-[50%] p-8 grid grid-cols-2 gap-7">
          <label className="font-semibold text-[1.2rem] -mb-3.75">Name</label>
          <label className="font-semibold text-[1.2rem] -mb-3.75">Email</label>
          <input
            className="bg-neutral-200 p-3 rounded-4xl mb-3.75 outline-none"
            type="text"
            placeholder="Your full name "
          />
          <input
            className="bg-neutral-200 p-3 rounded-4xl mb-3.75 outline-none"
            type="text"
            placeholder="you@example.com"
          />
          <label className="font-semibold text-[1.2rem] -mb-3.75">
            Phone Number
          </label>
          <label className="font-semibold text-[1.2rem] -mb-3.75">
            Preferred Date
          </label>
          <input
            className="bg-neutral-200 p-3 rounded-4xl mb-3.75 outline-none"
            type="text"
            placeholder="+91 8281978161"
          />
          <input
            className="bg-neutral-200 p-3 rounded-4xl mb-3.75 outline-none"
            type="text"
            placeholder="dd/mm/yyyy"
          />
          <label className="font-semibold text-[1.2rem] -mb-3.75">
            How to contact you?
          </label>
          <select
            className="font-semibold text-[1.2rem] bg-neutral-200 p-3 rounded-4xl outline-none"
            name="contact"
          >
            <option>Email</option>
            <option>Call</option>
          </select>
          <div
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            onClick={handleClick}
            className="rounded-4xl flex items-center gap-7 bg-black text-white w-fit py-3 px-5 cursor-pointer mt-17 text-3xl font-[poppins]"
          >
            <div className="btnText">
              {"Submit".split("").map((char, i) => (
                <span key={i} className="letter inline-block">
                  {char}
                </span>
              ))}
            </div>
            <div className="btn bg-white h-3.75 w-3.75 rounded-full overflow-hidden flex justify-center items-center">
              <GoArrowDownLeft />
            </div>
          </div>
        </div>
        <div className="w-[40%] h-full p-15 flex justify-center items-center">
          <div className="h-full w-full bg-[url(/contact-img.jpg)] bg-cover rounded-4xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
