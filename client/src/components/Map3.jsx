import React from 'react'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { setGps } from '../store/authSlice'

// import { Checkbox, Label } from 'flowbite-react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function Map(props) {
  // redux
  const gps = useSelector(slices => slices.auth.gps)
  const dispatch = useDispatch()

  // const [center, setCenter] = React.useState({ lat: 0, lng: 0 })
  // const [manual, setManual] = React.useState(false)

  // React.useEffect(() => {
  //   if (gps.manual === false && navigator.geolocation) {
  //     console.log('triggered')
  //     /* Later here, we'll get the CENTER state from Settings (GET => /settings)
  //       A good idea would be to write the LOCATION as object to Local storage,
  //       and setting in the state that will be sent to the DB. */
  //     navigator.geolocation.getCurrentPosition(pos => {
  //       dispatch(setGps({
  //         ...gps,
  //         lat: pos.coords.latitude,
  //         lng: pos.coords.longitude
  //       }))
  //     })
  //   }
  // }, [gps.manual])

  // const handleCheckbox = () => dispatch(setGps({
  //   ...gps,
  //   manual: !gps.manual
  // }))

  function SetView(props) {
    const map = useMap()
    // console.log(props.center)   // testing
    map.setView(props.center, map.getZoom());

    return null
  }

  function LocationMarker() {
    const map = useMapEvents({
      click() { map.locate() },

      locationfound(e) {
        dispatch(setGps({
          ...gps,
          lat: e.latlng.lat,
          lng: e.latlng.lng
        }))
        // setCenter(e.latlng)
        // console.log(e.latlng)   // testing
        map.flyTo({lat: gps.lat, lng: gps.lng}, map.getZoom())
        // map.flyTo(e.latlng, map.getZoom())
      },
    })

    return gps.lat === 0 && gps.lng === 0 ? null : (
      <Marker position={[gps.lat, gps.lng]}>
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
            dispatch(setGps({
              ...gps,
              lat: marker.getLatLng().lat,
              lng: marker.getLatLng().lng
            }))
            // console.log(marker.getLatLng())
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
        position={{ lat: gps.lat, lng: gps.lng }}
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
      <MapContainer
        style={{ height: 380, width: 375 }}
        center={{lat: gps.lat, lng: gps.lng}}
        zoom={12}
        scrollWheelZoom={false}
      >
        <SetView center={{lat: gps.lat, lng: gps.lng}} />

        {gps.manual ? (<>
          <DraggableMarker />
        </>) : (<>
          <LocationMarker />
        </>)}
        {/* <LocationMarker /> */}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
      </MapContainer>
    </div>
  )
}

export default Map
