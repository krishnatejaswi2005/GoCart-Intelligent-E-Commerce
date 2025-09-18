# 🛍️ AI-Powered Product Price Prediction Platform

This project is a **Full-Stack Web Application** integrated with an **AI-powered microservice** that predicts product prices based on product attributes.

The system is designed for **e-commerce scenarios** where sellers can upload product details and instantly receive **predicted fair market prices** using a trained machine learning model.

It is divided into two main parts:

1. **Frontend + Backend (MERN Stack)** – Manages product CRUD operations, user interactions, and API integration.
2. **AI Microservice (FastAPI + ML model)** – Handles product price prediction requests.

---

## ✨ Features

### 🌐 Website (Frontend + Backend)

* ✅ **Product Management**

  * Add, edit, delete, and view products.
* ✅ **AI Predicted Price Integration**

  * When a new product is created, the system automatically queries the AI microservice.
  * Predicted price is saved in the database and displayed alongside product details.
* ✅ **RESTful APIs**

  * `POST /api/products` → Add a product (triggers prediction)
  * `GET /api/products` → Get all products
  * `GET /api/products/:id` → Get product by ID
  * `PUT /api/products/:id` → Update product
  * `DELETE /api/products/:id` → Delete product

---

### 🤖 AI Microservice

* Built using **FastAPI** and a trained **Machine Learning model**.
* Accepts product details and returns a **predicted price**.
* Runs independently and communicates with the backend via REST APIs.

**Example Endpoint:**
`POST /predict`

**Sample Request:**

```json
{
  "product_name": "iPhone 14",
  "category": "Electronics",
  "brand": "Apple",
  "features": {
    "storage": "128GB",
    "color": "Black",
    "warranty": "1 Year"
  }
}
```

**Sample Response:**

```json
{
  "predicted_price": 799.99
}
```

---

## 🚀 How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/krishnatejaswi2005/GoCart-Intelligent-E-Commerce.git
cd GoCart-Intelligent-E-Commerce
```

---

### 2️⃣ Setup Backend (Express.js + MongoDB)

```bash
cd backend
npm install
```

* Create a `.env` file inside `backend/`:

```env
MONGO_URI=mongodb://localhost:27017/price-predictor
PORT=5000
AI_MICROSERVICE_URL=http://127.0.0.1:8000/predict
```

* Start backend server:

```bash
npm start
```

---

### 3️⃣ Setup Frontend (React.js)

```bash
cd frontend
npm install
npm start
```

Runs on: `http://localhost:3000`

---

### 4️⃣ Setup AI Microservice (FastAPI + ML Model via Conda)

1. Open **Anaconda Prompt** and create a virtual environment:

   ```bash
   conda create -n ai-microservice python=3.10 -y
   ```

2. Activate the environment:

   ```bash
   conda activate ai-microservice
   ```

3. Install dependencies:

   ```bash
   cd ai-microservice
   pip install -r requirements.txt
   ```

4. Navigate to the `src` directory and run the app:

   ```bash
   cd src
   python app_fastapi.py
   ```

5. The AI microservice will be live at:
   **FASTAPI\_URL = [http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

### 5️⃣ Test the System

* Open `http://localhost:3000` in the browser.
* Add a product → backend calls the AI microservice → predicted price is generated and displayed.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Material UI, Axios
* **Backend:** Node.js, Express.js, MongoDB
* **AI Microservice:** FastAPI, Scikit-learn / TensorFlow (depending on model)
* **Deployment:** Render, Vercel

---

## 🔮 Future Improvements

* 📦 Bulk product uploads (CSV/Excel).
* 📊 Analytics dashboard with visualization.
* ☁️ Deploy AI microservice on the cloud with auto-scaling.
* 🔐 Authentication and user roles.
