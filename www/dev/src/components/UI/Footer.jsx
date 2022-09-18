import React from 'react'

function Footer(props) {
  return (
    <footer className='bg-black text-white mt-auto min-h-10 p-10 flex flex-col-reverse text-center  md:flex-row md:justify-between'>
      <p className='pt-4 md:place-self-end'>
        &copy;2022
        <a href='https://github.com/lifeBalance' className="font-bold text-xl text-pink-600"> rodrodri</a>
      </p>

      <div className="flex flex-col space-y-4">
        <p className=' md:text-right font-logo text-3xl'>matcha</p>
        <p className=''>Cattering to your ❤️ life and 🍆💦🍑 needs</p>
      </div>
    </footer>
  )
}

export default Footer