// src/routes/csv-endpoint.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { csvParse } from 'd3-dsv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function get(request) {
    try {
        const csvPath = path.join(__dirname, '..', '..', 'static', 'static', 'uscounties.csv');
        const csvData = fs.readFileSync(csvPath, 'utf-8');
        const parsedData = csvParse(csvData);
        return {
            status: 200,
            body: parsedData,
        };
    } catch (error) {
        return {
            status: 500,
            body: { error: 'Failed to load CSV data' },
        };
    }
}
