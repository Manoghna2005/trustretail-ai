import { Shop, Complaint } from './types';

export const INITIAL_SHOPS: Shop[] = [
  {
    id: 'shop-1',
    name: 'FreshMart Central',
    address: '123 Main St, Downtown',
    reliabilityScore: 0.92,
    reliabilityReasoning: 'High update frequency and consistent inventory accuracy reported by customers.',
    incentiveTier: 'Gold',
    incentivePoints: 1250,
    updateFrequency: 14,
    accuracyRate: 0.98,
    averageUpdateDelay: 0.5,
    feedbackScore: 4.8,
    complaintsCount: 2,
    isSuspicious: false,
    inventory: [
      { id: 'p1', name: 'Organic Milk 1L', price: 3.5, quantity: 15, status: 'In Stock', lastUpdated: new Date().toISOString() },
      { id: 'p2', name: 'Whole Grain Bread', price: 2.8, quantity: 8, status: 'In Stock', lastUpdated: new Date().toISOString() },
      { id: 'p3', name: 'Farm Fresh Eggs (12pk)', price: 4.2, quantity: 20, status: 'In Stock', lastUpdated: new Date().toISOString() },
    ]
  },
  {
    id: 'shop-2',
    name: 'QuickStop Express',
    address: '456 Oak Ave, Suburbs',
    reliabilityScore: 0.45,
    reliabilityReasoning: 'Frequent complaints about out-of-stock items that are listed as available.',
    incentiveTier: 'Bronze',
    incentivePoints: 150,
    updateFrequency: 3,
    accuracyRate: 0.62,
    averageUpdateDelay: 12,
    feedbackScore: 2.1,
    complaintsCount: 18,
    isSuspicious: true,
    inventory: [
      { id: 'p4', name: 'Energy Drink 500ml', price: 2.5, quantity: 2, status: 'In Stock', lastUpdated: new Date().toISOString() },
      { id: 'p5', name: 'Potato Chips 150g', price: 1.8, quantity: 0, status: 'Out of Stock', lastUpdated: new Date().toISOString() },
      { id: 'p6', name: 'Instant Noodles', price: 0.9, quantity: 50, status: 'In Stock', lastUpdated: new Date().toISOString() },
    ]
  },
  {
    id: 'shop-3',
    name: 'Daily Needs Grocery',
    address: '789 Pine Rd, Westside',
    reliabilityScore: 0.78,
    reliabilityReasoning: 'Reliable updates but slightly slower response to stock changes during peak hours.',
    incentiveTier: 'Silver',
    incentivePoints: 680,
    updateFrequency: 8,
    accuracyRate: 0.85,
    averageUpdateDelay: 2,
    feedbackScore: 4.2,
    complaintsCount: 5,
    isSuspicious: false,
    inventory: [
      { id: 'p7', name: 'Basmati Rice 5kg', price: 12.0, quantity: 10, status: 'In Stock', lastUpdated: new Date().toISOString() },
      { id: 'p8', name: 'Cooking Oil 2L', price: 6.5, quantity: 12, status: 'In Stock', lastUpdated: new Date().toISOString() },
      { id: 'p9', name: 'Sugar 1kg', price: 1.5, quantity: 25, status: 'In Stock', lastUpdated: new Date().toISOString() },
    ]
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    shopId: 'shop-2',
    shopName: 'QuickStop Express',
    productName: 'Potato Chips 150g',
    issueType: 'Not in stock',
    comment: 'Website said it was in stock but shelf was empty when I arrived.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: 'Pending'
  },
  {
    id: 'c2',
    shopId: 'shop-2',
    shopName: 'QuickStop Express',
    productName: 'Energy Drink 500ml',
    issueType: 'Wrong info',
    comment: 'Price was higher than listed on the app.',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    status: 'Flagged'
  }
];
