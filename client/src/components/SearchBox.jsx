import React from 'react'
import { Collapse } from 'react-collapse'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import MiniSelect from '../components/UI/MiniSelect'
import MiniTagSelector from './MiniTagSelector'

function SearchBox({ searchBoxProps, profiles, setSortedProfiles }) {
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
    setOrderBy
  } = searchBoxProps

  function search() {
    setSortedProfiles(profiles)

    const loAge = Math.min(parseInt(ageRange.lo), parseInt(ageRange.hi))
    const hiAge = Math.max(parseInt(ageRange.lo), parseInt(ageRange.hi))
    const loRate = Math.min(parseFloat(rateRange.lo), parseFloat(rateRange.hi))
    const hiRate = Math.max(parseFloat(rateRange.lo), parseFloat(rateRange.hi))
    const loLoc = Math.min(parseFloat(locationRange.lo), parseFloat(locationRange.hi))
    const hiLoc = Math.max(parseFloat(locationRange.lo), parseFloat(locationRange.hi))

    setSortedProfiles(prev => prev.filter(p => {
      return  p.age >= loAge &&
              p.age <= hiAge &&
              p.rated >= loRate &&
              p.rated <= hiRate &&
              p.location >= loLoc &&
              p.location <= hiLoc
    }))
    console.log(ageRange.lo, ageRange.hi) // testing
  }

  function reset() {
    setAgeRange({ lo: 18, hi: 99 })
    setRateRange({ lo: 0, hi: 100 })
    setLocationRange({ lo: 0, hi: 20004 })
    setSortedProfiles(profiles)
  }

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
              min='0'
              max='99'
              className='w-20 h-8 rounded-sm border-slate-300'
              value={ageRange.lo}
              onChange={e => setAgeRange({ ...ageRange, lo: e.target.value })}
            />
            <p className='text-white px-2'>age range</p>
            <input
              type='number'
              min='0'
              max='99'
              className='w-20 h-8 rounded-sm border-slate-300'
              value={ageRange.hi}
              onChange={e => setAgeRange({ ...ageRange, hi: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <input
              type='number'
              min='0'
              max='100'
              className='w-20 h-8 rounded-sm border-slate-300'
              value={rateRange.lo}
              onChange={e => setRateRange({ ...rateRange, lo: e.target.value })}
            />
            <p className='text-white px-2'>rate range</p>
            <input
              type='number'
              min='0'
              max='100'
              className='w-20 h-8 rounded-sm border-slate-300'
              value={rateRange.hi}
              onChange={e => setRateRange({ ...rateRange, hi: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <input
              type='number'
              min='0'
              max='20004'
              className='w-[90px] h-8 rounded-sm border-slate-300'
              value={locationRange.lo}
              onChange={e => setLocationRange({ ...locationRange, lo: e.target.value })}
              />
            <p className='text-white px-2'>location range</p>
            <input
              type='number'
              min='0'
              max='20004'
              className='w-[90px] h-8 rounded-sm border-slate-300'
              value={locationRange.hi}
              onChange={e => setLocationRange({ ...locationRange, hi: e.target.value })}
              />
          </div>

          <MiniTagSelector
            allTags={allTags}
            tags={tags}
            setTags={setTags}
          />

          <div className='flex pt-4 pb-4'>
            <p
              className='text-white text-xl border rounded-lg hover:bg-white
              hover:bg-opacity-20 hover:cursor-pointer text-center py-1 w-[40%] mx-auto'
              onClick={search}
            >Run Search</p>

            <p
              className='text-white text-xl border rounded-lg hover:bg-white
              hover:bg-opacity-20 hover:cursor-pointer text-center py-1 w-[40%] mx-auto'
              onClick={reset}
            >Clear</p>
          </div>

          <hr className='pb-2 pt-2'/>

          <MiniSelect 
            value={orderBy}
            onChangeHandler={e => setOrderBy(e.target.value)}
            label='sort by'
            id='order'
            options={[
              { value: 0, label: 'age' },
              { value: 1, label: 'rated' },
              { value: 2, label: 'location' },
              { value: 3, label: 'common tags' }
            ]}
          />

          <div
            className="flex items-center justify-between text-white px-4"
          >
            <div className='space-x-1'>
              <input
                type="radio"
                id='ascending'
                checked={ascendingOrder}
                onChange={() => setAscendingOrder(prevState => !prevState)}
              />
              <label htmlFor="ascending">Ascending order</label>
            </div>

            <div className='space-x-1'>
              <input
                type="radio"
                id='descending'
                checked={!ascendingOrder}
                onChange={() => setAscendingOrder(prevState => !prevState)}
              />
              <label htmlFor="descending">Descending order</label>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  )
}

export default SearchBox
