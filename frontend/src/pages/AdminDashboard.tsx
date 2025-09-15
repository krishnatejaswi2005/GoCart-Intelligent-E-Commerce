import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { apiService, Product, CreateProductData, mockProducts } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  // Form state for create/edit
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    description: "",
    actual_price: 0,
    selling_price: 0,
    ebay_price: 0,
    stock: 0,
    demand_index: 0,
    user_interest: 0,
    sales: 0,
    day_of_week: 1,
    season: 1,
    image_url: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // For demo purposes, use mock data. Replace with actual API call:
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      // For demo purposes, simulate creation. Replace with actual API call:
      const newProduct = await apiService.createProduct(formData);
      // const newProduct: Product = {
      //   ...formData,
      //   _id: Date.now().toString(),
      //   predicted_price: formData.selling_price * 0.95, // Mock prediction
      //   reviews: [],
      //   createdAt: new Date().toISOString(),
      //   updatedAt: new Date().toISOString(),
      // };
      
      setProducts([...products, newProduct]);
      setShowCreateDialog(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Product created successfully.",
      });
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      // For demo purposes, simulate update. Replace with actual API call:
      const updatedProduct = await apiService.updateProduct(editingProduct._id, formData);
      // const updatedProduct: Product = {
      //   ...editingProduct,
      //   ...formData,
      //   predicted_price: formData.selling_price * 0.95, // Mock prediction
      //   updatedAt: new Date().toISOString(),
      // };
      
      setProducts(products.map(p => p._id === editingProduct._id ? updatedProduct : p));
      setEditingProduct(null);
      resetForm();
      
      toast({
        title: "Success",
        description: "Product updated successfully.",
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      // For demo purposes, simulate deletion. Replace with actual API call:
      await apiService.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      actual_price: 0,
      selling_price: 0,
      ebay_price: 0,
      stock: 0,
      demand_index: 0,
      user_interest: 0,
      sales: 0,
      day_of_week: 1,
      season: 1,
      image_url: "",
    });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      actual_price: product.actual_price,
      selling_price: product.selling_price,
      ebay_price: product.ebay_price || 0,
      stock: product.stock,
      demand_index: product.demand_index || 0,
      user_interest: product.user_interest || 0,
      sales: product.sales || 0,
      day_of_week: product.day_of_week || 1,
      season: product.season || 1,
      image_url: product.image_url || "",
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProductForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
          />
        </div>
        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="Enter image URL"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="actual_price">Actual Price (₹)</Label>
          <Input
            id="actual_price"
            type="number"
            value={formData.actual_price}
            onChange={(e) => setFormData({ ...formData, actual_price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="selling_price">Selling Price (₹)</Label>
          <Input
            id="selling_price"
            type="number"
            value={formData.selling_price}
            onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="ebay_price">eBay Price (₹)</Label>
          <Input
            id="ebay_price"
            type="number"
            value={formData.ebay_price}
            onChange={(e) => setFormData({ ...formData, ebay_price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="sales">Sales Count</Label>
          <Input
            id="sales"
            type="number"
            value={formData.sales}
            onChange={(e) => setFormData({ ...formData, sales: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label htmlFor="demand_index">Demand Index (0-100)</Label>
          <Input
            id="demand_index"
            type="number"
            min="0"
            max="100"
            value={formData.demand_index}
            onChange={(e) => setFormData({ ...formData, demand_index: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="user_interest">User Interest (0-100)</Label>
          <Input
            id="user_interest"
            type="number"
            min="0"
            max="100"
            value={formData.user_interest}
            onChange={(e) => setFormData({ ...formData, user_interest: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="day_of_week">Day of Week (1-7)</Label>
          <Input
            id="day_of_week"
            type="number"
            min="1"
            max="7"
            value={formData.day_of_week}
            onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) || 1 })}
            placeholder="1"
          />
        </div>
        <div>
          <Label htmlFor="season">Season (1-4)</Label>
          <Input
            id="season"
            type="number"
            min="1"
            max="4"
            value={formData.season}
            onChange={(e) => setFormData({ ...formData, season: parseInt(e.target.value) || 1 })}
            placeholder="1"
          />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Product</DialogTitle>
              </DialogHeader>
              <ProductForm />
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProduct}>
                  Create Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.reduce((acc, p) => acc + p.stock, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {products.filter(p => p.stock < 10).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{products.reduce((acc, p) => acc + (p.sales || 0) * p.selling_price, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>AI Prediction</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image_url || '/placeholder.svg'}
                          alt={product.name}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.description?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">₹{product.selling_price.toFixed(2)}</div>
                        {product.actual_price > product.selling_price && (
                          <div className="text-sm text-muted-foreground line-through">
                            ₹{product.actual_price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                        {product.stock} units
                      </Badge>
                    </TableCell>
                    <TableCell>{product.sales || 0}</TableCell>
                    <TableCell>
                      {product.predicted_price ? (
                        <span className="text-success font-medium">
                          ₹{product.predicted_price.toFixed(2)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 0 ? 'default' : 'secondary'}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openEditDialog(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                            </DialogHeader>
                            <ProductForm />
                            <div className="flex justify-end space-x-2 pt-4">
                              <Button variant="outline" onClick={() => setEditingProduct(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateProduct}>
                                Update Product
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;