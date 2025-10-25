import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#F5F6FA]">
      <div 
        className="flex h-screen bg-[#F5F6FA]" 
        style={{ 
          transform: 'scale(0.9)', 
          transformOrigin: 'top left',
          width: '111.11%',
          height: '111.11%'
        }}
      >
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <AdminTopBar />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
