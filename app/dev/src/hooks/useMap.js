import React from 'react'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import {
  setLocation,
  setManualLocation,
  loginAfterReload
} from '../store/authSlice'

function useMap() {
  // redux
  const dispatch = useDispatch()
  const { isLoggingIn, isLoggedIn } = useSelector(slices => slices.auth)

  /*  The 'liveLocation' GLOBAL STATE was set at LOG IN, and it may contain:
    1. The user's navigator geolocation (if the browser API was authorized)
    2. The user's IP geolocation (sent from the server). */
  const liveLocation = useSelector(slices => slices.auth.liveLocation)

  /* The 'location' GLOBAL STATE will contain whatever location was stored
    in DB. It could be:
      1. null, at 1st LOGIN.
      2. The browser's geolocation.
      3. The user's IP location. */
  const location = useSelector(slices => slices.auth.location)

  /* The location in our GLOBAL STATE; it could contain either:
      1. The navigator's geolocation set at LOG IN.
      2. The user's IP geolocation set at LOG IN.
      3. After the 1st LOGIN, the MANUAL location set in settings */
  const manualLocation = useSelector(slices => slices.auth.manualLocation)

  // console.log('location: '+ JSON.stringify(location));
  // console.log('liveLocation: '+ JSON.stringify(liveLocation));

  /* LOCAL STATE for the center of the map that could be switched between:
      1. The 'location' in GLOBAL STATE (last location in DB).
      2. The 'liveLocation' LOCAL STATE (either from IP or browser). */
  const [center, setCenter] = React.useState({
    lat: 0,
    lng: 0
  })

  /* If the user has MANUAL on, we set the center to that point. 
    But if MANUAL is off, we set the center of the map to the coordinates
    set in the 'liveLocation' GLOBAL STATE (browser geolocation). */
  React.useEffect(() => {
    if (manualLocation &&
        location.lat !== 0 &&
        location.lng !== 0)
    {
      setCenter({ lat: location.lat, lng: location.lng })
      // console.log(location)
    } else if ( manualLocation === false &&
                liveLocation.lat !== 0 &&
                liveLocation.lng !== 0)
    {
      setCenter({ lat: liveLocation.lat, lng: liveLocation.lng })
      // console.log(liveLocation)
    }
    // console.log(`CENTER: ${JSON.stringify(center)}`)   // testing
  }, [manualLocation, liveLocation, manualLocation])

  /*  The following hook, saves the center to the 'location' GLOBAL STATE 
    as soon as the hook in invoked, and also whenever a change in the 
    'center' LOCAL STATE is detected. This state is also modified whenever
    the marker is manually set (when MANUAL is on). */
  React.useEffect(() => {
    // console.log(`'location' was set to new 'center':
    //                   ${center.lat} - ${center.lng}`)   // testing
    /* We need the IF statement there, bc when we reload, the 'center'
      local state is set to 0, and so the dispatch call is made, before
      the 'location' GLOBAL State has the chance to be restored from
      the browser's local storage!
      We can't dispatch just 'center' bc is a non-serializable object!
    */
    if (center.lat !== 0 && center.lng !== 0)
      dispatch(setLocation({ lat: center.lat, lng: center.lng }))
  }, [center])

  React.useEffect(() => {
    if (isLoggingIn) return
    const matcha = localStorage.getItem('matcha')
    if (!isLoggedIn && matcha) dispatch(loginAfterReload(matcha))
  }, [isLoggingIn, isLoggedIn])

  return {
    center,
    setCenter,
    manualLocation,
    setManualLocation
  }
}

export default useMap