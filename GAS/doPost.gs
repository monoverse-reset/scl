function doPost(e) {
  const postData = JSON.parse(e.postData.contents);
  if(postData.type === "result") {
    const data = JSON.parse(ScriptProperties.getProperty("data")).map(elem => [new Date(elem[0]),...elem.slice(1)]);
    let param;
    try{
      param = JSON.parse(postData.contents);
    }catch{
      param = postData.contents;
    }
    data.push([new Date(),...param]);
    const status = getStatus(param[0],param[1],data)
    ScriptProperties.setProperty("data",JSON.stringify(data));
    return response(
      {
        status : status[0],
        round  : status[1]
      }
    )
  }else if(postData.type === "deck") {
    const sv_class = ["E","R","W","D","Nc","V","B","Nm"];
    const contents = postData.contents;
    let text = "";
    contents.slice(4,12).forEach((elem,i) => {
      if(elem){
        text += `\n ${sv_class[i]} : ${elem}`;
      }
    })
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("deck").appendRow([new Date(),...contents,text,false]);
    const obj = { 
      content : "登録が完了しました！\n--------------------------"+text,
      ephemeral : true,
    };
    if(contents[12]){
      obj.files = [contents[12]];
    }
    return response(obj);
  } 
}


Date.prototype.toJSON = function() {
    return Utilities.formatDate(this,"JST","yyyy/MM/dd HH:mm:ss");
}

function update(){
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("data");
  const data = JSON.parse(ScriptProperties.getProperty("data"));
  sheet.getRange(2,1,data.length,data[0].length).setValues(data);
  //ScriptProperties.setProperty("data","[]");
}

function setUp(){
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("data");
  ScriptProperties.setProperty("data",
    JSON.stringify(sheet.getDataRange().getValues().slice(1))
  );
}


function getStatus(team1,team2,data){
  let a = 0;
  let b = 0;
  let r = 0;
  const yesterday = new Date().getTime()-86400000;
  for (let i=0,l=data.length;i<l;i++){
    const isRecently =  data[i][0].getTime() > yesterday;
    if(data[i][1]===team1 && data[i][2]===team2 && isRecently){
      a += 1;
      r += 1;
    }else if(data[i][1]===team2 && data[i][2]===team1 && isRecently){
      b += 1;
      r += 1;
    }
  }
  return [`${team1} ${a} - ${b} ${team2}`,`Round ${r}`];
}
