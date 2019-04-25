/**
 * Example filter code for an Open Data Portal trigger applet
 */

const outages = JSON.parse(
  CityOfEdmontonHenryStaging.lrtEscalatorElevatorOutages.Outages
)
const backInService = JSON.parse(
  CityOfEdmontonHenryStaging.lrtEscalatorElevatorOutages.Fixed
)
const formatOutages = outages
  .map((entry: any) => {
    return `\n- ${entry.lrt_station_name} ${entry.device_type}: ${
      entry.lrt_device_location
    }`
  })
  .sort()
const formatFixed = backInService
  .map((entry: any) => {
    return `\n- ${entry.lrt_station_name} ${entry.device_type}: ${
      entry.lrt_device_location
    }`
  })
  .sort()

AndroidMessages.sendAMessage.setText(
  `LRT Escalator/Elevator Outages:\n\nOutages:${formatOutages}\n\nRecently Fixed:${formatFixed}`
)
