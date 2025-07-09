export interface CoverImage {
  originalName: string;
  mimeType: string;
  sizeInBytes: number;
  width?: number;
  height?: number;
  url: string;
  supabaseKey: string;
  uploadedAt: Date;
}

export interface DownloadFile {
  id: string;
  originalName: string;
  displayName: string;
  mimeType: string;
  sizeInBytes: number;
  extension: string;
  url: string;
  supabaseKey: string;
  uploadedAt: Date;
  downloadCount: number;
}