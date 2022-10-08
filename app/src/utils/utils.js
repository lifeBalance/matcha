exports.inrange = (val, lower, upper) => {
  // Check if 'val' is number (or numeric string), and is between a range of values.
  return  /^\d+$/.test(val) &&
          val >= Math.min(lower, upper) &&
          val <= Math.max(lower, upper)
}
