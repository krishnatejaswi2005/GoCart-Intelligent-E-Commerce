import { ShoppingCart, Search, Menu, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
	const location = useLocation();

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				{/* Logo */}
				<Link to="/" className="flex items-center space-x-2">
					<div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
						<span className="text-primary-foreground font-bold text-sm">
							Go
						</span>
					</div>
					<span className="font-bold text-xl">Cart</span>
				</Link>

				{/* Navigation */}
				<nav className="hidden md:flex items-center space-x-6">
					<a
						href="/"
						className={`transition-colors hover:text-primary ${
							location.pathname === "/"
								? "text-primary"
								: "text-muted-foreground"
						}`}
					>
						Home
					</a>
					<a
						href="/#products"
						className={`transition-colors hover:text-primary ${
							location.pathname === "/products"
								? "text-primary"
								: "text-muted-foreground"
						}`}
					>
						Products
					</a>
					<Link
						to="/admin"
						className={`transition-colors hover:text-primary ${
							location.pathname.startsWith("/admin")
								? "text-primary"
								: "text-muted-foreground"
						}`}
					>
						Admin
					</Link>
				</nav>

				{/* Search */}
				<div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
					<div className="relative w-full">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							placeholder="Search electronics..."
							className="pl-10 bg-surface"
						/>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center space-x-4">
					{/* Cart */}
					<Button variant="ghost" size="icon" className="relative">
						<ShoppingCart className="h-5 w-5" />
						<Badge
							variant="destructive"
							className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
						>
							3
						</Badge>
					</Button>

					{/* User Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<User className="h-5 w-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								Settings
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Sign Out</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Mobile Menu */}
					<Button variant="ghost" size="icon" className="md:hidden">
						<Menu className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</header>
	);
};

export default Header;
