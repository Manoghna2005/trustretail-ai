/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Toaster, toast } from 'sonner';
import { Store } from 'lucide-react';

import Layout from './components/Layout';
import ProjectPlan from './components/ProjectPlan';
import SystemDemo from './components/SystemDemo';
import ShopOwnerView from './components/ShopOwnerView';
import CustomerView from './components/CustomerView';
import ComplaintsHub from './components/ComplaintsHub';
import AdminPanel from './components/AdminPanel';
import { useSystemState } from './hooks/useSystemState';

export default function App() {
  const {
    shops,
    setShops,
    complaints,
    setComplaints,
    activeRole,
    setActiveRole,
    managedShopId,
    setManagedShopId,
    addToShoppingList,
    removeFromShoppingList,
    toggleShoppingItem,
    updateStock,
    addComplaint,
    purchaseProduct,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    purchaseCart,
    shoppingList
  } = useSystemState();

  const handleResolveComplaint = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved' } : c));
    toast('Complaint resolved!', {
      description: 'Status updated to resolved.',
    });
  };

  const handleRefreshAI = (shopId: string) => {
    // In a real app, this would trigger a re-fetch of the AI score
    // For the demo, we'll just simulate a slight change to show it happened
    setShops(prev => prev.map(shop => {
      if (shop.id === shopId) {
        return {
          ...shop,
          reliabilityScore: Math.min(1, shop.reliabilityScore + 0.01),
          incentivePoints: shop.incentivePoints + 50
        };
      }
      return shop;
    }));
  };

  const renderContent = () => {
    switch (activeRole) {
      case 'Project Viewer':
        return <ProjectPlan />;
      case 'System Demo':
        return <SystemDemo />;
      case 'Shop Owner':
        const managedShop = shops.find(s => s.id === managedShopId) || shops[0];
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Store size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">Managing: {managedShop.name}</h2>
                  <p className="text-xs text-slate-500">{managedShop.address}</p>
                </div>
              </div>
              <select 
                value={managedShopId}
                onChange={(e) => setManagedShopId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>
            </div>
            <ShopOwnerView 
              shop={managedShop} 
              onUpdateStock={updateStock} 
              onRefreshAI={handleRefreshAI}
            />
          </div>
        );
      case 'Customer':
        return (
          <CustomerView 
            shops={shops} 
            onPurchase={purchaseProduct} 
            shoppingList={shoppingList}
            cart={cart}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            onClearCart={clearCart}
            onPurchaseCart={purchaseCart}
            onAddToShoppingList={addToShoppingList}
            onRemoveFromShoppingList={removeFromShoppingList}
            onToggleShoppingItem={toggleShoppingItem}
            onReport={(shopId, shopName, productName) => {
              addComplaint({
                shopId,
                shopName,
                productName,
                issueType: 'Not in stock',
                comment: 'Item was listed as available but was not found in store.'
              });
            }}
          />
        );
      case 'Complaints Hub':
        return (
          <ComplaintsHub 
            complaints={complaints} 
            onResolve={handleResolveComplaint} 
          />
        );
      case 'Admin':
        return (
          <AdminPanel 
            shops={shops} 
            complaints={complaints} 
          />
        );
      default:
        return <ProjectPlan />;
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Layout activeRole={activeRole} onRoleChange={setActiveRole}>
        {renderContent()}
      </Layout>
    </>
  );
}
