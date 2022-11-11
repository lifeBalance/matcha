import React from 'react'
import { Collapse } from 'react-collapse'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import MiniSelect from '../components/UI/MiniSelect'

function SearchBox() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="max-w-4xl flex flex-col border border-white rounded-lg px-4 py-2">
      <div className='flex justify-between text-white group hover:cursor-pointer' onClick={() => setIsOpen(!isOpen)} >
        <p className='text-white text-xl group-hover:underline underline-offset-2 group-hover:scale-105' >Advanced Search</p>
        <ChevronDownIcon className={`inline w-6 text-white group-hover:scale-110 ${isOpen && 'rotate-180'}`} />
      </div>

      <Collapse isOpened={isOpen}>
        <div className="flex flex-col space-y-2 mt-6">
          <div className="flex items-center justify-between">
            <input type='number' min='1' max='20' className='w-20 h-8'/>
            <p className='text-white px-2'>age</p>
            <input type='number' min='1' max='20' className='w-20 h-8'/>
          </div>

          <div className="flex items-center justify-between">
            <input type='number' min='1' max='20' className='w-20 h-8'/>
            <p className='text-white px-2'>rated</p>
            <input type='number' min='1' max='20' className='w-20 h-8'/>
          </div>

          <div className="flex items-center justify-between">
            <input type='number' min='1' max='20' className='w-20 h-8'/>
            <p className='text-white px-2'>location</p>
            <input type='number' min='1' max='20' className='w-20 h-8'/>
          </div>

          <div className="flex items-center justify-between">
            <input type='number' min='1' max='20' className='w-20 h-8'/>
            <p className='text-white px-2'>common tags</p>
            <input type='number' min='1' max='20' className='w-20 h-8'/>
          </div>
          {/* <div className='flex'> */}
            <MiniSelect 
              value={0}
              // onChangeHandler={genderChangeHandler}
              label='filter by'
              id='filter'
              options={[
                { value: 0, label: 'age' },
                { value: 1, label: 'rated' },
                { value: 2, label: 'location' },
                { value: 3, label: 'common tags' }
              ]}
            />
            <MiniSelect 
              value={0}
              // onChangeHandler={genderChangeHandler}
              label='order by'
              id='order'
              options={[
                { value: 0, label: 'Ascending' },
                { value: 1, label: 'Descending' }
              ]}
            />
          {/* </div> */}
          <p className='text-white text-xl hover:underline hover:underline-offset-4 hover:cursor-pointer text-center py-3'>Run Search</p>
        </div>
      </Collapse>
    </div>
  )
}

export default SearchBox
