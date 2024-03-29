import React from 'react'
import { validateTag } from '../utils/validators'

function useTagSelector() {
  const [availableTags, setAvailableTags] = React.useState([])
  const [selectedTags,  setSelectedTags]  = React.useState([])
  const [tagsWarning,   setTagsWarning]   = React.useState(false)
  const [tagsError,     setTagsError]     = React.useState(false)
  const [tagSelectorWasChanged, setTagSelectorWasChanged] = React.useState(false)

  React.useEffect(() => {
    if (selectedTags?.length >= 5)
      setTagsWarning('5 tags maximum')
    else
      setTagsWarning(false)
  }, [selectedTags])

  function addTag(opt, meta) {
    // console.log(opt)  // testing
    // console.log(meta) // testing

    setTagSelectorWasChanged(true)
    setTagsError(false)

    if (meta.action === 'create-option') {
      if (validateTag(meta.option.label)) {
        // setSelectedTags(opt)

        const minusLastElement = opt.slice(0, -1)
        let lastElement = opt[opt.length - 1]
        // Let's write the label as lowercase
        lastElement = { ...lastElement, label: lastElement.label.toLowerCase() }

        setSelectedTags([...minusLastElement, lastElement])
      } else setTagsError('Only letters and dashes (between 2 and 30)')
    } else
      setSelectedTags(opt)
  }

  return {
    availableTags,
    setAvailableTags,
    selectedTags,
    setSelectedTags,
    tagsWarning,
    tagsError,
    setTagsError,
    addTag,
    tagSelectorWasChanged
  }
}

export default useTagSelector