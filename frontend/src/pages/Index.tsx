import { useState, useEffect } from "react";
import { ArrowRight, TrendingUp, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { apiService, Product, mockProducts } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
	const { toast } = useToast();

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				// For demo purposes, use mock data. Replace with actual API call:
				const data = await apiService.getProducts();
				setProducts(data);

				// Set featured products (top 4 by demand index)
				const featured = data
					.sort((a, b) => (b.demand_index || 0) - (a.demand_index || 0))
					.slice(0, 4);
				setFeaturedProducts(featured);
			} catch (error) {
				console.error("Error fetching products:", error);
				toast({
					title: "Error",
					description: "Failed to load products.",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [toast]);

	const handleAddToCart = (productId: string) => {
		const product = products.find((p) => p._id === productId);
		if (product) {
			toast({
				title: "Added to cart",
				description: `${product.name} added to your cart.`,
			});
		}
	};

	const stats = [
		{
			title: "Products Available",
			value: products.length.toString(),
			icon: TrendingUp,
			color: "text-primary",
		},
		{
			title: "Happy Customers",
			value: "1,200+",
			icon: Users,
			color: "text-success",
		},
		{
			title: "Average Rating",
			value: "4.8",
			icon: Star,
			color: "text-warning",
		},
		{
			title: "Years Experience",
			value: "10+",
			icon: TrendingUp,
			color: "text-primary",
		},
	];

	return (
		<div className="min-h-screen">
			<Header />

			{/* Hero Section */}
			<HeroSection />

			{/* Stats Section */}
			<section className="py-16 bg-surface/50">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{stats.map((stat, index) => (
							<Card key={index} className="text-center border-0 shadow-sm">
								<CardContent className="p-6">
									<div
										className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4`}
									>
										<stat.icon className={`h-6 w-6 ${stat.color}`} />
									</div>
									<div className="text-2xl font-bold mb-1">{stat.value}</div>
									<div className="text-sm text-muted-foreground">
										{stat.title}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Featured Products Section */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
							Featured Products
						</Badge>
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Trending Electronics
						</h2>
						<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
							Discover our most popular electronics with AI-powered price
							predictions
						</p>
					</div>

					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{[1, 2, 3, 4].map((i) => (
								<Card key={i} className="animate-pulse">
									<div className="aspect-square bg-muted rounded-t-lg"></div>
									<CardContent className="p-4">
										<div className="h-4 bg-muted rounded mb-2"></div>
										<div className="h-4 bg-muted rounded w-2/3"></div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{featuredProducts.map((product) => (
								<ProductCard
									key={product._id}
									product={product}
									onAddToCart={handleAddToCart}
								/>
							))}
						</div>
					)}
				</div>
			</section>

			{/* All Products Section */}
			<section className="py-16 bg-surface/30">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between mb-12">
						<div>
							<h2 className="text-3xl font-bold mb-2" id="products">
								All Products
							</h2>
							<p className="text-muted-foreground">
								Explore our complete electronics collection
							</p>
						</div>
						<Button variant="outline" className="hidden md:flex">
							View All
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</div>

					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
								<Card key={i} className="animate-pulse">
									<div className="aspect-square bg-muted rounded-t-lg"></div>
									<CardContent className="p-4">
										<div className="h-4 bg-muted rounded mb-2"></div>
										<div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
										<div className="h-6 bg-muted rounded w-1/2"></div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{products.map((product) => (
								<ProductCard
									key={product._id}
									product={product}
									onAddToCart={handleAddToCart}
								/>
							))}
						</div>
					)}
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-gradient-primary text-primary-foreground">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Ready to Upgrade Your Tech?
					</h2>
					<p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
						Join thousands of satisfied customers and get the latest electronics
						with AI-powered price predictions.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" variant="secondary" className="text-lg px-8 py-4">
							Shop Now
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="text-lg px-8 py-4 border-white text-primary hover:bg-white hover:text-primary"
						>
							Learn More
						</Button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-muted py-12">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center space-x-2 mb-4">
								<div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
									<span className="text-primary-foreground font-bold text-sm">
										Go
									</span>
								</div>
								<span className="font-bold text-xl">Cart</span>
							</div>
							<p className="text-muted-foreground mb-4">
								Your trusted source for premium electronics with AI-powered
								insights.
							</p>
						</div>

						<div>
							<h4 className="font-semibold mb-4">Quick Links</h4>
							<ul className="space-y-2 text-muted-foreground">
								<li>
									<a href="#" className="hover:text-primary transition-colors">
										Home
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition-colors">
										Products
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition-colors">
										About Us
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition-colors">
										Contact
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-semibold mb-4">Support</h4>
							<ul className="space-y-2 text-muted-foreground">
								<li>
									<a href="#" className="hover:text-primary transition-colors">
										Help Center
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition-colors">
										Shipping Info
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition-colors">
										Returns
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition-colors">
										Warranty
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-semibold mb-4">Legal</h4>
							<ul className="space-y-2 text-muted-foreground">
								<li>
									<a href="#" className="hover:text-primary transition-colors">
										Privacy Policy
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition-colors">
										Terms of Service
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition-colors">
										Cookie Policy
									</a>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t mt-8 pt-8 text-center text-muted-foreground">
						<p>&copy; 2024 GoCart. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Index;
