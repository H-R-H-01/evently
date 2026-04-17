'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { Users, Server, DollarSign, ChevronLeft } from 'lucide-react';

interface UserItem {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt: string;
  role: string;
}

interface WebsiteItem {
  id: string;
  userId: string;
  type: string;
  amountPaid: number;
  createdAt: string;
}

export default function AdminDashboard({ onBack }: { onBack?: () => void }) {
  const { userData } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [websites, setWebsites] = useState<WebsiteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.role !== 'admin') return;

    const fetchData = async () => {
      try {
        const uQ = query(collection(db, 'users'));
        const uSnap = await getDocs(uQ);
        const fetchedUsers: UserItem[] = [];
        uSnap.forEach(d => fetchedUsers.push(d.data() as UserItem));
        setUsers(fetchedUsers);

        const wQ = query(collection(db, 'websites'));
        const wSnap = await getDocs(wQ);
        const fetchedWebsites: WebsiteItem[] = [];
        wSnap.forEach(d => fetchedWebsites.push({ id: d.id, ...d.data() } as WebsiteItem));
        setWebsites(fetchedWebsites);
      } catch (err) {
        console.error('Error fetching admin data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  if (userData?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center bg-[#0a0b10] text-white">Access Denied</div>;
  }

  const totalRevenue = websites.reduce((acc, site) => acc + (site.amountPaid || 0), 0);

  return (
    <div className="min-h-screen bg-[#05050a] text-white p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex items-center gap-6 pb-6 border-b border-white/10">
           {onBack && (
             <button onClick={onBack} className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
               <ChevronLeft className="w-5 h-5" />
             </button>
           )}
           <div>
             <h1 className="text-4xl font-playfair mb-2 text-[#4db8ff]">Admin Portal</h1>
             <p className="text-gray-400 text-sm tracking-widest uppercase">System Overview</p>
           </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading metrics...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="p-6 bg-[#13151f] border border-[#1a1d2e] rounded-2xl flex items-center gap-6">
                 <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Users className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-1">Total Users</h3>
                    <p className="text-3xl font-mono">{users.length}</p>
                 </div>
               </div>
               
               <div className="p-6 bg-[#13151f] border border-[#1a1d2e] rounded-2xl flex items-center gap-6">
                 <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Server className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-1">Endpoints Generated</h3>
                    <p className="text-3xl font-mono">{websites.length}</p>
                 </div>
               </div>

               <div className="p-6 bg-[#13151f] border border-[#1a1d2e] rounded-2xl flex items-center gap-6">
                 <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <DollarSign className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-1">Revenue Collected</h3>
                    <p className="text-3xl font-mono text-green-400">₹{totalRevenue}</p>
                 </div>
               </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#13151f] border border-[#1a1d2e] rounded-2xl overflow-hidden">
               <div className="p-6 border-b border-[#1a1d2e]">
                 <h2 className="text-lg font-playfair font-bold">Registered Users</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-[#0a0b10] text-gray-500 text-[10px] uppercase tracking-widest">
                     <tr>
                       <th className="px-6 py-4 font-medium">Name</th>
                       <th className="px-6 py-4 font-medium">Email</th>
                       <th className="px-6 py-4 font-medium">User ID</th>
                       <th className="px-6 py-4 font-medium">Role</th>
                       <th className="px-6 py-4 font-medium">Joined</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#1a1d2e]">
                     {users.map(u => (
                       <tr key={u.uid} className="hover:bg-white/[0.02]">
                         <td className="px-6 py-4 font-medium text-white">{u.displayName || '-'}</td>
                         <td className="px-6 py-4 text-gray-400">{u.email || '-'}</td>
                         <td className="px-6 py-4 font-mono text-xs text-gray-500">{u.uid}</td>
                         <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {u.role}
                           </span>
                         </td>
                         <td className="px-6 py-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
