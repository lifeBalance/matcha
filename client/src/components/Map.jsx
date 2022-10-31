import React from 'react'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function Map(props) {
  function SetView({ center }) {
    const map = useMap()
    // console.log(center)   // testing
    map.setView(center, map.getZoom());

    return null
  }

  function LocationMarker() {
    return (
      <Marker position={props.center}>
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
            props.setCenter(marker.getLatLng())
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
        position={props.center}
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
        style={{ height: 380, width: 360 }}
        center={props.center}
        zoom={12}
        scrollWheelZoom={false}
      >
        <SetView center={props.center} />

        { props.manual ? <DraggableMarker /> : <LocationMarker /> }

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
      </MapContainer>
    </div>
  )
}

export default Map
