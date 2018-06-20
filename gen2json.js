const prog = require('caporal');
const XLSX = require('xlsx');
const fs=require('fs');

let book;
let data;
let sheetNum = 0;

prog
  .version('0.0.1')
  .description('A cli for tagzuke (in development).')
  .argument('<excel_file>', 'Excel file to open', /.+\.[xls|xlsx]/)
  .action(function (args, options, logger) {
    logger.info('Opening' + args.excelFile + '...')
    open_excelFile(args.excelFile)
    logger.info('Done!')
    logger.info('以下' + book.SheetNames.length + 'つのシートがあります：')
    for (let i in book.SheetNames) {
      logger.info(book.SheetNames[i]);
    }
    let sheet = book.Sheets[book.SheetNames[sheetNum]];
    data = XLSX.utils.sheet_to_json(sheet);
    console.log(Object.keys(data[0]))
    console.log('処理開始')
    let flag='';
    for (let i in data) {
      let volName= data[i].KR_vol_name;
      let radical=  data[i].KR_radical;
      let entry = data[i].Entry;
      let mark= data[i].mark;
      
    }
    logger.warn('saving file to out.xls')
    save_file();
  });

prog.parse(process.argv);


function open_excelFile(excelFile) {
  book = XLSX.readFile(excelFile);
}

function save_file() {
  fs.writeFileSync('./out.json', JSON.stringify(data, null, 2) , 'utf-8'); 
}
