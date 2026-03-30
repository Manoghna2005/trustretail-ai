import React from 'react';
import { Shop, Product, ShoppingItem, CartItem } from '../types';
import { 
  Search, 
  MapPin, 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  AlertCircle,
  Filter,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Circle,
  ListTodo,
  Store,
  ShoppingBag,
  CreditCard,
  X,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, cn, formatDate } from '../lib/utils';
import { toast } from 'sonner';

interface CustomerViewProps {
  shops: Shop[];
  onPurchase: (shopId: string, productId: string, quantity: number) => void;
  onReport: (shopId: string, shopName: string, productName: string) => void;
  shoppingList: ShoppingItem[];
  cart: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (shopId: string, productId: string) => void;
  onClearCart: () => void;
  onPurchaseCart: () => void;
  onAddToShoppingList: (name: string, quantity: number) => void;
  onRemoveFromShoppingList: (id: string) => void;
  onToggleShoppingItem: (id: string) => void;
}

export default function CustomerView({ 
  shops, 
  onPurchase, 
  onReport,
  shoppingList,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onPurchaseCart,
  onAddToShoppingList,
  onRemoveFromShoppingList,
  onToggleShoppingItem
}: CustomerViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedShop, setSelectedShop] = React.useState<Shop | null>(null);
  const [newItemName, setNewItemName] = React.useState('');
  const [newItemQty, setNewItemQty] = React.useState(1);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.inventory.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    toast.info('Syncing latest stock levels...');
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Stock levels updated!');
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for shops or products..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={handleManualRefresh}
          className={cn(
            "px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 text-slate-600 font-bold hover:bg-slate-50 transition-colors shadow-sm",
            isRefreshing && "animate-pulse"
          )}
        >
          <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
          Sync Stock
        </button>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative px-6 py-4 bg-indigo-600 text-white rounded-2xl flex items-center gap-2 font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <ShoppingBag size={20} />
          Cart
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shop List */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="font-bold text-slate-800 px-2 flex items-center gap-2">
            <Store size={18} className="text-indigo-500" />
            Nearby Shops
          </h3>
          <div className="space-y-3">
            {filteredShops.map((shop) => (
              <button
                key={shop.id}
                onClick={() => setSelectedShop(shop)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all duration-200 group",
                  selectedShop?.id === shop.id 
                    ? "bg-white border-indigo-500 shadow-lg shadow-indigo-100 ring-1 ring-indigo-500" 
                    : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      shop.reliabilityScore > 0.8 ? "bg-green-100 text-green-600" : 
                      shop.reliabilityScore > 0.5 ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"
                    )}>
                      <ShieldCheck size={16} />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors truncate max-w-[120px]">{shop.name}</h4>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded-md">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-slate-700">{shop.feedbackScore}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <span className={cn(
                    "text-xs font-black",
                    shop.reliabilityScore > 0.8 ? "text-green-600" : 
                    shop.reliabilityScore > 0.5 ? "text-amber-600" : "text-red-600"
                  )}>
                    {(shop.reliabilityScore * 100).toFixed(0)}% Trust
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {shop.inventory.filter(p => p.status === 'In Stock').length} In Stock
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product View */}
        <div className="lg:col-span-6">
          {selectedShop ? (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedShop.name}</h2>
                    <p className="text-slate-500 flex items-center gap-1 text-sm">
                      <MapPin size={14} />
                      {selectedShop.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                      <p className="text-[9px] font-bold uppercase tracking-wider">Trust</p>
                      <p className="text-sm font-black">{(selectedShop.reliabilityScore * 100).toFixed(0)}%</p>
                    </div>
                    <div className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                      <p className="text-[9px] font-bold uppercase tracking-wider">Tier</p>
                      <p className="text-sm font-black">{selectedShop.incentiveTier}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedShop.inventory.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onPurchase={(qty) => {
                        onAddToCart({
                          shopId: selectedShop.id,
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          quantity: qty
                        });
                        setIsCartOpen(true);
                      }}
                      onAddToCart={(qty) => onAddToCart({
                        shopId: selectedShop.id,
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: qty
                      })}
                      onReport={() => onReport(selectedShop.id, selectedShop.name, product.name)}
                      onAddToList={() => onAddToShoppingList(product.name, 1)}
                    />
                  ))}
                </div>
              </div>

              {selectedShop.isSuspicious && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="text-red-500 shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-bold text-red-800">High Fraud Risk Detected</p>
                    <p className="text-xs text-red-600">This shop has received multiple complaints about inaccurate stock levels. Proceed with caution.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Store size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Select a shop to view products</h3>
              <p className="text-slate-400 max-w-xs">Browse the trusted shops on the left to see their live inventory and reliability scores.</p>
            </div>
          )}
        </div>

        {/* Shopping List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ListTodo size={18} className="text-indigo-500" />
              Shopping List
            </h3>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add item..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newItemName) {
                      onAddToShoppingList(newItemName, newItemQty);
                      setNewItemName('');
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    if (newItemName) {
                      onAddToShoppingList(newItemName, newItemQty);
                      setNewItemName('');
                    }
                  }}
                  className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {shoppingList.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-slate-400 italic">Your list is empty</p>
                  </div>
                ) : (
                  shoppingList.map((item) => (
                    <div 
                      key={item.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border transition-all",
                        item.isBought ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-100 shadow-sm"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <button onClick={() => onToggleShoppingItem(item.id)}>
                          {item.isBought ? (
                            <CheckCircle2 size={18} className="text-green-500" />
                          ) : (
                            <Circle size={18} className="text-slate-300 hover:text-indigo-400" />
                          )}
                        </button>
                        <div>
                          <p className={cn(
                            "text-sm font-bold",
                            item.isBought ? "text-slate-400 line-through" : "text-slate-700"
                          )}>
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => onRemoveFromShoppingList(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Shop Incentives Info */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
            <h4 className="font-black text-lg mb-2">Shop Rewards</h4>
            <p className="text-xs text-indigo-100 mb-4 leading-relaxed">
              Shops earn points for accurate stock updates and successful sales. High trust scores unlock better tiers and exclusive benefits!
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                <span>Gold Tier</span>
                <span>1000+ pts</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={20} />
                </div>
                <h3 className="font-black text-xl text-slate-800 tracking-tight">Your Cart</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag size={48} className="mb-4" />
                  <p className="font-bold">Your cart is empty</p>
                  <p className="text-sm">Add some items from the shops to get started.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.shopId}-${item.productId}`} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <p className="text-xs text-slate-500">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-black text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                      <button 
                        onClick={() => onRemoveFromCart(item.shopId, item.productId)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">Total Amount</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={onClearCart}
                    className="py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white transition-all"
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={() => {
                      onPurchaseCart();
                      setIsCartOpen(false);
                    }}
                    className="py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
                  >
                    <CreditCard size={18} />
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onPurchase: (quantity: number) => void;
  onAddToCart: (quantity: number) => void;
  onReport: () => void;
  onAddToList: () => void;
}

function ProductCard({ product, onPurchase, onAddToCart, onReport, onAddToList }: ProductCardProps) {
  const [qty, setQty] = React.useState(1);

  const handleQtyChange = (val: number) => {
    const newQty = Math.max(1, Math.min(product.quantity, val));
    setQty(newQty);
  };

  return (
    <div className="group bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{product.name}</h4>
          <p className="text-lg font-black text-slate-900 mt-1">{formatCurrency(product.price)}</p>
        </div>
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
          product.status === 'In Stock' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {product.status}
        </span>
      </div>

      <div className="space-y-4">
        {/* Quantity Selector */}
        <div className="flex items-center justify-between bg-slate-100 rounded-xl p-1">
          <button 
            onClick={() => handleQtyChange(qty - 1)}
            disabled={qty <= 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white disabled:opacity-30 transition-all"
          >
            <Minus size={14} />
          </button>
          <input 
            type="number" 
            value={qty}
            onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)}
            className="w-12 bg-transparent text-center font-bold text-sm focus:outline-none"
          />
          <button 
            onClick={() => handleQtyChange(qty + 1)}
            disabled={qty >= product.quantity}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white disabled:opacity-30 transition-all"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button 
            onClick={() => onPurchase(qty)}
            disabled={product.status === 'Out of Stock'}
            className={cn(
              "flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all",
              product.status === 'In Stock' 
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            <CreditCard size={16} />
            Buy Now
          </button>
          <button 
            onClick={() => onAddToCart(qty)}
            disabled={product.status === 'Out of Stock'}
            className={cn(
              "p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all",
              product.status === 'In Stock'
                ? "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                : "border-slate-200 text-slate-300 cursor-not-allowed"
            )}
            title="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
          <button 
            onClick={onAddToList}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
            title="Add to shopping list"
          >
            <Plus size={20} />
          </button>
          <button 
            onClick={onReport}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
            title="Report wrong info"
          >
            <AlertCircle size={20} />
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <span>Stock: {product.quantity} units</span>
        <span>Updated {formatDate(product.lastUpdated)}</span>
      </div>
    </div>
  );
}
