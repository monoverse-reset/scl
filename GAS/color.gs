function getTeamColor() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("color");
  console.log(s.getDataRange().getValues())
}
