import React from 'react'

function useSearchBox() {
  const [ageRange, setAgeRange] = React.useState({ lo: 0, hi: 0 })
  const [rateRange, setRateRange] = React.useState({ lo: 0, hi: 0 })
  const [locationRange, setLocationRange] = React.useState({ lo: 0, hi: 0 })
  const [allTags, setAllTags] = React.useState([])
  const [tags, setTags] = React.useState([])
  const [ascendingOrder, setAscendingOrder] = React.useState(true)
  const [orderBy, setOrderBy] = React.useState(0)

  return {
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
  }
}

export default useSearchBox