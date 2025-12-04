import React from 'react';
import { APPS, MOCK_USERS, KETO_TUPLES } from '../services/mockData';
import { Activity, Shield, Users, Server } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Identities', value: MOCK_USERS.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Sessions', value: '12', icon: Activity, color: 'bg-emerald-500' },
    { label: 'Permission Tuples', value: KETO_TUPLES.length, icon: Shield, color: 'bg-purple-500' },
    { label: 'Registered Apps', value: APPS.length, icon: Server, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
        <p className="text-slate-400">Real-time metrics from your Ory Ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <h3 className="text-slate-400 font-medium text-sm">{stat.label}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Connected Applications</h3>
          <div className="space-y-4">
            {APPS.map(app => (
              <div key={app.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 border border-slate-600`}>
                    <span className="font-bold text-lg uppercase">{app.name.substring(0, 1)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{app.name}</h4>
                    <p className="text-xs text-slate-400">{app.domain}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                  Healthy
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Audit Logs</h3>
          <div className="space-y-4">
            {[
              { time: '10:42 AM', action: 'Identity Created', user: 'system', status: 'Success' },
              { time: '10:38 AM', action: 'Permission Check', user: 'u-102', status: 'Allowed' },
              { time: '10:15 AM', action: 'Login Attempt', user: 'u-103', status: 'Failed (OTP)' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{log.action}</p>
                  <p className="text-xs text-slate-500">{log.user} • {log.time}</p>
                </div>
                <span className={`text-xs ${log.status.includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};