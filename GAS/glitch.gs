function send(){
 	const URL = "";
 	const headers =  {
 		'contentType': 'application/json; charset=utf-8',
 		'method': 'post',
 		'muteHttpExceptions': true
   };
   request.post(URL,{type : "wake"},headers);
 }
 
 const request = {

  post : ( url,param,headers ) =>{

    headers = headers?headers:{"Content-Type":"application/json"};

    const option = {};

    option.method = "POST";

    option.payload = JSON.stringify(param);

    option.headers = headers;
    
    const res = UrlFetchApp.fetch(url,option).getContentText();
    if(res){
      return JSON.parse(res);
    }
    return res;
  },
  get : (url,param)=>{
    
    url = param?`${url}?${Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')}`:url;

    const res = UrlFetchApp.fetch(url).getContentText();

    if(res){

      return JSON.parse(res);

    }

    return res;


  }

}
