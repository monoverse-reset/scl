class Sheet{

  constructor ( gssId ) {

    this.gssId = gssId;

    return this;

  }

  /**
   * @param requiredRange array 範囲の指定
   * 1. [["シート名","A1"]]
   * 2. [["シート名",1,1]]
   * 3. [["シート名","A1:A5"]]
   * 4. [["シート名",1,1,5,1]]
   * 5. [["シート名","A1"],["シート名","B3"]]
   * @return range Range 
   */
  getRange( requiredRange ){

    if(Array.isArray(requiredRange)){

      const rangeArray = [] ;


      for (let i=0,l = requiredRange.length ; i<l;i++){

        switch ( requiredRange[i].length ) {

          case(2):

            rangeArray.push(

              `${requiredRange[i][0]}!${requiredRange[i][1]}`

            );
            break;
          
          case(3):

            rangeArray.push(

              `${requiredRange[i][0]}!${GSSUtils.toStringColIndex(requiredRange[i][2])}${requiredRange[i][1]}`

            )
            break;

          case(4):

          rangeArray.push(

            `${requiredRange[i][0]}!${GSSUtils.toStringColIndex(requiredRange[i][2])}${requiredRange[i][1]}:${GSSUtils.toStringColIndex(requiredRange[i][2])}${requiredRange[i][3] + requiredRange[i][1]-1}`

          )
          
          break;            

          case(5):

          rangeArray.push(

            `${requiredRange[i][0]}!${GSSUtils.toStringColIndex(requiredRange[i][2])}${requiredRange[i][1]}:${GSSUtils.toStringColIndex(requiredRange[i][4] + requiredRange[i][2]-1)}${requiredRange[i][3] + requiredRange[i][1]-1}`

          )
          
          break;

        }

      }

    return new Range(rangeArray,this.gssId);

    }else{

      console.log(typeof requiredRange,requiredRange)

      const errorMessage = "範囲の指定方法が異なります。";

      throw new Error(errorMessage);

    }
  }

}

class Range{

  constructor ( range , gssId) {

    this.gssId = gssId

    this.range = range;

    return this;

  }
  /**
   * @return values 
   */

  getValues(){

    const options = {

      ranges : this.range,

      majorDimension: "ROWS"

    }
    console.log(this.gssId,options)
    const values = Sheets.Spreadsheets
      　　　　　　　 　　.Values
      　　　　　　　　　 .batchGet(this.gssId, options)
      　　　　　　　　　 .valueRanges;

    const object = {};

    for (let i=0,l=values.length;i<l;i++) {

      const range = values[i]["range"].replace(/'/g, "");

   　　object[range] = values[i]["values"];
   　}

    return object;    

  }

  setValues(arr){

    const resource = {

      data : [],

      valueInputOption : "USER_ENTERED",

    };

    for (let i=0,l=arr.length;i<l;i++){

      resource.data.push({

        values : arr[i],

        range : this.range[i]

      })

    }
    
    Sheets.Spreadsheets.Values.batchUpdate(resource, this.gssId)

  }



}

const GSSUtils = {
     toNumericColIndex : function( string_col_index ) {

      const s = string_col_index.toUpperCase();

      let n = 0;

      for (let i=0,l=s.length; i<l; i++) {

        n = (n * RADIX) + (s.charCodeAt(i) - A + 1);

      }

      return n;

    },

    toStringColIndex :function( numeric_col_index ) {
      let n = numeric_col_index;
      let  s = "";
      while (n >= 1) {

        n--;

        s = String.fromCharCode(A + (n % RADIX)) + s;

        n = Math.floor(n / RADIX);
        
      }
      return s;
    }



  }
