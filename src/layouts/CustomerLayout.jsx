import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Outlet } from "react-router-dom";
import "./CustomerLayout.css";

export default function CustomerLayout() {
  return (
    <div className="customer-layout">
      <Navbar />
      <main className="customer-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
