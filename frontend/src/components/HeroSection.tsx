import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import heroImage from "@/assets/hero-electronics.jpg";
import productsShowcase from "@/assets/products-showcase.jpg";

const HeroSection = () => {
	return (
		<section
			id="home"
			className="relative min-h-screen flex items-center justify-center overflow-hidden"
		>
			{/* Background */}
			<div className="absolute inset-0 bg-gradient-hero" />
			<div
				className="absolute inset-0 opacity-20"
				style={{
					backgroundImage: `url(${heroImage})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>

			{/* Content */}
			<div className="relative z-10 container mx-auto px-4 py-20">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Left Column - Text Content */}
					<div className="text-center lg:text-left">
						<div className="inline-flex items-center space-x-2 bg-primary-subtle text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
							<Zap className="h-4 w-4" />
							<span>AI-Powered Price Predictions</span>
						</div>

						<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
							Premium
							<span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
								Electronics
							</span>
							<span className="block">Store</span>
						</h1>

						<p className="text-xl text-blue-100 mb-8 max-w-2xl">
							Discover cutting-edge electronics with AI-powered price
							predictions. Get the best deals on smartphones, laptops, and smart
							devices.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 mb-12">
							<Button
								size="lg"
								className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90"
							>
								Shop Now
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="text-lg px-8 py-4 border-white text-primary hover:bg-white/90 hover:text-primary"
							>
								View Products
							</Button>
						</div>

						{/* Features */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
							<div className="flex items-center space-x-3 text-white">
								<div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
									<Zap className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-semibold">AI Predictions</h3>
									<p className="text-sm text-blue-100">Smart pricing</p>
								</div>
							</div>

							<div className="flex items-center space-x-3 text-white">
								<div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
									<Shield className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-semibold">Warranty</h3>
									<p className="text-sm text-blue-100">2-year guarantee</p>
								</div>
							</div>

							<div className="flex items-center space-x-3 text-white">
								<div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
									<Truck className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-semibold">Fast Shipping</h3>
									<p className="text-sm text-blue-100">Free delivery</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Product Showcase */}
					<div className="relative">
						<div className="relative z-10">
							<img
								src={productsShowcase}
								alt="Premium Electronics Collection"
								className="w-full h-auto rounded-2xl shadow-2xl"
							/>
						</div>

						{/* Floating Elements */}
						<div className="absolute -top-6 -left-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
							<div className="flex items-center space-x-2 text-white">
								<div className="h-8 w-8 bg-success rounded-full flex items-center justify-center">
									<Zap className="h-4 w-4 text-white" />
								</div>
								<div>
									<p className="text-sm font-medium">Best Seller</p>
									<p className="text-xs text-blue-100">iPhone 15 Pro</p>
								</div>
							</div>
						</div>

						<div className="absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
							<div className="text-white text-center">
								<p className="text-2xl font-bold">1000+</p>
								<p className="text-xs text-blue-100">Happy Customers</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Decorative Elements */}
			<div className="absolute top-1/4 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl" />
			<div className="absolute bottom-1/4 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />
		</section>
	);
};

export default HeroSection;
