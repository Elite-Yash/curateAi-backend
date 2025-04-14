import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class ExportToGoogleSheetDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  google_sheet_url: string;
}
