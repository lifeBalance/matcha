import React from 'react'

// import Map from '../components/Map'
import Map2 from '../components/Map2'
import { Checkbox, Label } from 'flowbite-react'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { setCoords, setManualLocation } from '../store/authSlice'

function Test() {
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
  as the MAP component loaded (it could be null if the user didn't 
  authorize the browser's geolocation API. */
  const [currentLoc, setCurrentLoc] = React.useState(null)

  console.log('current location: '+ JSON.stringify(currentLoc));
  /* LOCAL STATE for the center of the map that could be switched between:
      1. The location in GLOBAL STATE.
      2. The currentLoc LOCAL STATE. */
  const [center, setCenter] = React.useState({
    lat: coords.lat,
    lng: coords.lng
  })

  /* As soon as the Map component loads, we get the navigator's geolocation. If this browser's API is not authorized, the 
  'currentLoc' LOCAL STATE, stays null (its initial value). */
  React.useEffect(() => {
    // if (!navigator.geolocation) return
    function handleSuccess(pos) {
      setCurrentLoc({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      })
    }

    function handleError(err) {
      console.log(err)
    }

    console.log('navigator is ON!') // testing
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError)
  }, [])

  /* If the user set to MANUAL, she can set manually her location; if she
    turns MANUAL OFF, then we switcharoo the center to the 'currentLoc' 
    LOCAL STATE. */
  React.useEffect(() => {
    if (manual === false && currentLoc) setCenter(currentLoc)
    else {
      setCenter({ lat: coords.lat, lng: coords.lng })
    }

    console.log(center);
  }, [manual, currentLoc])

  /* The following hook, saves the center to GLOBAL STATE. */
  React.useEffect(() => {
    // We can't dispatch just 'center' bc is a non-serializable object!
    dispatch(setCoords({ lat: center.lat, lng: center.lng }))
  }, [center])

  return (
    <div className=''>
      <h1>Map 2</h1>
      <p className='text-white text-center font-bold'>
        {/* Lat: {loc.lat.toFixed(4)} Long: {loc.lng.toFixed(4)} */}
        {currentLoc && `Lat: ${currentLoc.lat} Long: ${currentLoc.lng}`}
      </p>
      <Map2 center={center} setCenter={setCenter} manual={manual} />

      <div className="flex items-center gap-2">
        <Checkbox
          id='manual'
          onChange={() => dispatch(setManualLocation(!manual))}
          checked={manual}
        />

        <Label htmlFor='manual' >
          <p className='text-white font-bold'>Set Manual Location</p>
        </Label>
      </div>

      <p className='text-white text-center font-bold'>
        Lat: {center.lat} Long: {center.lng} Manual: {manual.toString()}
      </p>
      {/* {console.log(typeof(center.lat))} */}
    </div>
  )
}

export default Test
