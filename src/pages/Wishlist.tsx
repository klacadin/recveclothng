import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (productId: string) => {
    // Redirect to product page for size selection
    window.location.href = `/product/${productId}`;
  };

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast({
      title: 'Removed from wishlist',
      description: `${productName} has been removed from your wishlist.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/shop">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Wishlist</h1>
              <p className="text-muted-foreground">{items.length} items saved</p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Save products you love by clicking the heart icon
              </p>
              <Button asChild>
                <Link to="/shop">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearWishlist();
                    toast({
                      title: 'Wishlist cleared',
                      description: 'All items have been removed from your wishlist.',
                    });
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>

              <div className="grid gap-4">
                {items.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-4 border rounded-lg bg-card"
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="w-24 h-24 md:w-32 md:h-32 bg-muted rounded-md overflow-hidden flex-shrink-0"
                    >
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                          No image
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold hover:text-accent transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      {product.category && (
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                          {product.category}
                        </p>
                      )}
                      <p className="font-bold text-lg mt-2">
                        ₱{Number(product.price).toLocaleString()}
                      </p>
                      <p className={`text-sm mt-1 ${product.stock_quantity > 0 ? 'text-green-600' : 'text-destructive'}`}>
                        {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 justify-center">
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stock_quantity <= 0}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(product.id, product.name)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
