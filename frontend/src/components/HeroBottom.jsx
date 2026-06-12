import React from "react";
import { useRef } from "react";
import gsap from "gsap";

const HeroBottom = () => {
  const fillRef = useRef(null);

  const handleEnter = () => {
    gsap.to(fillRef.current, {
      scaleY: 1,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    gsap.to(fillRef.current, {
      scaleY: 0,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  return (
    <div className="flex-1 font-[poppins] flex justify-between items-end">
      <h6>RESUMES IN</h6>
      <button
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative overflow-hidden bg-[#111] text-white px-6 py-3 mb-50 rounded-4xl cursor-pointer hover:scale-105 duration-100 ease-in"
      >
        <span className="relative z-10">GET STARTED</span>
        <div
          ref={fillRef}
          className="absolute inset-0 bg-[#E67A3C] origin-bottom scale-y-0"
        />
      </button>
      <h6>INSIGHTS OUT</h6>
    </div>
  );
};

export default HeroBottom;
