function sortNumber(a: number, b: number) {
  return a - b
}

if (CityOfEdmontonHenryStaging.openData.DataSet == "LRT Elevator/Escalator Outages") {
  const columnValues = JSON.parse(CityOfEdmontonHenryStaging.openData.ColumnValues).sort(sortNumber)
  const outages = JSON.parse(CityOfEdmontonHenryStaging.openData.AllValues).map((entry: any) => {
    return ` ${entry.lrt_station_name}: ${entry.lrt_device_location} (id: ${entry.device_id})`
  }).sort()

  Email.sendMeEmail.setSubject("LRT Elevator/Escalator Outages")
  Email.sendMeEmail.setBody(`
    Column being watched: ${CityOfEdmontonHenryStaging.openData.Column} ||
    Returned column values: ${columnValues} ||
    Number of updated columns: ${columnValues.length} ||
    Outages: ${outages}
  `)
}