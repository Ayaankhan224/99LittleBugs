import React from 'react'
import Navbar from '../components/Hero/Navbar'
import HeroText from '../components/Hero/HeroText'
import HeroBottom from '../components/Hero/HeroBottom'
import Creators from './Creators'

const Hero = () => {
  return (
    <>
    <div className='h-screen w-screen p-6 flex flex-col min-h-screen relative'>
      <Navbar />
      <HeroText />
      <HeroBottom />
    </div>
    <Creators />
    </>
  )
}

export default Hero