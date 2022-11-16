import React from 'react'

function useSearchBox() {
  const [ageRange, setAgeRange] = React.useState({ lo: 18, hi: 99 })
  const [rateRange, setRateRange] = React.useState({ lo: 0, hi: 100 })
  const [locationRange, setLocationRange] = React.useState({lo: 0, hi: 25 })
  const [allTags, setAllTags] = React.useState([])
  const [tags, setTags] = React.useState([])
  const [ascendingOrder, setAscendingOrder] = React.useState(true)
  const [orderBy, setOrderBy] = React.useState(0)

  function reset() {
    setAgeRange({ lo: 18, hi: 99 })
    setRateRange({ lo: 0, hi: 100 })
    setLocationRange({ lo: 0, hi: 25 })
  }

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
    setOrderBy,
    reset
  }
}

export default useSearchBox