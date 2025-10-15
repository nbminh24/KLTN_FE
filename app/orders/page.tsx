import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Package } from 'lucide-react';

const orders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'Delivered',
    total: 467,
    items: 3,
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'Shipped',
    total: 325,
    items: 2,
  },
  {
    id: 'ORD-003',
    date: '2024-01-05',
    status: 'Processing',
    total: 189,
    items: 1,
  },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">My Orders</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-integral font-bold mb-8">My Orders</h1>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-4 rounded-xl">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{order.id}</h3>
                      <p className="text-gray-600 text-sm">Order date: {order.date}</p>
                      <p className="text-gray-600 text-sm">{order.items} items</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-xl font-bold">${order.total}</p>
                    </div>
                    <div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <Link
                      href={`/orders/${order.id}`}
                      className="border border-black px-6 py-2 rounded-full font-medium hover:bg-black hover:text-white transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
