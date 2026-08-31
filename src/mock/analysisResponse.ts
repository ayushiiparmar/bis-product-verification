import { AnalysisResponse } from '../types';

/**
 * Standard identified mock response (State 1)
 */
export const mockStandardIdentifiedResponse: AnalysisResponse = {
  success: true,
  data: {
    product_name: "Blue Cotton Shirt",
    category: "shirt",
    color: "blue",
    material: "cotton",
    brand: "unknown",
    condition: "good",
    visible_features: [
      "full sleeves",
      "collar",
      "button front"
    ],
    verification_state: "STANDARD_IDENTIFIED",
    standard_identified: "IS 3937 (Part 1): 2018 / Textiles - Woven Apparel Fabrics",
    confidence_score: 94,
    explanation: "Visual and fiber characteristics match the specification parameters of woven cotton shirting fabrics under BIS standard IS 3937. Key weave density and yarn characteristics align with textile standard references.",
    evidence: [
      "100% woven cotton texture identified across fabric surface",
      "Stitch and seam construction conforms to standard garment requirements",
      "Standard collar collar-band geometry identified"
    ],
    citations: [
      {
        title: "IS 3937 (Part 1) Specification for Woven Fabrics",
        source: "Bureau of Indian Standards",
        section: "Clause 4.2 - Material Composition & Weave Type",
        url: "https://www.services.bis.gov.in"
      },
      {
        title: "BIS National Standards Portal - Textile Division",
        source: "TXD 02 Apparel Standards",
        section: "Clause 5.1 - Quality Attributes"
      }
    ]
  }
};

/**
 * Inconclusive mock response (State 2)
 */
export const mockInconclusiveResponse: AnalysisResponse = {
  success: true,
  data: {
    product_name: "Generic Electronic Accessory",
    category: "Electronics",
    color: "Black",
    material: "Plastic Composite",
    brand: "Unspecified",
    condition: "Fair",
    visible_features: [
      "USB interface connector",
      "Molded casing",
      "No legible marking label visible"
    ],
    verification_state: "INCONCLUSIVE",
    confidence_score: 52,
    explanation: "The image resolution and angle do not clearly display technical markings, electrical ratings, or product registration marks necessary to map to a specific BIS standard.",
    evidence: [
      "Rating plate and model identifier are obscured or unreadable",
      "Multiple overlapping standards (IS 13252 vs IS 616) apply to this form factor without voltage specifications"
    ],
    citations: [
      {
        title: "Compulsory Registration Scheme (CRS) Guidelines",
        source: "Bureau of Indian Standards - IT & Electronics",
        section: "Section 3 - Identification Criteria"
      }
    ]
  }
};

/**
 * BIS Mismatch mock response (State 3)
 */
export const mockMismatchResponse: AnalysisResponse = {
  success: true,
  data: {
    product_name: "High-Power Adapter Cable",
    category: "Power Electronics",
    color: "White",
    material: "PVC Insulation, Copper Alloy",
    brand: "Unbranded",
    condition: "New",
    visible_features: [
      "2-pin plug configuration",
      "Thin insulation jacket",
      "Non-standard pin dimensions"
    ],
    verification_state: "BIS_MISMATCH",
    standard_identified: "IS 1293:2019 / Plugs and Socket-Outlets",
    confidence_score: 89,
    explanation: "The physical pin spacing and insulation collar dimensions observed in the visual capture do not align with mandatory dimensional constraints prescribed in IS 1293:2019.",
    evidence: [
      "Pin diameter and pitch deviate from IS 1293 Table 1 specifications",
      "Absence of required standard safety insulation sleeve on live pins",
      "Declared voltage rating exceeds single-insulated connector allowance"
    ],
    citations: [
      {
        title: "IS 1293:2019 Plugs and Socket-Outlets of Rated Voltage up to and including 250V",
        source: "Bureau of Indian Standards",
        section: "Clause 9.1 - Dimensions of Plugs",
        url: "https://www.services.bis.gov.in"
      },
      {
        title: "Quality Control Order (QCO) for Electrical Accessories",
        source: "Ministry of Commerce and Industry",
        section: "Mandatory Compliance Schedule"
      }
    ]
  }
};

// Default fallback mock response conforming to user contract
export const mockAnalysisResponse: AnalysisResponse = mockStandardIdentifiedResponse;

export const sampleAnalysisPresets: Record<string, AnalysisResponse> = {
  standard_identified: mockStandardIdentifiedResponse,
  inconclusive: mockInconclusiveResponse,
  bis_mismatch: mockMismatchResponse,
  headphones: {
    success: true,
    data: {
      product_name: "Wireless Over-Ear Headphones",
      category: "Audio Equipment",
      color: "White, Lavender, Pastel Purple",
      material: "Polycarbonate, Synthetic Leather, Aluminum",
      brand: "NexVision Sound",
      condition: "Excellent",
      visible_features: [
        "Over-ear wireless headphones",
        "Adjustable headband",
        "Soft cushioned ear pads",
        "Integrated volume controls",
        "Foldable hinge structure"
      ],
      verification_state: "STANDARD_IDENTIFIED",
      standard_identified: "IS 616:2017 / Audio, Video and Similar Electronic Apparatus - Safety Requirements",
      confidence_score: 96,
      explanation: "Product category, acoustic transducer form factor, and low-voltage battery enclosure match the safety classification requirements under Indian Standard IS 616:2017 (equivalent to IEC 60065).",
      evidence: [
        "Acoustic output and ear-cushion clearance conform to consumer audio ergonomics",
        "Enclosure materials exhibit flame-retardant structural finish specifications",
        "Wireless RF antenna housing conforms to low-power electronic safety envelope"
      ],
      citations: [
        {
          title: "IS 616:2017 Safety Requirements for Audio & Video Apparatus",
          source: "Bureau of Indian Standards - Electronics Division",
          section: "Clause 4.3 - Insulation & Enclosure Requirements",
          url: "https://www.services.bis.gov.in"
        }
      ]
    }
  }
};
