import { AnalysisResponse } from '../types';
import {
  mockStandardIdentifiedResponse,
  mockInconclusiveResponse,
  mockMismatchResponse,
  sampleAnalysisPresets,
} from '../mock/analysisResponse';

/**
 * Base API URL configured via environment variables.
 * In Next.js, configure NEXT_PUBLIC_API_BASE_URL in .env.local.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export interface AnalyzeParams {
  imageFile?: File | null;
  query?: string;
}

/**
 * Isolated API service function to analyze an image, a text query, or both combined.
 * Calls the backend API endpoint POST /api/analyze if configured,
 * or returns isolated mock response during frontend development.
 *
 * @param params - { imageFile, query }
 * @returns Promise<AnalysisResponse>
 */
export async function analyzeProduct(params: AnalyzeParams): Promise<AnalysisResponse> {
  const { imageFile, query } = params;

  // If real backend URL is configured, perform real API call
  if (API_BASE_URL) {
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image', imageFile);
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
        throw new Error(`Backend service responded with status ${response.status}`);
      }

      const result: AnalysisResponse = await response.json();
      return result;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error communicating with analysis service';
      throw new Error(errorMessage);
    }
  }

  // --- MOCK DEVELOPMENT ADAPTER ---
  // Simulate network latency (1.4 - 2.0 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1600));

  const lowerName = imageFile ? imageFile.name.toLowerCase() : '';
  const lowerQuery = (query || '').toLowerCase();

  // Test state routing based on query / filename for developer testing
  if (
    lowerQuery.includes('mismatch') ||
    lowerName.includes('mismatch') ||
    lowerQuery.includes('plug') ||
    lowerName.includes('plug') ||
    lowerQuery.includes('adapter') ||
    lowerName.includes('cable')
  ) {
    return JSON.parse(JSON.stringify(mockMismatchResponse));
  }

  if (
    lowerQuery.includes('inconclusive') ||
    lowerQuery.includes('insufficient') ||
    lowerQuery.includes('unknown') ||
    lowerName.includes('blur') ||
    lowerName.includes('unclear')
  ) {
    return JSON.parse(JSON.stringify(mockInconclusiveResponse));
  }

  if (
    lowerName.includes('headphone') ||
    lowerName.includes('audio') ||
    lowerQuery.includes('headphone') ||
    lowerQuery.includes('audio') ||
    lowerQuery.includes('616')
  ) {
    return JSON.parse(JSON.stringify(sampleAnalysisPresets.headphones));
  }

  // Pure query response for general queries
  if (!imageFile && query) {
    return {
      success: true,
      data: {
        product_name: "Queried Standard Item",
        category: "Standards Query",
        verification_state: "STANDARD_IDENTIFIED",
        standard_identified: "IS 302-1:2024 / Safety of Household and Similar Electrical Appliances",
        confidence_score: 91,
        explanation: `Based on your inquiry regarding "${query}", the primary Indian Standard applicable is IS 302-1:2024. This standard specifies general electrical safety, insulation resistance, and mechanical hazard prevention guidelines.`,
        evidence: [
          "Relevant product classification mapped to Safety of Electrical Appliances division",
          "Mandatory compliance under Compulsory Registration Scheme (CRS) schedule",
          "Standard test requirements cover heating, leakage current, and moisture resistance"
        ],
        citations: [
          {
            title: "IS 302-1:2024 Safety of Household and Similar Electrical Appliances - General Requirements",
            source: "Bureau of Indian Standards",
            section: "Clause 8 - Protection Against Electric Shock",
            url: "https://www.services.bis.gov.in"
          },
          {
            title: "BIS Central Certification & Standards Registry",
            source: "Electrotechnical Department (ETD 32)",
            section: "Schedule II - Household Appliances"
          }
        ]
      }
    };
  }

  // Default: STANDARD_IDENTIFIED (Blue Cotton Shirt standard response)
  return JSON.parse(JSON.stringify(mockStandardIdentifiedResponse));
}

/**
 * Backward compatibility alias for analyzeImage
 */
export async function analyzeImage(imageFile: File, query?: string): Promise<AnalysisResponse> {
  return analyzeProduct({ imageFile, query });
}
