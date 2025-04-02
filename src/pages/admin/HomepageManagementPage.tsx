
import { useState } from "react";
import { 
  getFeaturedProducts, 
  postProductToHomepage, 
  updateProductOnHomepage, 
  removeProductFromHomepage 
} from "@/services/homepageService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  LayoutDashboard,
  MoveUp,
  MoveDown,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/lib/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface HomepageProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  featured: boolean;
  displayOrder?: number;
}

const HomepageManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<HomepageProduct>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    featured: true,
    displayOrder: 0
  });
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
  });

  const addProductMutation = useMutation({
    mutationFn: (productData: HomepageProduct) => postProductToHomepage(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      toast.success("Product added to homepage successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add product to homepage");
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: (productData: HomepageProduct) => updateProductOnHomepage(productData.id!, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      toast.success("Homepage product updated successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update homepage product");
    }
  });

  const removeProductMutation = useMutation({
    mutationFn: (productId: string) => removeProductFromHomepage(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] });
      toast.success("Product removed from homepage successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove product from homepage");
    }
  });

  const featuredProducts = data?.products || [];
  
  const filteredProducts = featuredProducts.filter((product: HomepageProduct) => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by display order if it exists
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
      return a.displayOrder - b.displayOrder;
    }
    return 0;
  });

  const handleOpenDialog = (product?: HomepageProduct) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setCurrentProduct({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        featured: true,
        displayOrder: featuredProducts.length
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleOpenPreview = (product: HomepageProduct) => {
    setCurrentProduct(product);
    setIsPreviewOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentProduct({
      ...currentProduct,
      featured: checked,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && currentProduct.id) {
      updateProductMutation.mutate(currentProduct);
    } else {
      addProductMutation.mutate(currentProduct);
    }
  };

  const handleMoveProduct = (product: HomepageProduct, direction: 'up' | 'down') => {
    if (!product.displayOrder !== undefined) return;
    
    let newOrder = product.displayOrder!;
    
    if (direction === 'up' && newOrder > 0) {
      newOrder--;
    } else if (direction === 'down' && newOrder < featuredProducts.length - 1) {
      newOrder++;
    } else {
      return; // Can't move further
    }
    
    // Find any product with the target order and swap
    const productToSwap = featuredProducts.find(p => p.displayOrder === newOrder);
    
    if (productToSwap) {
      updateProductMutation.mutate({
        ...productToSwap,
        displayOrder: product.displayOrder
      });
    }
    
    updateProductMutation.mutate({
      ...product,
      displayOrder: newOrder
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to remove this product from the homepage? This action cannot be undone.")) {
      removeProductMutation.mutate(productId);
    }
  };

  const isMutating = addProductMutation.isPending || 
                     updateProductMutation.isPending || 
                     removeProductMutation.isPending;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Homepage Management</h1>
          <p className="text-muted-foreground">
            Manage featured products on your homepage
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product to Homepage
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Featured Products</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 md:w-[240px] lg:w-[320px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-60">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      No featured products found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProducts.map((product: HomepageProduct) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.displayOrder !== undefined ? product.displayOrder + 1 : "-"}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>${parseFloat(product.price.toString()).toFixed(2)}</TableCell>
                      <TableCell>
                        {product.featured ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Featured
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Hidden
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenPreview(product)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Preview</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleMoveProduct(product, 'up')}
                          disabled={product.displayOrder === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                          <span className="sr-only">Move Up</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleMoveProduct(product, 'down')}
                          disabled={product.displayOrder === featuredProducts.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                          <span className="sr-only">Move Down</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Featured Product" : "Add Product to Homepage"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update the product details below" 
                : "Fill in the product details to feature on the homepage"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentProduct.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentProduct.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    name="displayOrder"
                    type="number"
                    min="0"
                    value={currentProduct.displayOrder}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={currentProduct.imageUrl || ""}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={currentProduct.featured}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="featured">Featured on Homepage</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isMutating}>
                {isMutating ? "Processing..." : isEditing ? "Update Product" : "Add to Homepage"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Preview</DialogTitle>
            <DialogDescription>
              Preview how this product will appear on the homepage
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {currentProduct.imageUrl && (
              <div className="aspect-[16/9] overflow-hidden rounded-md">
                <img 
                  src={currentProduct.imageUrl} 
                  alt={currentProduct.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg'; 
                    (e.target as HTMLImageElement).alt = 'Image not available';
                  }} 
                />
              </div>
            )}
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{currentProduct.name}</h3>
              <p className="text-primary font-medium">${parseFloat(currentProduct.price.toString()).toFixed(2)}</p>
            </div>
            <p className="text-sm text-muted-foreground">{currentProduct.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {currentProduct.featured ? 'Currently featured on homepage' : 'Not featured on homepage'}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomepageManagementPage;
