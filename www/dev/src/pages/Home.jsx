import React from 'react'

// redux
import { useDispatch } from 'react-redux'
import { refresh } from '../store/authSlice'

function Home() {
  const dispatch = useDispatch()

  return (
    <div>
      <h1 className='text-2xl font-bold text-center'>Home</h1>

      <p className='text-xl'>
      fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed! deserunt, doloremque fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed!
      fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed! deserunt, doloremque fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed!
      fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed! deserunt, doloremque fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed!
      fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed! deserunt, doloremque fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed!
      fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed! deserunt, doloremque fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed!
      fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed! deserunt, doloremque fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed!
      fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed! deserunt, doloremque fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed!
      fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed! deserunt, doloremque fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed!
      fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed! deserunt, doloremque fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed!
      fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed! deserunt, doloremque fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed!
      fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed! deserunt, doloremque fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed!
      fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed! deserunt, doloremque fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed!
      fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed! deserunt, doloremque fugit, vero fugiat. Et harum aperiam doloremque veritatis maxime in ratione quibusdam perspiciatis voluptas ipsum illum iusto facilis expedita quasi, ullam, corrupti rem, inventore sed!
      </p>
      <button
        onClick={() => dispatch(refresh())}
        className='bg-blue-500 text-white font-bold p-4 rounded-lg active:bg-blue-400 hover:bg-blue-600'
      >
        Refresh token
      </button>
    </div>
  )
}

export default Home
