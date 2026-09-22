import Navbar from './layout/Navbar';
import DashboardNavbar from './layout/DashboardNavbar';
import Footer from './layout/Footer';

export default function Layout({ children, dashboard = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {dashboard ? <DashboardNavbar /> : <Navbar />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
