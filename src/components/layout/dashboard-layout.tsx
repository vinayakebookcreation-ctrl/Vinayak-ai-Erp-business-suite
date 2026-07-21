import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen bg-slate-100'>
      <Sidebar />

      <div className='flex flex-1 flex-col overflow-hidden'>
        <Topbar />

        <main className='flex-1 overflow-y-auto p-6'>
          {children}
        </main>
      </div>
    </div>
  );
}