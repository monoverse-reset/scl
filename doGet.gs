function doGet(e){
  const teamA = e.parameter.team_a;
  const teamB = e.parameter.team_b;
  const yesterday = new Date().getTime()-86400000;
  let a = 0;
  let b = 0;
  let outPut = `>>> `;
  const sheet = new Sheet(GSSID);
  const data = sheet.getRange([["data","A1:E"]]).getValues()["data!A1:E"];
  for(let i=0;i<max;i++){
    const v = data[i];
    if( (v[1]===teamA&&v[2]===teamB)  && v[0].getTime() > yesterday ){
      outPut += `○ ${v[3]} vs ${v[4]} ×\n`;
      a += 1;
    }else if(v[1]===teamB&&v[2]===teamA && v[0].getTime() > yesterday){
      outPut += `× ${v[4]} vs ${v[3]} ○\n`;
      b += 1;
    }
  }
  return response(`◆ ${teamA} ${a} vs ${b} ${teamB}\n`+outPut);
}

function response (content) {
  const res = ContentService.createTextOutput()
  // レスポンスの Content-Type ヘッダーに "application/json" を設定する
  res.setMimeType(ContentService.MimeType.JSON)
  // オブジェクトを文字列にしてからレスポンスに詰め込む
  res.setContent(JSON.stringify(content))
  return res
}
