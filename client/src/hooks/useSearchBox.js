import React from 'react'

function useSearchBox() {
  const [sortedProfiles, setSortedProfiles] = React.useState([])
  const [ageRange, setAgeRange] = React.useState({ lo: 18, hi: 99 })
  const [rateRange, setRateRange] = React.useState({ lo: 0, hi: 100 })
  const [locationRange, setLocationRange] = React.useState({ lo: 0, hi: 20004 })
  const [allTags, setAllTags] = React.useState([])
  const [tags, setTags] = React.useState([])
  const [ascendingOrder, setAscendingOrder] = React.useState(true)
  const [orderBy, setOrderBy] = React.useState(0)
// console.log(sortedProfiles) // testing
  return {
    sortedProfiles,
    setSortedProfiles,
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