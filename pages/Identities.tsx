import React, { useEffect, useState } from 'react';
import { OryClient } from '../services/oryClient';
import { User } from '../types';
import { Search, Mail, Phone, Calendar, MoreVertical, Shield } from 'lucide-react';

export const Identities: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await OryClient.identity.list();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.traits.email.toLowerCase().includes(filter.toLowerCase()) || 
    (u.traits.firstName && u.traits.firstName.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Identities</h1>
          <p className="text-slate-400">Manage users and identities stored in Ory Kratos.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search identities..." 
            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 w-full md:w-64"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
        {loading ? (
           <div className="flex-1 flex items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold border border-slate-700">
                          {user.traits.firstName ? user.traits.firstName[0] : user.traits.email[0].toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-white">
                            {user.traits.firstName} {user.traits.lastName}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">{user.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-slate-300">
                          <Mail className="w-3 h-3 mr-2 text-slate-500" />
                          {user.traits.email}
                        </div>
                        {user.traits.phone && (
                          <div className="flex items-center text-sm text-slate-300">
                            <Phone className="w-3 h-3 mr-2 text-slate-500" />
                            {user.traits.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.state === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {user.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2 text-slate-600" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
