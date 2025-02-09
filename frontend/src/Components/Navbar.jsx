import React from 'react'

const Navbar = () => {
  return (
    <>
      <div className='text-white w-full h-20 flex bg-[#121219]  justify-between align-middle '>
        <div className='my-auto ml-6 animate__animated animate__bounce'>Logo</div>
        <div className='my-auto'><input placeholder='Search...' className='pl-4 py-1 rounded-full  bg-gray-700' type="text"/></div>
        <div className='my-auto mr-6'><button className='bg-[#fff] rounded-xl text-black px-3 py-1'>Login</button> or <button className='bg-[#fff] rounded-xl text-black px-3 py-1'>Sign up</button> </div>
      </div>
      <hr />
    </>
  )
}

export default Navbar