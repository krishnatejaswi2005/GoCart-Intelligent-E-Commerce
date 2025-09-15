import { Star, ShoppingCart, Eye, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Product {
	_id: string;
	name: string;
	description?: string;
	actual_price: number;
	selling_price: number;
	predicted_price?: number;
	stock: number;
	image_url?: string;
	reviews?: { rating: number }[];
}

interface ProductCardProps {
	product: Product;
	onAddToCart?: (productId: string) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
	// Calculate average rating
	const averageRating = product.reviews?.length
		? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
		  product.reviews.length
		: 0;

	// Calculate discount percentage
	const discountPercentage =
		product.actual_price > product.selling_price
			? Math.round(
					((product.actual_price - product.selling_price) /
						product.actual_price) *
						100
			  )
			: 0;

	return (
		<Card className="group product-card overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300">
			{/* Product Image */}
			<div className="relative aspect-square overflow-hidden bg-surface">
				<img
					src={product.image_url || "/placeholder.svg"}
					alt={product.name}
					className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
				/>

				{/* Discount Badge */}
				{discountPercentage > 0 && (
					<Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
						-{discountPercentage}%
					</Badge>
				)}

				{/* Stock Status */}
				{product.stock < 10 && (
					<Badge
						variant="outline"
						className="absolute top-2 right-2 bg-warning text-warning-foreground border-warning"
					>
						{product.stock < 5 ? "Low Stock" : `${product.stock} left`}
					</Badge>
				)}

				{/* Quick Actions Overlay */}
				<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
					<Button size="sm" variant="secondary" asChild>
						<Link to={`/product/${product._id}`}>
							<Eye className="h-4 w-4 mr-2" />
							View
						</Link>
					</Button>
					<Button
						size="sm"
						onClick={() => onAddToCart?.(product._id)}
						className="bg-primary hover:bg-primary-hover"
					>
						<ShoppingCart className="h-4 w-4 mr-2" />
						Add
					</Button>
				</div>
			</div>

			<CardContent className="p-4">
				{/* Product Name */}
				<Link to={`/product/${product._id}`}>
					<h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
						{product.name}
					</h3>
				</Link>

				{/* Description */}
				{product.description && (
					<p className="text-muted-foreground text-sm mb-3 line-clamp-2">
						{product.description}
					</p>
				)}

				{/* Rating */}
				{product.reviews?.length ? (
					<div className="flex items-center space-x-1 mb-3">
						<div className="flex">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star
									key={star}
									className={`h-4 w-4 ${
										star <= averageRating
											? "fill-yellow-400 text-yellow-400"
											: "text-muted-foreground"
									}`}
								/>
							))}
						</div>
						<span className="text-sm text-muted-foreground">
							({product.reviews.length})
						</span>
					</div>
				) : null}

				{/* Price Section */}
				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						<span className="text-2xl font-bold text-primary">
							₹{product.predicted_price.toFixed(2)}
						</span>
						{product.actual_price > product.selling_price && (
							<span className="text-sm text-muted-foreground line-through">
								₹{product.actual_price.toFixed(2)}
							</span>
						)}
					</div>

					{/* AI Predicted Price */}
					{/* {product.predicted_price && (
						<div className="flex items-center space-x-1 text-sm">
							<TrendingUp className="h-3 w-3 text-success" />
							<span className="text-muted-foreground">AI Prediction:</span>
							<span className="font-medium text-success">
								₹{product.predicted_price.toFixed(2)}
							</span>
						</div>
					)} */}
				</div>
			</CardContent>

			<CardFooter className="p-4 pt-0">
				<Button
					className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
					onClick={() => onAddToCart?.(product._id)}
					disabled={product.stock === 0}
				>
					{product.stock === 0 ? (
						"Out of Stock"
					) : (
						<>
							<ShoppingCart className="h-4 w-4 mr-2" />
							Add to Cart
						</>
					)}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default ProductCard;
