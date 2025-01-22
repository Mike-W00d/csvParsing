const { parseCSV, generateOutputData, writeOutputCSV } = require('./index');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

describe('index', () => {
  describe('parseCSV', () => {
    it('should parse the CSV correctly', async () => {
      const results = await parseCSV('schedule.csv');
      expect(results).toEqual([
        { timestamp: '2025-01-01T01:00:00Z', height: 10 },
        { timestamp: '2025-01-01T02:00:00Z', height: 15 },
        { timestamp: '2025-01-01T03:00:00Z', height: 15 },
        { timestamp: '2025-01-01T04:00:00Z', height: 13 },
        { timestamp: '2025-01-04T05:00:00Z', height: 5 },
        { timestamp: '2025-01-04T06:00:00Z', height: 3 },
      ]);
    });
  });

  describe('generateOutputData', () => {
    it('should generate the correct output data', () => {
      const schedule = [
        { timestamp: '2025-01-01T01:00:00Z', height: 10 },
        { timestamp: '2025-01-01T02:00:00Z', height: 15 },
        { timestamp: '2025-01-01T03:00:00Z', height: 15 },
      ];
      const output = generateOutputData(schedule);
      expect(output).toEqual([
        { timestamp: '2025-01-01T01:00:00Z', height: 10 },
        { timestamp: '2025-01-01T01:57:30Z', height: 10 },
        { timestamp: '2025-01-01T02:02:30Z', height: 15 },
      ]);
    });
  });

  describe('writeOutputCSV', () => {
    it('should write the output CSV correctly', () => {
      const outputData = [
        { timestamp: '2025-01-01T01:00:00Z', height: 10 },
        { timestamp: '2025-01-01T01:57:30Z', height: 10 },
        { timestamp: '2025-01-01T02:02:30Z', height: 15 },
      ];
      const filePath = 'output.csv';
      writeOutputCSV(outputData, filePath);
      const data = fs.readFileSync(filePath, 'utf8');
      expect(data).toBe('timestamp,height\n2025-01-01T01:00:00Z,10\n2025-01-01T01:57:30Z,10\n2025-01-01T02:02:30Z,15\n');
  });
});

});