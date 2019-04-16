function sortNumber(a: number, b: number) {
  return a - b
}

if (CityOfEdmontonHenryStaging.openData.DataSet == "LRT Elevator/Escalator Outages") {
  const columnValues = JSON.parse(CityOfEdmontonHenryStaging.openData.ColumnValues).sort(sortNumber)
  const outages = JSON.parse(CityOfEdmontonHenryStaging.openData.AllValues).map((entry: any) => {
    return `<br> - ${entry.lrt_station_name}: ${entry.lrt_device_location} (id: ${entry.device_id})</br>`
  }).sort()
  const diff = JSON.parse(CityOfEdmontonHenryStaging.openData.Difference)
  const newRows = diff.new.sort(sortNumber)
  const removedRows = diff.removed.sort(sortNumber)

  Email.sendMeEmail.setSubject("LRT Elevator/Escalator Outages")
  Email.sendMeEmail.setBody(`
    <br>Column being watched: ${CityOfEdmontonHenryStaging.openData.Column}</br>
    <br>Returned column values: ${columnValues}</br>
    <br>Number of updated columns: ${newRows.length + removedRows.length}</br>
    <br>New: ${newRows}</br>
    <br>Removed: ${removedRows}</br>
    <br>Outages: ${outages}</br>
  `)
}