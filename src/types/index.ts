export type VerificationState = 'STANDARD_IDENTIFIED' | 'INCONCLUSIVE' | 'BIS_MISMATCH';

export interface Citation {
  title: string;
  source?: string;
  url?: string;
  section?: string;
}

export interface AnalysisData {
  product_name?: string;
  category?: string;
  color?: string;
  material?: string;
  brand?: string;
  condition?: string;
  visible_features?: string[];
  verification_state: VerificationState;
  confidence_score?: number;
  standard_identified?: string;
  explanation?: string;
  evidence?: string[];
  citations?: Citation[];
  certification_status?: string;
}

export interface AnalysisResponse {
  success: boolean;
  data: AnalysisData;
  error?: string;
}

export interface ImageFileInfo {
  file: File;
  previewUrl: string;
  name: string;
  sizeFormatted: string;
  dimensions?: {
    width: number;
    height: number;
  };
  extension: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  imageInfo?: {
    name: string;
    previewUrl: string;
    sizeFormatted?: string;
    extension?: string;
  } | null;
  query?: string;
  data: AnalysisData;
}

export type AppState = 'upload' | 'preview' | 'analyzing' | 'results' | 'error';

export type ActiveTab = 'home' | 'history' | 'about';
