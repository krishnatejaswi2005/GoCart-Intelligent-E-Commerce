// API Service for TechStore Backend
export const API_BASE_URL = "http://localhost:5000/api/products";

export interface Product {
	_id: string;
	name: string;
	description?: string;
	actual_price: number;
	selling_price: number;
	ebay_price?: number;
	stock: number;
	demand_index?: number;
	user_interest?: number;
	sales?: number;
	day_of_week?: number;
	season?: number;
	image_url?: string;
	reviews?: Review[];
	predicted_price?: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface Review {
	user: string;
	comment: string;
	rating: number;
	createdAt?: string;
}

export interface CreateProductData {
	name: string;
	description?: string;
	actual_price: number;
	selling_price: number;
	ebay_price?: number;
	stock: number;
	demand_index?: number;
	user_interest?: number;
	sales?: number;
	day_of_week?: number;
	season?: number;
	image_url?: string;
}

class ApiService {
	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${API_BASE_URL}${endpoint}`;

		const config: RequestInit = {
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		};

		try {
			const response = await fetch(url, config);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error("API request failed:", error);
			throw error;
		}
	}

	// Product API methods
	async getProducts(): Promise<Product[]> {
		return this.request<Product[]>("/");
	}

	async getProductById(id: string): Promise<Product> {
		return this.request<Product>(`/${id}`);
	}

	async createProduct(data: CreateProductData): Promise<Product> {
		return this.request<Product>("/", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async updateProduct(
		id: string,
		data: Partial<CreateProductData>
	): Promise<Product> {
		return this.request<Product>(`/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		});
	}

	async deleteProduct(id: string): Promise<void> {
		return this.request<void>(`/${id}`, {
			method: "DELETE",
		});
	}
}

export const apiService = new ApiService();

// Mock data for development/demo purposes
export const mockProducts: Product[] = [
	{
		_id: "1",
		name: "iPhone 15 Pro Max",
		description:
			"The latest iPhone with A17 Pro chip, titanium design, and advanced camera system.",
		actual_price: 1199.99,
		selling_price: 1099.99,
		ebay_price: 1050.0,
		stock: 15,
		demand_index: 95,
		user_interest: 88,
		sales: 250,
		day_of_week: 3,
		season: 4,
		image_url:
			"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
		predicted_price: 1075.5,
		reviews: [
			{ user: "John D.", comment: "Amazing phone!", rating: 5 },
			{ user: "Sarah M.", comment: "Great camera quality", rating: 4 },
		],
	},
	{
		_id: "2",
		name: 'MacBook Pro 16"',
		description:
			"Powerful laptop with M3 Max chip, perfect for professionals and creators.",
		actual_price: 2499.99,
		selling_price: 2299.99,
		ebay_price: 2200.0,
		stock: 8,
		demand_index: 78,
		user_interest: 85,
		sales: 120,
		day_of_week: 2,
		season: 4,
		image_url:
			"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop",
		predicted_price: 2150.0,
		reviews: [{ user: "Mike R.", comment: "Excellent performance", rating: 5 }],
	},
	{
		_id: "3",
		name: "AirPods Pro (3rd Gen)",
		description:
			"Premium wireless earbuds with active noise cancellation and spatial audio.",
		actual_price: 249.99,
		selling_price: 199.99,
		ebay_price: 180.0,
		stock: 25,
		demand_index: 92,
		user_interest: 90,
		sales: 400,
		day_of_week: 5,
		season: 4,
		image_url:
			"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop",
		predicted_price: 185.5,
		reviews: [
			{ user: "Lisa K.", comment: "Great sound quality", rating: 5 },
			{ user: "Tom W.", comment: "Perfect fit", rating: 4 },
		],
	},
	{
		_id: "4",
		name: "Samsung Galaxy S24 Ultra",
		description:
			"Flagship Android phone with S Pen, advanced cameras, and powerful performance.",
		actual_price: 1299.99,
		selling_price: 1199.99,
		ebay_price: 1150.0,
		stock: 12,
		demand_index: 85,
		user_interest: 82,
		sales: 180,
		day_of_week: 1,
		season: 4,
		image_url:
			"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop",
		predicted_price: 1125.0,
		reviews: [{ user: "Alex P.", comment: "Amazing display", rating: 5 }],
	},
	{
		_id: "5",
		name: 'iPad Pro 12.9"',
		description:
			"Professional tablet with M2 chip, perfect for digital artists and productivity.",
		actual_price: 1099.99,
		selling_price: 999.99,
		ebay_price: 950.0,
		stock: 18,
		demand_index: 75,
		user_interest: 78,
		sales: 95,
		day_of_week: 4,
		season: 4,
		image_url:
			"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
		predicted_price: 925.0,
		reviews: [
			{ user: "Emma S.", comment: "Perfect for design work", rating: 5 },
		],
	},
	{
		_id: "6",
		name: "Apple Watch Ultra 2",
		description:
			"Rugged smartwatch designed for extreme sports and outdoor adventures.",
		actual_price: 799.99,
		selling_price: 749.99,
		ebay_price: 720.0,
		stock: 22,
		demand_index: 68,
		user_interest: 72,
		sales: 85,
		day_of_week: 6,
		season: 4,
		image_url:
			"https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop",
		predicted_price: 695.0,
		reviews: [
			{ user: "David L.", comment: "Durable and feature-rich", rating: 4 },
		],
	},
];
