import { AnalysisResponse } from '../types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export interface AnalyzeParams {
  imageFile?: File | null;
  query?: string;
}

export async function analyzeProduct(
  params: AnalyzeParams
): Promise<AnalysisResponse> {
  const { imageFile, query } = params;

  const formData = new FormData();

  if (imageFile) {
    formData.append('file', imageFile);
  }

  if (query && query.trim()) {
    formData.append('query', query.trim());
  }

  const endpoint = `${API_BASE_URL.replace(/\/$/, '')}/api/analyze`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let message = `Backend service responded with status ${response.status}`;

    try {
      const errorData = await response.json();
      if (errorData.detail) {
        message = errorData.detail;
      }
    } catch {
      // Keep default error message
    }

    throw new Error(message);
  }

  return await response.json();
}

export async function analyzeImage(
  imageFile: File,
  query?: string
): Promise<AnalysisResponse> {
  return analyzeProduct({ imageFile, query });
}
