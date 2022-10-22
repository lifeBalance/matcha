import React from 'react'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setCoords, setManualLocation } from '../store/authSlice'

function useMap() {
  // redux
  const dispatch = useDispatch()
  /* Let's use here the 'manual' state from GLOBAL STATE! */
  const manual = useSelector(slices => slices.auth.gps.manual)

  /* The location in our GLOBAL STATE; it could contain either:
      1. The navigator's geolocation set at LOG IN.
      2. The user's IP geolocation set at LOG IN.
      3. After the 1st LOGIN, the MANUAL location set in settings */
  const coords = useSelector(slices => slices.auth.gps.coords)

  /* A LOCAL state with the navigator's geolocation obtained as soon 
  as the MAP component loaded (it could be NULL if the user didn't 
  authorize the browser's geolocation API. */
  const [currentLoc, setCurrentLoc] = React.useState(null)

  console.log('current location: '+ JSON.stringify(currentLoc));
  /* LOCAL STATE for the center of the map that could be switched between:
      1. The location in GLOBAL STATE.
      2. The 'currentLoc' LOCAL STATE. */
  const [center, setCenter] = React.useState({
    lat: coords.lat,
    lng: coords.lng
  })

  /* As soon as the Map component loads, we get the navigator's geolocation. 
    If the user hasn't give permission to this browser's API , the 
    'currentLoc' LOCAL STATE, stays null (its initial value). */
  React.useEffect(() => {
    // if (!navigator.geolocation) return
    function handleSuccess(pos) {
      setCurrentLoc({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      })
    }

    function handleError(err) { console.log(err) }

    console.log('navigator is ON!') // testing
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError)
  }, [])

  /* If the user turns MANUAL on, we switcharoo the center to the 'currentLoc' 
    LOCAL STATE; otherwise we use the 'coords' GLOBAL STATE. */
  React.useEffect(() => {
    if (manual === false && currentLoc) setCenter(currentLoc)
    else {
      setCenter({ lat: coords.lat, lng: coords.lng })
    }
    console.log(center)   // testing
  }, [manual, currentLoc])

  /* The following hook, saves the center to GLOBAL STATE whenever a change 
    in the 'center' LOCAL STATE is detected. */
  React.useEffect(() => {
    // We can't dispatch just 'center' bc is a non-serializable object!
    dispatch(setCoords({ lat: center.lat, lng: center.lng }))
  }, [center])

  return {
    center,
    setCenter,
    manual,
    setManualLocation
  }
}

export default useMap