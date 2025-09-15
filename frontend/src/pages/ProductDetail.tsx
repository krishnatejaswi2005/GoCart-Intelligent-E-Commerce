import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
	ArrowLeft,
	ShoppingCart,
	Heart,
	Share2,
	Star,
	TrendingUp,
	Package,
	Shield,
	Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import { apiService, Product, mockProducts } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
	const { id } = useParams<{ id: string }>();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [quantity, setQuantity] = useState(1);
	const { toast } = useToast();

	useEffect(() => {
		const fetchProduct = async () => {
			if (!id) return;

			try {
				// For demo purposes, use mock data. Replace with actual API call:
				const productData = await apiService.getProductById(id);
				// const productData = mockProducts.find(p => p._id === id);

				if (productData) {
					setProduct(productData);
				} else {
					toast({
						title: "Product not found",
						description: "The requested product could not be found.",
						variant: "destructive",
					});
				}
			} catch (error) {
				console.error("Error fetching product:", error);
				toast({
					title: "Error",
					description: "Failed to load product details.",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id, toast]);

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

	if (!product) {
		return (
			<div>
				<Header />
				<div className="min-h-screen flex items-center justify-center">
					<div className="text-center">
						<h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
						<Link to="/">
							<Button>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Home
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	const averageRating = product.reviews?.length
		? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
		  product.reviews.length
		: 0;

	const discountPercentage =
		product.actual_price > product.selling_price
			? Math.round(
					((product.actual_price - product.selling_price) /
						product.actual_price) *
						100
			  )
			: 0;

	const handleAddToCart = () => {
		toast({
			title: "Added to cart",
			description: `${quantity} x ${product.name} added to your cart.`,
		});
	};

	const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
		star,
		count: product.reviews?.filter((r) => r.rating === star).length || 0,
		percentage: product.reviews?.length
			? (product.reviews.filter((r) => r.rating === star).length /
					product.reviews.length) *
			  100
			: 0,
	}));

	return (
		<div>
			<Header />

			<div className="container mx-auto px-4 py-8">
				{/* Breadcrumb */}
				<nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
					<Link to="/" className="hover:text-primary">
						Home
					</Link>
					<span>/</span>
					<Link to="/products" className="hover:text-primary">
						Products
					</Link>
					<span>/</span>
					<span>{product.name}</span>
				</nav>

				<div className="grid lg:grid-cols-2 gap-12">
					{/* Product Images */}
					<div className="space-y-4">
						<div className="aspect-square rounded-xl overflow-hidden bg-surface">
							<img
								src={product.image_url || "/placeholder.svg"}
								alt={product.name}
								className="w-full h-full object-cover"
							/>
						</div>
					</div>

					{/* Product Info */}
					<div className="space-y-6">
						<div>
							<h1 className="text-3xl font-bold mb-2">{product.name}</h1>
							{product.description && (
								<p className="text-muted-foreground text-lg">
									{product.description}
								</p>
							)}
						</div>

						{/* Rating */}
						{product.reviews?.length ? (
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-1">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={`h-5 w-5 ${
												star <= averageRating
													? "fill-yellow-400 text-yellow-400"
													: "text-muted-foreground"
											}`}
										/>
									))}
								</div>
								<span className="text-sm text-muted-foreground">
									{averageRating.toFixed(1)} ({product.reviews.length} reviews)
								</span>
							</div>
						) : null}

						{/* Price */}
						<div className="space-y-2">
							<div className="flex items-center space-x-3">
								<span className="text-4xl font-bold text-primary">
									₹{product.predicted_price.toFixed(2)}
								</span>
								{product.actual_price > product.predicted_price && (
									<>
										<span className="text-xl text-muted-foreground line-through">
											₹{product.actual_price.toFixed(2)}
										</span>
										<Badge variant="destructive">
											Save {discountPercentage}%
										</Badge>
									</>
								)}
							</div>

							{/* AI Prediction */}
							{product.predicted_price && (
								<Card className="p-4 bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
									{/* <div className="flex items-center space-x-2">
										<TrendingUp className="h-5 w-5 text-success" />
										<span className="font-medium">AI Price Prediction:</span>
										<span className="text-xl font-bold text-success">
											₹{product.predicted_price.toFixed(2)}
										</span>
									</div> */}
									<p className="text-sm text-muted-foreground mt-1">
										Market price based on demand and trends
									</p>
								</Card>
							)}
						</div>

						{/* Stock Status */}
						<div className="flex items-center space-x-2">
							<Package className="h-5 w-5" />
							<span
								className={
									product.stock > 10
										? "text-success"
										: product.stock > 0
										? "text-warning"
										: "text-destructive"
								}
							>
								{product.stock > 10
									? "In Stock"
									: product.stock > 0
									? `Only ${product.stock} left`
									: "Out of Stock"}
							</span>
						</div>

						{/* Quantity Selector */}
						<div className="flex items-center space-x-4">
							<span className="font-medium">Quantity:</span>
							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									size="icon"
									onClick={() => setQuantity(Math.max(1, quantity - 1))}
									disabled={quantity <= 1}
								>
									-
								</Button>
								<span className="w-12 text-center">{quantity}</span>
								<Button
									variant="outline"
									size="icon"
									onClick={() =>
										setQuantity(Math.min(product.stock, quantity + 1))
									}
									disabled={quantity >= product.stock}
								>
									+
								</Button>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="space-y-3">
							<Button
								size="lg"
								className="w-full bg-gradient-primary text-lg py-6"
								onClick={handleAddToCart}
								disabled={product.stock === 0}
							>
								<ShoppingCart className="mr-2 h-5 w-5" />
								Add to Cart - ₹{(product.predicted_price * quantity).toFixed(2)}
							</Button>

							<div className="flex space-x-3">
								<Button variant="outline" size="lg" className="flex-1">
									<Heart className="mr-2 h-4 w-4" />
									Wishlist
								</Button>
								<Button variant="outline" size="lg" className="flex-1">
									<Share2 className="mr-2 h-4 w-4" />
									Share
								</Button>
							</div>
						</div>

						{/* Features */}
						<div className="grid grid-cols-3 gap-4 pt-6">
							<div className="text-center">
								<Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
								<p className="text-sm font-medium">2 Year Warranty</p>
							</div>
							<div className="text-center">
								<Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
								<p className="text-sm font-medium">Free Shipping</p>
							</div>
							<div className="text-center">
								<Package className="h-8 w-8 mx-auto mb-2 text-primary" />
								<p className="text-sm font-medium">Easy Returns</p>
							</div>
						</div>
					</div>
				</div>

				{/* Product Details Tabs */}
				<div className="mt-16">
					<Tabs defaultValue="specifications" className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="specifications">Specifications</TabsTrigger>
							<TabsTrigger value="reviews">
								Reviews ({product.reviews?.length || 0})
							</TabsTrigger>
							<TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
						</TabsList>

						<TabsContent value="specifications" className="mt-8">
							<Card>
								<CardHeader>
									<CardTitle>Product Specifications</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<h4 className="font-medium mb-2">Pricing Details</h4>
											<div className="space-y-2 text-sm">
												<div className="flex justify-between">
													<span>Retail Price:</span>
													<span>₹{product.actual_price.toFixed(2)}</span>
												</div>
												{/* <div className="flex justify-between">
													<span>Our Price:</span>
													<span className="font-medium text-primary">
														₹{product.selling_price.toFixed(2)}
													</span>
												</div> */}
												{product.ebay_price && (
													<div className="flex justify-between">
														<span>eBay Price:</span>
														<span>₹{product.ebay_price.toFixed(2)}</span>
													</div>
												)}
												{product.predicted_price && (
													<div className="flex justify-between">
														<span>Our Price:</span>
														<span className="font-medium text-success">
															₹{product.predicted_price.toFixed(2)}
														</span>
													</div>
												)}
											</div>
										</div>

										<div>
											<h4 className="font-medium mb-2">Market Data</h4>
											<div className="space-y-2 text-sm">
												{product.demand_index && (
													<div className="flex justify-between">
														<span>Demand Index:</span>
														<span>{product.demand_index}/100</span>
													</div>
												)}
												{product.user_interest && (
													<div className="flex justify-between">
														<span>User Interest:</span>
														<span>{product.user_interest}/100</span>
													</div>
												)}
												{product.sales && (
													<div className="flex justify-between">
														<span>Units Sold:</span>
														<span>{product.sales}</span>
													</div>
												)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="reviews" className="mt-8">
							<div className="grid lg:grid-cols-3 gap-8">
								{/* Rating Summary */}
								<Card>
									<CardHeader>
										<CardTitle>Customer Reviews</CardTitle>
									</CardHeader>
									<CardContent>
										{product.reviews?.length ? (
											<>
												<div className="text-center mb-6">
													<div className="text-4xl font-bold">
														{averageRating.toFixed(1)}
													</div>
													<div className="flex justify-center mb-2">
														{[1, 2, 3, 4, 5].map((star) => (
															<Star
																key={star}
																className={`h-5 w-5 ${
																	star <= averageRating
																		? "fill-yellow-400 text-yellow-400"
																		: "text-muted-foreground"
																}`}
															/>
														))}
													</div>
													<div className="text-sm text-muted-foreground">
														Based on {product.reviews.length} reviews
													</div>
												</div>

												<div className="space-y-2">
													{ratingDistribution.map(
														({ star, count, percentage }) => (
															<div
																key={star}
																className="flex items-center space-x-2 text-sm"
															>
																<span>{star}</span>
																<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
																<Progress
																	value={percentage}
																	className="flex-1"
																/>
																<span>{count}</span>
															</div>
														)
													)}
												</div>
											</>
										) : (
											<p className="text-muted-foreground">No reviews yet</p>
										)}
									</CardContent>
								</Card>

								{/* Reviews List */}
								<div className="lg:col-span-2 space-y-4">
									{product.reviews?.map((review, index) => (
										<Card key={index}>
											<CardContent className="p-6">
												<div className="flex items-start justify-between mb-3">
													<div>
														<h4 className="font-medium">{review.user}</h4>
														<div className="flex">
															{[1, 2, 3, 4, 5].map((star) => (
																<Star
																	key={star}
																	className={`h-4 w-4 ${
																		star <= review.rating
																			? "fill-yellow-400 text-yellow-400"
																			: "text-muted-foreground"
																	}`}
																/>
															))}
														</div>
													</div>
												</div>
												<p className="text-muted-foreground">
													{review.comment}
												</p>
											</CardContent>
										</Card>
									)) || (
										<p className="text-muted-foreground">
											No reviews available
										</p>
									)}
								</div>
							</div>
						</TabsContent>

						<TabsContent value="shipping" className="mt-8">
							<Card>
								<CardHeader>
									<CardTitle>Shipping & Returns</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<h4 className="font-medium mb-2">Shipping Information</h4>
										<ul className="space-y-1 text-sm text-muted-foreground">
											<li>• Free standard shipping on orders over ₹50</li>
											<li>• Express shipping available for ₹15.99</li>
											<li>• Estimated delivery: 3-5 business days</li>
											<li>• Ships from our certified warehouse</li>
										</ul>
									</div>

									<Separator />

									<div>
										<h4 className="font-medium mb-2">Return Policy</h4>
										<ul className="space-y-1 text-sm text-muted-foreground">
											<li>• 30-day return window</li>
											<li>• Items must be in original condition</li>
											<li>• Free return shipping</li>
											<li>• Full refund or exchange available</li>
										</ul>
									</div>

									<Separator />

									<div>
										<h4 className="font-medium mb-2">Warranty</h4>
										<ul className="space-y-1 text-sm text-muted-foreground">
											<li>• 2-year manufacturer warranty</li>
											<li>• Covers defects and malfunctions</li>
											<li>• Authorized repair centers nationwide</li>
											<li>• Extended warranty options available</li>
										</ul>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default ProductDetail;
