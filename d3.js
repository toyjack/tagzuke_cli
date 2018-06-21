const d3= require('d3');
const XLSX= require('xlsx');
const fs = require('fs');

const workBook=XLSX.readFile('./pid_test.xlsx');
const sheet = workBook.Sheets[workBook.SheetNames[0]];
let data = XLSX.utils.sheet_to_json(sheet);

let root = d3.stratify()
    .id(function(d) { return d.ID; })
    .parentId(function(d) { return d.parentID; })
    (data);


    seen = []; 

    var replacer = function(key, value) {
      if (value != null && typeof value == "object") {
        if (seen.indexOf(value) >= 0) {
          return;
        }
        seen.push(value);
      }
      return value;
    };

fs.writeFileSync('./out.json', JSON.stringify(root,replacer) , 'utf-8'); 

console.log(seen)