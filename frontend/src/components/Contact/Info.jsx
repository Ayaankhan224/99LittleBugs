import React from 'react'

const Info = () => {
  return (
    <div className='w-full h-[35%] flex p-7 '>
      <div className='h-full w-[60%] flex flex-col justify-between'>
        <p className='text-xl font-medium bg-neutral-200 w-fit px-4 py-2 rounded-4xl'>Let's Talk</p>
        <h1 className='font-bold text-8xl pb-7 font-[poppins] tracking-tighter'>&nbsp;&nbsp;&nbsp;&nbsp;Contact Us</h1>
      </div>
      <div className='h-full w-[40%] text-right flex flex-col justify-end p-7'>
        <p className='pb-7 text-xl font-[poppins]'>Tell us when, why and who<br/>and our team will contact you within 24 hours</p>
      </div>
    </div>
  )
}

export default Info