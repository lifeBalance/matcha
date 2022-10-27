import React from 'react'
import CreatableSelect from 'react-select/creatable'
import { HandRaisedIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
// import { validateTag } from '../utils/validators'

function TagSelector(props) {
  // const [options, setOptions] = React.useState([])
  // const [warning, setWarning] = React.useState(false)
  // const [error,   setError]   = React.useState(false)

  const warningElem = (<>
    <CheckCircleIcon className='w-4 -mt-1 mr-1 inline'/>
    {props.tagsWarning}
  </>)

  const errorElem = (<>
    <HandRaisedIcon className='w-4 -mt-1 mr-1 inline'/>
    {props.tagsError}
  </>)

  // React.useEffect(() => {
  //   if (options.length >= 5)
  //     setWarning(warningContent)
  //   else
  //     setWarning(false)
  // }, [options])

  // function addOption(opt, meta) {
  //   console.log(opt)  // testing
  //   console.log(meta) // testing

  //   setError(false)

  //   if (meta.action === 'create-option') {
  //     if (validateTag(meta.option.label)) {
  //       setOptions(opt)
  //     } else setError(errorContent)
  //   } else
  //     setOptions(opt)
  // }

  return (
    <div className='flex flex-col w-full px-2 pb-20 relative'>
      <div className='flex justify-between items-center text-white'>
        <h1 className='text-2xl font-medium pb-2 capitalize align-left'>
          Your tags 
        </h1>
        {/* <span className='text-lg'>{warning && warningContent}</span> */}
        <span className='text-lg'>{props.tagsWarning && warningElem}</span>
      </div>

      <CreatableSelect
        isMulti
        value={props.selectedTags}
        options={props.availableTags}
        onChange={(opt, meta) => props.addTag(opt, meta)}
        onBlur={() => props.setTagsError(false)}
        isOptionDisabled={() => props.selectedTags.length >= 5}
      />
      {/* <p className='text-white'>{error && errorContent}</p> */}
      <p className='text-white'>{props.tagsError && errorElem}</p>
    </div>
  )
}

export default TagSelector
