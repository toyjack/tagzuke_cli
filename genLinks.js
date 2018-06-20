const prog = require('caporal');
const XLSX = require('xlsx');
const XRegExp = require('xregexp');

XRegExp.install('astral');

const serprator = '　'

let book;
let data;
let sheetNum = 0;
let fieldNum = 8;
let tags = ['<jion>', '<wakun>', '<kanbun>']
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
      let mark= data[i].mark;
      if (mark=='〇'){
        flag=data[i].KRID;
      }
      if(mark==null){
        data[i].mark=flag;
      }
    }
    logger.warn('saving file to out.xls')
    save_file();
  });

prog.parse(process.argv);


function open_excelFile(excelFile) {
  book = XLSX.readFile(excelFile);
}

function save_file() {
  let ws = XLSX.utils.json_to_sheet(data);
  let wb = {
    SheetNames: [],
    Sheets: {}
  };
  wb.Props = {
    Title: "tagzuke!",
    Author: "Guanwei Liu"
  };
  var ws_name = "シート１";
  XLSX.utils.book_append_sheet(wb, ws, ws_name);
  XLSX.writeFile(wb, 'out.xlsx');
}
