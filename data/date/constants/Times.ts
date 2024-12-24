enum Times {
  MILLIS_IN_SECOND = 1000,
  SECONDS_IN_MINUTE = 60,
  MINUTES_IN_HOUR = SECONDS_IN_MINUTE,
  HOURS_IN_DAY = 24,
  MILLIS_IN_MINUTE = MILLIS_IN_SECOND * SECONDS_IN_MINUTE,
  MILLIS_IN_HOUR = MILLIS_IN_MINUTE * MINUTES_IN_HOUR,
  MILLIS_IN_DAY = MILLIS_IN_HOUR * HOURS_IN_DAY,
  SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR,
}
export default Times;