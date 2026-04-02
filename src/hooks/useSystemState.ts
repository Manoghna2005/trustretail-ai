import { useState, useEffect, useCallback } from 'react';
import { Shop, Complaint, UpdateLog, UserRole, ShoppingItem, CartItem } from '../types';
import { INITIAL_SHOPS, INITIAL_COMPLAINTS } from '../constants';
import { toast } from 'sonner';

const SYNC_CHANNEL = 'retail_trust_sync';

export function useSystemState() {
  const [shops, setShops] = useState<Shop[]>(() => {
    const saved = localStorage.getItem('retail_shops');
    return saved ? JSON.parse(saved) : INITIAL_SHOPS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('retail_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [logs, setLogs] = useState<UpdateLog[]>(() => {
    const saved = localStorage.getItem('retail_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('shopping_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('retail_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('active_role');
    return (saved as UserRole) || 'Shop Owner';
  });

  const [managedShopId, setManagedShopId] = useState<string>(() => {
    const saved = localStorage.getItem('managed_shop_id');
    return saved || 'shop-1';
  });

  // Cross-tab sync via storage events (better compat)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'retail_shops') setShops(JSON.parse(e.newValue || '[]'));
      if (e.key === 'retail_complaints') setComplaints(JSON.parse(e.newValue || '[]'));
      if (e.key === 'retail_logs') setLogs(JSON.parse(e.newValue || '[]'));
      if (e.key === 'shopping_list') setShoppingList(JSON.parse(e.newValue || '[]'));
      if (e.key === 'retail_cart') setCart(JSON.parse(e.newValue || '[]'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Simulation: Automatic Stock Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setShops(prev => prev.map(shop => {
        // Only update a random shop 20% of the time
        if (Math.random() > 0.2) return shop;

        const randomProductIndex = Math.floor(Math.random() * shop.inventory.length);
        const product = shop.inventory[randomProductIndex];
        
        // Simulate stock change (restock or sell)
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newQuantity = Math.max(0, product.quantity + change);
        
        if (newQuantity === product.quantity) return shop;

        const newInventory = [...shop.inventory];
        newInventory[randomProductIndex] = {
          ...product,
          quantity: newQuantity,
          status: newQuantity > 0 ? 'In Stock' : 'Out of Stock',
          lastUpdated: new Date().toISOString()
        };

        // If reliability is high, give some bonus points for "active management"
        const bonusPoints = shop.reliabilityScore > 0.8 ? 5 : 0;

        return {
          ...shop,
          inventory: newInventory,
          incentivePoints: shop.incentivePoints + bonusPoints
        };
      }));
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Persist to localStorage (triggers storage events for other tabs)
  useEffect(() => {
    localStorage.setItem('retail_shops', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem('retail_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('retail_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('shopping_list', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('retail_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('active_role', activeRole);
  }, [activeRole]);

  useEffect(() => {
    localStorage.setItem('managed_shop_id', managedShopId);
  }, [managedShopId]);

  const addToShoppingList = useCallback((name: string, quantity: number = 1) => {
    const newItem: ShoppingItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      quantity,
      isBought: false
    };
    setShoppingList(prev => [...prev, newItem]);
    toast.success(`Added ${name} to shopping list`);
  }, []);

  const removeFromShoppingList = useCallback((id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleShoppingItem = useCallback((id: string) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, isBought: !item.isBought } : item
    ));
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.shopId === item.shopId);
      if (existing) {
        return prev.map(i => 
          i.productId === item.productId && i.shopId === item.shopId 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      }
      return [...prev, item];
    });
    toast.success(`Added ${item.name} to cart`);
  }, []);

  const removeFromCart = useCallback((shopId: string, productId: string) => {
    setCart(prev => prev.filter(i => !(i.shopId === shopId && i.productId === productId)));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const updateStock = useCallback((shopId: string, productId: string, newQuantity: number) => {
    setShops(prev => prev.map(shop => {
      if (shop.id !== shopId) return shop;
      
      const prevProduct = shop.inventory.find(p => p.id === productId);
      if (!prevProduct) return shop;

      const newLog: UpdateLog = {
        id: Math.random().toString(36).substr(2, 9),
        shopId,
        itemName: prevProduct.name,
        prevQuantity: prevProduct.quantity,
        newQuantity,
        timestamp: new Date().toISOString()
      };
      setLogs(l => [newLog, ...l].slice(0, 50));

      // Reward shop owner for manual updates (incentive system)
      const pointsEarned = 10;

      return {
        ...shop,
        incentivePoints: shop.incentivePoints + pointsEarned,
        inventory: shop.inventory.map(p => 
          p.id === productId 
            ? { ...p, quantity: newQuantity, status: newQuantity > 0 ? 'In Stock' : 'Out of Stock', lastUpdated: new Date().toISOString() }
            : p
        )
      };
    }));
    toast.success('Stock updated and points earned!');
  }, []);

  const addComplaint = useCallback((complaint: Omit<Complaint, 'id' | 'timestamp' | 'status'>) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    setComplaints(prev => [newComplaint, ...prev]);
    
    // Impact shop reliability
    setShops(prev => prev.map(shop => {
      if (shop.id === complaint.shopId) {
        const newComplaintsCount = shop.complaintsCount + 1;
        const newScore = Math.max(0, shop.reliabilityScore - 0.05);
        
        // Deduct points for complaints
        const pointsDeducted = 100;

        return {
          ...shop,
          complaintsCount: newComplaintsCount,
          reliabilityScore: newScore,
          incentivePoints: Math.max(0, shop.incentivePoints - pointsDeducted),
          isSuspicious: newComplaintsCount > 10 || newScore < 0.5
        };
      }
      return shop;
    }));
    
    toast.success('Complaint submitted successfully');
  }, []);

  const purchaseProduct = useCallback((shopId: string, productId: string, quantity: number = 1) => {
    const shop = shops.find(s => s.id === shopId);
    const product = shop?.inventory.find(p => p.id === productId);

    if (product && product.quantity >= quantity) {
      setShops(prev => prev.map(s => {
        if (s.id !== shopId) return s;
        
        // Reward shop for successful sale (proves stock accuracy)
        const pointsEarned = 5 * quantity;

        return {
          ...s,
          incentivePoints: s.incentivePoints + pointsEarned,
          inventory: s.inventory.map(p => 
            p.id === productId 
              ? { ...p, quantity: p.quantity - quantity, status: (p.quantity - quantity) > 0 ? 'In Stock' : 'Out of Stock', lastUpdated: new Date().toISOString() }
              : p
          )
        };
      }));
      toast.success(`Purchased ${quantity} ${product.name}(s)!`);
      return true;
    } else {
      toast.error('Not enough stock available!');
      return false;
    }
  }, [shops]);

  const purchaseCart = useCallback(() => {
    if (cart.length === 0) return;

    let allAvailable = true;
    cart.forEach(item => {
      const shop = shops.find(s => s.id === item.shopId);
      const product = shop?.inventory.find(p => p.id === item.productId);
      if (!product || product.quantity < item.quantity) {
        allAvailable = false;
        toast.error(`Not enough stock for ${item.name}`);
      }
    });

    if (!allAvailable) return;

    setShops(prev => prev.map(s => {
      const shopItems = cart.filter(i => i.shopId === s.id);
      if (shopItems.length === 0) return s;

      // Reward shop for successful sale (proves stock accuracy)
      const totalQuantity = shopItems.reduce((sum, item) => sum + item.quantity, 0);
      const pointsEarned = 5 * totalQuantity;

      return {
        ...s,
        incentivePoints: s.incentivePoints + pointsEarned,
        inventory: s.inventory.map(p => {
          const cartItem = shopItems.find(i => i.productId === p.id);
          if (cartItem) {
            const newQty = p.quantity - cartItem.quantity;
            return { ...p, quantity: newQty, status: newQty > 0 ? 'In Stock' : 'Out of Stock', lastUpdated: new Date().toISOString() };
          }
          return p;
        })
      };
    }));

    clearCart();
    toast.success('Checkout successful!');
  }, [cart, shops, clearCart]);

  return {
    shops,
    setShops,
    complaints,
    setComplaints,
    logs,
    shoppingList,
    cart,
    activeRole,
    setActiveRole,
    managedShopId,
    setManagedShopId,
    addToShoppingList,
    removeFromShoppingList,
    toggleShoppingItem,
    addToCart,
    removeFromCart,
    clearCart,
    updateStock,
    addComplaint,
    purchaseProduct,
    purchaseCart
  };
}
