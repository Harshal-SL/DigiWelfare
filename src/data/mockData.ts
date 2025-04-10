
export interface Scheme {
  id: string;
  title: string;
  description: string;
  eligibility: string[];
  benefits: string;
  documents: string[];
  thumbnail: string;
  status: "active" | "upcoming" | "closed";
  startDate: string;
  endDate: string;
}

export interface Application {
  id: string;
  schemeId: string;
  userId: string;
  userName: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  documents: { name: string; url: string }[];
  eligibilityScore?: number;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  transactionHash?: string;
}

export const schemes: Scheme[] = [
  {
    id: "scheme-1",
    title: "PM Kisan Samman Nidhi",
    description: "Financial assistance to small and marginal farmers across the country.",
    eligibility: [
      "Small and marginal farmer",
      "Own cultivable land",
      "Valid Aadhaar Card",
      "Bank Account"
    ],
    benefits: "₹6,000 per year in three equal installments",
    documents: ["Aadhaar Card", "Land Records", "Bank Passbook", "Recent Photograph"],
    thumbnail: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=500&auto=format&fit=crop",
    status: "active",
    startDate: "2023-01-01",
    endDate: "2025-12-31"
  },
  {
    id: "scheme-2",
    title: "Pradhan Mantri Awas Yojana",
    description: "Housing for All initiative to provide affordable housing to the urban poor.",
    eligibility: [
      "Annual household income below ₹3 lakh",
      "Does not own a pucca house",
      "Valid Aadhaar Card"
    ],
    benefits: "Financial assistance up to ₹2.5 lakh for house construction",
    documents: ["Aadhaar Card", "Income Certificate", "Domicile Certificate", "Land Documents (if any)"],
    thumbnail: "https://images.unsplash.com/photo-1489370321024-e0410ad08da4?q=80&w=500&auto=format&fit=crop",
    status: "active",
    startDate: "2022-04-01",
    endDate: "2024-03-31"
  },
  {
    id: "scheme-3",
    title: "National Scholarship Portal",
    description: "Scholarships for students belonging to minority communities pursuing higher education.",
    eligibility: [
      "Students from minority communities",
      "Annual family income below ₹2 lakh",
      "Minimum 50% marks in previous examination"
    ],
    benefits: "Scholarship amount ranging from ₹5,000 to ₹20,000 per annum",
    documents: ["Aadhaar Card", "Income Certificate", "Previous Year Marksheet", "Bank Passbook"],
    thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=500&auto=format&fit=crop",
    status: "upcoming",
    startDate: "2024-07-01",
    endDate: "2025-06-30"
  },
  {
    id: "scheme-4",
    title: "Ayushman Bharat",
    description: "Health insurance coverage for low-income families.",
    eligibility: [
      "Below Poverty Line (BPL) family",
      "Not covered under any other health insurance",
      "Valid Aadhaar Card"
    ],
    benefits: "Health coverage up to ₹5 lakh per family per year",
    documents: ["Aadhaar Card", "BPL Certificate", "Family Card", "Recent Photograph"],
    thumbnail: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=500&auto=format&fit=crop",
    status: "active",
    startDate: "2023-01-01",
    endDate: "2025-12-31"
  }
];

export const applications: Application[] = [
  {
    id: "app-1",
    schemeId: "scheme-1",
    userId: "user-1",
    userName: "John Doe",
    status: "pending",
    submittedAt: "2024-03-15T10:30:00Z",
    documents: [
      { name: "Aadhaar Card", url: "/documents/aadhaar.pdf" },
      { name: "Land Records", url: "/documents/land.pdf" },
      { name: "Bank Passbook", url: "/documents/bank.pdf" }
    ],
    eligibilityScore: 85
  },
  {
    id: "app-2",
    schemeId: "scheme-2",
    userId: "user-1",
    userName: "John Doe",
    status: "approved",
    submittedAt: "2024-02-20T14:45:00Z",
    documents: [
      { name: "Aadhaar Card", url: "/documents/aadhaar.pdf" },
      { name: "Income Certificate", url: "/documents/income.pdf" },
      { name: "Domicile Certificate", url: "/documents/domicile.pdf" }
    ],
    eligibilityScore: 92,
    reviewedBy: "Admin User",
    reviewedAt: "2024-02-25T09:15:00Z",
    transactionHash: "0x7cb..a4e2"
  },
  {
    id: "app-3",
    schemeId: "scheme-4",
    userId: "user-2",
    userName: "Jane Smith",
    status: "rejected",
    submittedAt: "2024-01-10T11:20:00Z",
    documents: [
      { name: "Aadhaar Card", url: "/documents/aadhaar2.pdf" },
      { name: "BPL Certificate", url: "/documents/bpl.pdf" }
    ],
    eligibilityScore: 45,
    reviewedBy: "Admin User",
    reviewedAt: "2024-01-15T16:30:00Z",
    rejectionReason: "Incomplete documentation and not meeting income criteria."
  }
];
