import React from 'react'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setCoords, setManualLocation } from '../store/authSlice'

function useMap() {
  // redux
  const dispatch = useDispatch()
  /*  The 'currentLocation' GLOBAL STATE was set at LOG IN, and it may contain:
    1. The user's navigator geolocation (if the browser API was authorized)
    2. The user's IP geolocation (sent from the server). */
  const currentLocation = useSelector(slices => slices.auth.currentLocation)
  /* Let's use here the 'manual' state from GLOBAL STATE! */
  const manual = useSelector(slices => slices.auth.gps.manual)

  /* The location in our GLOBAL STATE; it could contain either:
      1. The navigator's geolocation set at LOG IN.
      2. The user's IP geolocation set at LOG IN.
      3. After the 1st LOGIN, the MANUAL location set in settings */
  const coords = useSelector(slices => slices.auth.gps.coords)

  console.log('current location: '+ JSON.stringify(currentLocation));
  /* LOCAL STATE for the center of the map that could be switched between:
      1. The location in GLOBAL STATE.
      2. The 'currentLoc' LOCAL STATE. */
  const [center, setCenter] = React.useState({
    lat: coords.lat,
    lng: coords.lng
  })

  /* If the user has MANUAL on, and the coordinates of the GPS global 
    state have been initialized, we set the center to tha point. 
    But if MANUAL is off, we set the center of the map to the coordinates
    set in the 'currentLocation' GLOBAL STATE (browser geolocation). */
  React.useEffect(() => {
    if (manual && coords.lat !== 0 && coords.lng !== 0)
      setCenter({ lat: coords.lat, lng: coords.lng })
    else if (manual === false && currentLocation)
      setCenter({
        lat: currentLocation.coords.lat,
        lng: currentLocation.coords.lng
      })

    console.log(center)   // testing
  }, [manual, currentLocation])

  /*  The following hook, saves the center to the 'gps' GLOBAL STATE 
    whenever a change in the 'center' LOCAL STATE is detected. This 
    'center' local state is modified with the marker (and MANUAL is on). */
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