/**
 * This script will download the images
 * associated with the MET dataset
 * collection listed in `../data/met.csv`.
 *
 * It uses puppeteer to open the details page
 * for each artwork and download the image
 * file locally. The data should be filtered
 * beforehand to select only images which are
 * released in the public domain.
 *
 * - mathisonian
 */
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}


const fs = require('fs');
const puppeteer = require('puppeteer');
const Papa = require('papaparse');

const promisify = require('util').promisify;

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

(async () => {

  const csvString = await readFile(__dirname + '/../data/met.csv', 'utf-8');
  // const parseResults = Papa.parse(csvString);
  // console.log(parseResults);
  const artworks = Papa.parse(csvString, { header: true }).data;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await asyncForEach(artworks, async (artwork) => {
    // console.log(artwork);
    // console.log(artwork['Object Number']);
    console.log(artwork['Link Resource']);
    await page.goto(artwork['Link Resource']);
    const img = await page.$('#artwork__image');
    await img.screenshot({
      path: `${__dirname}/../static/images/met/${artwork['Object ID']}.jpg`,
      omitBackground: true,
    });
  })

  await browser.close();
})();


