import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import ImportProducts from "./admin/ImportProducts";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";

// User Dashboard
import DashboardHome from "./dashboard/DashboardHome";
import Orders from "./dashboard/Orders";
import Downloads from "./dashboard/Downloads";
import Profile from "./dashboard/Profile";

// Admin Pages
import AdminHome from "./admin/AdminHome";
import AdminProducts from "./admin/Products";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import AdminOrders from "./admin/Orders";
import Users from "./admin/Users";

function App() {
  return (
    <>
      {/* Global Navbar */}
      <Navbar />

      <main className="min-h-screen
        bg-white text-black
        dark:bg-gray-900 dark:text-white
        transition-colors">
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================= USER ROUTES ================= */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/orders" element={<Orders />} />
            <Route path="/dashboard/downloads" element={<Downloads />} />
            <Route path="/dashboard/profile" element={<Profile />} />
          </Route>

          {/* ================= ADMIN ROUTES ================= */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/new" element={<AddProduct />} />
            <Route path="/admin/products/:id/edit"element={<EditProduct/>}/>
            <Route path="/admin/import" element={<ImportProducts />} />


            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<Users />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </>
  );
}

export default App;
