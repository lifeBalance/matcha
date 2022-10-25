const geoip = require('geoip-lite')

exports.testsGet = async (req, res, next) => {
  // const IP = req.ip
  /* We gotta hardcode the IP during development, otherwise we get the IP of
  localhost (::ffff:172.28.0.1) and if we feed that to geoip, we get null */
  const IP = '79.134.115.7'
  const geo = geoip.lookup(IP)

  console.log(geo.ll)

  res.status(200).json({
    message: 'da feedback',
    ip: IP,
    coordinates: geo.ll,
    city: geo.city
  })
}
