'use client';
import { ArrowLeft, Plus, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';

export default function TopBar({ title, showAdd = false, showLogout = false, onAdd }: { title: string, showAdd?: boolean, showLogout?: boolean, onAdd?: () => void }) {
  const router = useRouter();
  const { logout } = useAppContext();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <div className="bg-[#0E472D] text-white p-4 flex items-center justify-between shadow-md">
      <button onClick={() => router.back()} className="p-1">
        <ArrowLeft size={24} />
      </button>
      <h1 className="text-sm font-semibold tracking-wider uppercase">{title}</h1>
      <div className="w-8 flex justify-end">
        {showAdd && (
          <button onClick={onAdd} className="p-1 text-white hover:text-gray-200">
            <Plus size={24} />
          </button>
        )}
        {showLogout && (
          <button onClick={handleLogout} className="p-1 text-white hover:text-red-300 transition-colors">
            <LogOut size={22} />
          </button>
        )}
      </div>
    </div>
  );
}
