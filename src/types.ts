export type IncentiveTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: 'In Stock' | 'Out of Stock';
  lastUpdated: string;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  reliabilityScore: number; // 0 to 1
  reliabilityReasoning: string;
  incentiveTier: IncentiveTier;
  incentivePoints: number;
  updateFrequency: number; // updates per week
  accuracyRate: number; // 0 to 1
  averageUpdateDelay: number; // hours
  feedbackScore: number; // 0 to 5
  complaintsCount: number;
  inventory: Product[];
  isSuspicious: boolean;
}

export interface Complaint {
  id: string;
  shopId: string;
  shopName: string;
  productName: string;
  issueType: 'Not in stock' | 'Wrong info' | 'Late update' | 'Poor service';
  comment: string;
  timestamp: string;
  status: 'Pending' | 'Resolved' | 'Flagged';
}

export interface UpdateLog {
  id: string;
  shopId: string;
  itemName: string;
  prevQuantity: number;
  newQuantity: number;
  timestamp: string;
}

export interface PredictionResult {
  score: number;
  reasoning: string;
  tier: IncentiveTier;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  isBought: boolean;
}

export interface CartItem {
  shopId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type UserRole = 'Project Viewer' | 'Shop Owner' | 'Customer' | 'Complaints Hub' | 'Admin';
