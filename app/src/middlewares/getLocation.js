// To extract user's IP from the request
const requestIP = require('request-ip')
// To extract user's location from the IP of the request
const geoip = require('geoip-lite')

/* Here we're gonna hang DIRECTLY in the Request object two properties:
  1. req.geoLoc: The user's location sent in the body of the Request.
  2. req.geoIpLoc: Her location based on the the IP of the request 
  (which we'll juice to get her latitude and longitude (not very 
  accurate, most of the times we get the location of her ISP). */
exports.getLocation = (req, res, next) => {
    // Using the 'ip' property of the Request object (native in Express)
    // const IP = req.ip

    // Using the 3rd party 'request-ip' package.
    // const IP = requestIP.getClientIp(req)

    /*  We gotta use some hardcoded IP during development and evaluation, 
      otherwise any of the methods above yield the IP of localhost 
      (IPv6 -> ::ffff:172.28.0.1) and if we feed that to geoip, we get 
      null, instead of information about the request (location, etc...) */
    // const IP = '37.110.95.9'       // Moscow
    const IP = '79.134.115.7'      // Helsinki - Leppasuonkatu
    // const IP = '??.??.??.??'      // Helsinki - HIVE
    const geoIpCoords = geoip.lookup(IP).ll

    req.geoIpLoc = { lat: geoIpCoords[0], lng: geoIpCoords [1] }

    console.log(`getLocation MW (geoip): 
                  ${JSON.stringify(req.geoIpLoc)}`) // testing

    /* Let's hang the location browser's geolocation received in the body 
    of the Request, directly in the Request object (it could be null). */
    req.geoLoc = req.body.liveLocation
    console.log(`getLocation MW (browser):
                  ${JSON.stringify(req.geoLoc)}`) // testing
  next()
}
