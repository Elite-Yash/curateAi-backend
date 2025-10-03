import { BadRequestException } from '@nestjs/common';
import { Readable } from 'stream';
import * as csvParser from 'csv-parser';

interface CsvValidationResult<T> {
  validRows: T[];
  invalidRows: { row: number; missingFields: string[] }[];
}

export async function validateCsvFile<T = any>(
  file: Express.Multer.File,
  requiredFields: string[]
): Promise<CsvValidationResult<T>> {
  if (!file) throw new BadRequestException('CSV file required');
  if (!file.mimetype.includes('csv')) {
    throw new BadRequestException('Only CSV files allowed');
  }

  const csvData: any[] = [];

  await new Promise<void>((resolve, reject) => {
    Readable.from(file.buffer)
      .pipe(csvParser())
      .on('data', (row) => csvData.push(row))
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  const invalidRows: { row: number; missingFields: string[] }[] = [];
  const validRows = csvData
    .map((row, index) => {
      const missing = requiredFields.filter((f) => !row[f]);
      if (missing.length > 0) {
        invalidRows.push({ row: index + 1, missingFields: missing });
        return null;
      }
      return row as T;
    })
    .filter((r) => r !== null);

  if (invalidRows.length > 0) {
    throw new BadRequestException(
      `Invalid CSV rows: ${JSON.stringify(invalidRows)}`
    );
  }

  return { validRows: validRows as T[], invalidRows };
}
