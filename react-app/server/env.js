/** InfluxDB v2 URL */
const url = process.env['INFLUX_URL'] || 'http://localhost:9999'
/** InfluxDB authorization token */
const token = process.env['INFLUX_TOKEN'] || 'my-token'
/** Organization within InfluxDB URL  */
const org = process.env['INFLUX_ORG'] || 'my-org'
/**InfluxDB bucket used in examples  */
const bucket = 'telegraf'

module.exports = {
  url,
  token,
  org,
  bucket,
}