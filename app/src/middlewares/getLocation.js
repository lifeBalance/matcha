// To extract user's location from the IP of the request
const geoip = require('geoip-lite')
const requestIP = require('request-ip')

exports.getLocation = (req, res, next) => {
  /* If the Request body doesn't include a 'gps' property, we use the IP of
  the request and feed it to geoip to juice the latitude and longitude. */
  if (!req.body.gps) {
    // const IP = req.ip
    // const IP = requestIP.getClientIp(req)

    /* We gotta hardcode the IP during development, otherwise we get the IP of
    localhost (::ffff:172.28.0.1) and if we feed that to geoip, we get null */
    // const IP = '37.110.95.9'       // Moscow
    const IP = '79.134.115.7'      // Leppasuonkatu
    // const IP = '??.??.??.??'      // HIVE
    const coord = geoip.lookup(IP).ll

    req.gps = {
      coords: { lat: coord[0], lng: coord[1] },
      manual: false
    }
    console.log('getLocation MW (geoip): '+JSON.stringify(req.gps)) // testing
  } else {
    /* If the body of the Request did include the gps coordinates, 
      let's hang them better in req.gps */
    req.gps = req.body.gps
    console.log('getLocation MW (browser): '+JSON.stringify(req.gps)) // testing
  }
  // console.log('getLocation MW (geoip - lat): '+geo?.ll[0])  // testing
  // console.log('getLocation MW (geoip - lng): '+geo?.ll[1])  // testing

  next()
}
