import React from 'react'

function useSearchBox() {
  // const [sortedProfiles, setSortedProfiles] = React.useState([])
  const [ageRange, setAgeRange] = React.useState({ lo: 18, hi: 99 })
  const [rateRange, setRateRange] = React.useState({ lo: 0, hi: 100 })
  const [locationRange, setLocationRange] = React.useState({ lo: 0, hi: 20004 })
  const [allTags, setAllTags] = React.useState([])
  const [tags, setTags] = React.useState([])
  const [ascendingOrder, setAscendingOrder] = React.useState(true)
  const [orderBy, setOrderBy] = React.useState(0)
  // console.log(sortedProfiles) // testing

  function normalizeAgeRange() {
    const loAge = Math.min(parseInt(ageRange.lo), parseInt(ageRange.hi))
    const hiAge = Math.max(parseInt(ageRange.lo), parseInt(ageRange.hi))

    setAgeRange({ lo: loAge, hi: hiAge })
  }

  function normalizeRateRange() {
    const loRate = Math.min(parseFloat(rateRange.lo), parseFloat(rateRange.hi))
    const hiRate = Math.max(parseFloat(rateRange.lo), parseFloat(rateRange.hi))

    setRateRange({ lo: loRate, hi: hiRate })
  }

  function normalizeLocationRange() {
    const loLoc = Math.min(parseFloat(locationRange.lo), parseFloat(locationRange.hi))
    const hiLoc = Math.max(parseFloat(locationRange.lo), parseFloat(locationRange.hi))
    
    setLocationRange({ lo: loLoc, hi: hiLoc })
  }

  function search(profiles) {
    // setSortedProfiles(profiles)
    // setSortedProfiles(prev => prev.filter(p => {
    //   return  p.age >= loAge &&
    //           p.age <= hiAge &&
    //           p.rated >= loRate &&
    //           p.rated <= hiRate &&
    //           p.location >= loLoc &&
    //           p.location <= hiLoc
    // }))
    // console.log(ageRange.lo, ageRange.hi) // testing
  }

  function reset(profiles) {
    setAgeRange({ lo: 18, hi: 99 })
    setRateRange({ lo: 0, hi: 100 })
    setLocationRange({ lo: 0, hi: 20004 })
    // setSortedProfiles(profiles)
  }

  return {
    // sortedProfiles,
    // setSortedProfiles,
    ageRange,
    normalizeAgeRange,
    setAgeRange,
    rateRange,
    normalizeRateRange,
    setRateRange,
    locationRange,
    normalizeLocationRange,
    setLocationRange,
    tags,
    allTags,
    setAllTags,
    setTags,
    ascendingOrder,
    setAscendingOrder,
    orderBy,
    setOrderBy,
    search,
    reset
  }
}

export default useSearchBox