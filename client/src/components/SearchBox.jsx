import React from 'react'
import { Collapse } from 'react-collapse'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import MiniSelect from '../components/UI/MiniSelect'
import MiniTagSelector from './MiniTagSelector'

function SearchBox({ searchBoxProps }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const {
    ageRange,
    setAgeRange,
    rateRange,
    setRateRange,
    locationRange,
    setLocationRange,
    tags,
    allTags,
    setAllTags,
    setTags,
    ascendingOrder,
    setAscendingOrder,
    orderBy,
    setOrderBy,
    isSelectDisabled,
    setIsSelectDisabled
  } = searchBoxProps

  return (
    <div className="w-[360px] flex flex-col border border-white rounded-lg px-4 py-2 mx-auto">
      <div className='flex justify-between text-white group hover:cursor-pointer' onClick={() => setIsOpen(!isOpen)} >
        <p className='text-white text-xl group-hover:underline underline-offset-2 group-hover:scale-105' >Advanced Search</p>
        <ChevronDownIcon className={`inline w-6 text-white group-hover:scale-110 ${isOpen && 'rotate-180'}`} />
      </div>

      <Collapse isOpened={isOpen}>
        <div className="flex flex-col space-y-2 mt-6">
          <div className="flex items-center justify-between">
            <input
              type='number'
              min='1'
              max='20'
              className='w-20 h-8'
              value={ageRange.lo}
              onChange={e => setAgeRange({ ...ageRange, lo: e.target.value })}
            />
            <p className='text-white px-2'>age range</p>
            <input
              type='number'
              min='1'
              max='20'
              className='w-20 h-8'
              value={ageRange.hi}
              onChange={e => setAgeRange({ ...ageRange, hi: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <input
              type='number'
              min='1'
              max='20'
              className='w-20 h-8'
              value={rateRange.lo}
              onChange={e => setRateRange({ ...rateRange, lo: e.target.value })}
            />
            <p className='text-white px-2'>rate range</p>
            <input
              type='number'
              min='1'
              max='20'
              className='w-20 h-8'
              value={rateRange.hi}
              onChange={e => setRateRange({ ...rateRange, hi: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <input
              type='number'
              min='1'
              max='20'
              className='w-20 h-8'
              value={locationRange.lo}
              onChange={e => setLocationRange({ ...locationRange, lo: e.target.value })}
              />
            <p className='text-white px-2'>location range</p>
            <input
              type='number'
              min='1'
              max='20'
              className='w-20 h-8'
              value={locationRange.hi}
              onChange={e => setLocationRange({ ...locationRange, hi: e.target.value })}
              />
          </div>

          <MiniTagSelector
            allTags={allTags}
            tags={tags}
            setTags={setTags}
          />

          <MiniSelect 
            value={orderBy}
            onChangeHandler={e => setOrderBy(e.target.value)}
            label='order by'
            id='order'
            options={[
              { value: 0, label: 'age' },
              { value: 1, label: 'rated' },
              { value: 2, label: 'location' },
              { value: 3, label: 'common tags' }
            ]}
          />

          <div
            className="flex items-center justify-between text-white px-6"
          >
            <div className='space-x-2'>
              <input
                type="radio"
                id='ascending'
                checked={ascendingOrder}
                onChange={() => setAscendingOrder(prevState => !prevState)}
              />
              <label htmlFor="ascending">Ascending</label>
            </div>

            <div className='space-x-2'>
              <input
                type="radio"
                id='descending'
                checked={!ascendingOrder}
                onChange={() => setAscendingOrder(prevState => !prevState)}
              />
              <label htmlFor="descending">Descending</label>
            </div>
          </div>

          <p
            className='text-white text-xl hover:underline
            hover:underline-offset-4 hover:cursor-pointer text-center py-3'
          >Run Search</p>
        </div>
      </Collapse>
    </div>
  )
}

export default SearchBox
