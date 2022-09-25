import React from 'react'

function Footer(props) {
  return (
    <footer className='bg-black mt-auto min-h-10 p-10'>
      <div className="max-w-6xl flex flex-col-reverse justify-between items-center mx-auto py-3 xl:px-0 md:px-8 px-4 text-white text-center md:flex-row md:justify-between">
        <p className='pt-4 md:place-self-end'>
          &copy;2022
          <a href='https://github.com/lifeBalance' className="font-bold text-xl text-pink-600"> rodrodri</a>
        </p>

        <div className="flex flex-col space-y-4">
          <p className=' md:text-right font-logo text-3xl'>matcha</p>
          <p className=''>Cattering to your ❤️ life and 🍆💦🍑 needs</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer