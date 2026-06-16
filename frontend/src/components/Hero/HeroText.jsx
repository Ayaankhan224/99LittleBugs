import React from "react"

const HeroText = () => {
  return (
    <div className=" h-[30vw] flex flex-col justify-center items-center text-center gap-4 mt-20">
      <h1 className="text-9xl font-[oran] tracking-tighter">
        We make <span className="text-[#E56E3A] font-[nycd]">talent</span>
        <br />
        impossible to miss
      </h1>
      <p className="text-[1.2rem] uppercase font-[poppins]">
        AI-powered candidate ranking
        <br /> with transparent hiring insights
      </p>
    </div>
  )
}

export default HeroText
