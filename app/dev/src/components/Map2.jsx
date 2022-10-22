import React from 'react'

import { Checkbox, Label } from 'flowbite-react'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { setManualLocation } from '../store/authSlice'

function Map2() {
  // redux
  const dispatch = useDispatch()
  /* Let's use here the 'manual' state from GLOBAL STATE! */
  const manual = useSelector(slices => slices.auth.gps.manual)

  /* The location in our GLOBAL STATE; it could contain either:
      1. The navigator's geolocation set at LOG IN.
      2. The user's IP geolocation set at LOG IN.
      3. After the 1st LOGIN, the MANUAL location set in settings */
  const gps = useSelector(slices => slices.auth.gps)

  /* A LOCAL state with the navigator's geolocation obtained as soon 
  as the MAP component loaded (it could be null if the user didn't 
  authorize the browser's geolocation API. */
  const [currentLoc, setCurrentLoc] = React.useState(null)

  /* LOCAL STATE for the center of the map that could be switched between:
      1. The location in GLOBAL STATE.
      2. The currentLoc LOCAL STATE. */
  const [center, setCenter] = React.useState({
    lat: gps.lat.toFixed(4),
    lng: gps.lng.toFixed(4)
  })

  /* As soon as the Map component loads, we get the navigator's geolocation. If this browser's API is not authorized, the 
  'currentLoc' LOCAL STATE, stays null (its initial value). */
  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => setCurrentLoc(pos)) 
  }, [])

  /* If the user set to MANUAL, she can set manually her location; if she
    turns MANUAL OFF, then we switcharoo the center to the 'currentLoc' 
    LOCAL STATE. */
  React.useEffect(() => {
    if (manual === false && currentLoc) {
      setCenter({
        lat: currentLoc.coords.latitude.toFixed(4),
        lng: currentLoc.coords.longitude.toFixed(4),
      })
    } else {
      setCenter({
        lat: gps.lat.toFixed(4),
        lng: gps.lng.toFixed(4)
      })
    }
    console.log(center);
  }, [manual, currentLoc])

  // const handleCheckbox = () => dispatch(setManualLocation(!manual))

  function SetView() {
    const map = useMap()
    // console.log(center)   // testing
    map.setView({
      lat: center.lat,
      lng: center.lng
    }, map.getZoom());

    return null
  }

  function LocationMarker() {
    return (
      <Marker position={center}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  function DraggableMarker() {
    const [draggable, setDraggable] = React.useState(false)
    const markerRef = React.useRef(null)
    const eventHandlers = React.useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            setCenter(marker.getLatLng())
            console.log(marker.getLatLng())
          }
        },
      }),
      [],
    )
    const toggleDraggable = React.useCallback(() => {
      setDraggable((d) => !d)
    }, [])

    return (
      <Marker
        draggable={draggable}
        eventHandlers={eventHandlers}
        position={center}
        ref={markerRef}
      >
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {draggable
              ? 'You can set your position'
              : 'Click here to set your position'}
          </span>
        </Popup>
      </Marker>
    )
  }

  return (
    <div className='z-0 rounded-md'>
      <p className='text-white text-center font-bold'>
        {/* Lat: {loc.lat.toFixed(4)} Long: {loc.lng.toFixed(4)} */}
        {currentLoc && `Lat: ${currentLoc.lat} Long: ${currentLoc.lng}`}
      </p>
      <MapContainer
        style={{ height: 380, width: 375 }}
        center={center}
        zoom={12}
        scrollWheelZoom={false}
      >
        <SetView />

        { manual ? <DraggableMarker /> : <LocationMarker /> }

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
      </MapContainer>

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

export default Map2
