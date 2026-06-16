import React from 'react'
import Hero from './pages/Hero'
import Loading from './pages/Loading'
import Form from './pages/Form'
import { Routes, Route } from "react-router-dom"
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'

const App = () => {
  return (
    <div className='selection:text-black selection:bg-[#E56E3A]'>
      <Loading once='true'>
        <Routes>
          <Route path='/' element={<Hero />}/>
          <Route path='/form' element={<Form />}/>
          <Route path='/login' element={<LogIn />}/>
          <Route path='/signup' element={<SignUp />}/>
        </Routes>
      </Loading>
    </div>
  )
}

export default App