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
    for (let i in data) {
      let defs = data[i].defs;
      if (defs != null) {
        defs = defs.split(serprator);
        for (let j in defs) {
          defs[j] = check_def(defs[j]);
        }
        // defs=Array.from(new Set(defs.sort()))
        data[i].defs = defs.join(serprator)

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

function check_def(def) {
  if (XRegExp("<").test(def)) {
    return def
  }
  let rules = [{
      tag: '<jion>',
      regex: '[平上去入]声',
      attr: ''
    },
    {
      tag: '<jion>',
      regex: '^[上下]?[又亦呉和俗正]?[一二三四]?(又)?音',
      attr: ''
    },
    {
      tag: '<jion>',
      regex: '音$',
      attr: ''
    },
    {
      tag: '<jion>',
      regex: '[反切]$',
      attr: ''
    },
    {
      tag: '<jion>',
      regex: '^[和禾].',
      attr: '' //呉音
    },
    {
      tag: '<wakun>',
      regex: '\\p{Katakana}.*',
      attr: ''
    },
    {
      tag: '<jitai>',
      regex: '[俗正或古篆今通作]',
      attr: ''
    },
    {
      tag: '<kanbun>',
      regex: '也$',
      attr: ''
    },
    {
      tag: '<etc>',
      regex: '同|同訓|不詳|又',
      attr: ''
    },
    {
      tag: '<kanbun>',
      regex: '\\p{Han}|ー',
      attr: ''
    },
  ]
  for (let i in rules) {
    def = def.replace(/\([^)]+\)/, '');
    def = def.replace(/（[^）]+）/, '');
    if (XRegExp(rules[i].regex).test(def)) {
      let endTag = rules[i].tag.replace(/</, '</')
      return rules[i].tag + def + endTag
      // return rules[i].tag
    }
  }
  if(def != '') {
    return '<unknown>' + def + '</unknown>'
  }
}