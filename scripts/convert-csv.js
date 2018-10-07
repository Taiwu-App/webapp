const fs = require('fs');
const Papa = require('papaparse');
const path = './src/assets/data';
const allFiles = fs.readdirSync(path);

const convertCSV = function(fileName) {
  const filePath = `${path}/${fileName}.csv`;
  const csvString = fs.readFileSync(filePath).toString('utf-8');
  // console.log(csvString);
  const json = Papa.parse(csvString, { header: true,  comments: '#' });
  if (!fs.existsSync('./csv-converted')){
    fs.mkdirSync('./csv-converted');
  }
  const file = { default: json.data };
  fs.writeFileSync(`./csv-converted/${fileName}.json`,JSON.stringify(file));
};

const regex = /(.*).csv/;
const fileNames = allFiles.map(f => f.match(regex))
.filter(f => f !== null)
.map(f => f[1]);

fileNames.forEach(f => {
  const filePath = `${path}/${f}.csv`;
  convertCSV(f);
  fs.watchFile(filePath, () => {
    convertCSV(f)
  });
});