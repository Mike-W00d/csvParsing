/// imports the necessary modules
const csv = require('csv-parser');
const moment = require('moment');
const path = require('path');
const { convertArrayToCSV } = require('convert-array-to-csv');
const converter = require('convert-array-to-csv');
const fs = require('fs');
const { parsed } = require('yargs');


const parseCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        if (data.height) {
          const parsedHeight = parseInt(data.height, 10);
          if (!isNaN(parsedHeight)) {
            data.height = parsedHeight;
          }
        }
        results.push(data);
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(console.log(`Error reading the CSV file: ${err.message}`)));
  });
};

const generateOutputData = (schedule) => {
  const output = [];
  const movementSpeed = 1; // Movement speed in meters per minute

  // Add the first point to the output
  output.push(schedule[0]);

  // Loop through the schedule to calculate movement points
  for (let i = 0; i < schedule.length - 1; i++) {
      const current = schedule[i];
      const next = schedule[i + 1];
      const heightDifference = next.height - current.height;

      if (heightDifference !== 0) {
          const halfDistance = Math.abs(heightDifference) / 2;
          const halfTime = halfDistance / movementSpeed;

          // Calculate start and end movement times
          const startMovingTime = moment(next.timestamp).subtract(halfTime, 'minutes').format('YYYY-MM-DDTHH:mm:ss[Z]');
          const endMovingTime = moment(next.timestamp).add(halfTime, 'minutes').format('YYYY-MM-DDTHH:mm:ss[Z]');

          // Add intermediate points to the output
          output.push({ timestamp: startMovingTime, height: current.height });
          output.push({ timestamp: endMovingTime, height: next.height });
      }
  }
  return output;
}

const writeOutputCSV = (outputData, filePath) => {
  const csvFromArrayOfObjects = convertArrayToCSV(outputData);

  fs.writeFile(filePath, csvFromArrayOfObjects, function (err) {
  if (err) return console.log(err);
  console.log('File saved');
});
}

module.exports = { parseCSV, generateOutputData, writeOutputCSV };