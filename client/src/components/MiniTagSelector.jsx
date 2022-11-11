import React from 'react'
import Select from 'react-select'

function MiniTagSelector(props) {
  // console.log(props.tags)
  return (
    <div className='flex flex-col w-full px-2'>
      <div className='flex justify-between items-center text-white'>
        <h1 className='text-lg font-medium pb-2 capitalize align-left'>
          Interested in <span className='text-sm'>(up to 5 tags)</span>
        </h1>
      </div>

      <Select
        isMulti
        value={props.tags}
        onChange={opt => props.setTags(opt)}
        options={props.allTags}
        isOptionDisabled={() => props.tags.length >= 5}
      />
    </div>
  )
}

export default MiniTagSelector
