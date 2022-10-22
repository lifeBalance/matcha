import React from 'react'

// import Map from '../components/Map'
import Map from '../components/Map'
import { Checkbox, Label } from 'flowbite-react'

// Redux
import { useDispatch, useSelector } from 'react-redux'

// hooks
import useMap from '../hooks/useMap'

function Test() {
  // redux
  const dispatch = useDispatch()

  // hook
  const {
    center,
    setCenter,
    manual,
    setManualLocation
  } = useMap()

  return (
    <div className=''>
      <h1>Map</h1>
      <p className='text-white text-center font-bold'>
        {/* Lat: {loc.lat.toFixed(4)} Long: {loc.lng.toFixed(4)} */}
        {/* {currentLoc && `Lat: ${currentLoc.lat} Long: ${currentLoc.lng}`} */}
      </p>
      <Map center={center} setCenter={setCenter} manual={manual} />

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
