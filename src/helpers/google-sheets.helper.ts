import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function getSheetsClient() {
  const credentials = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../credentials.json'), 'utf-8'),
  );

  const auth = new google.auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key,
    SCOPES,
  );

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}
