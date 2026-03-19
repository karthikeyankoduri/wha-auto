import React, { useState, useEffect } from 'react';
import { db, Campaign } from '../lib/store';
import { RefreshCw, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function CampaignTable({ refreshTrigger }: { refreshTrigger: number }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, [refreshTrigger]);

  const fetchCampaigns = () => {
    setLoading(true);
    try {
      const data = db.campaigns.getAll();
      setCampaigns(data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Campaign History</h2>
          <p className="text-sm text-zinc-500">Recent messaging campaigns</p>
        </div>
        <button 
          onClick={fetchCampaigns}
          disabled={loading}
          className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={18} className={cn(loading && "animate-spin")} />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-3 font-medium">Message Preview</th>
              <th className="px-6 py-3 font-medium">Target</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                  No campaigns found. Create one to get started.
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900 truncate max-w-[250px]">
                      {campaign.message}
                    </div>
                    <div className="text-xs text-zinc-500 font-mono mt-1">
                      ID: {campaign.id.substring(0, 8)}...
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {campaign.search_query ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        Search: "{campaign.search_query}"
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                        {campaign.range_start} - {campaign.range_end}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {campaign.status === 'completed' ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : campaign.status === 'failed' ? (
                        <AlertCircle size={16} className="text-red-500" />
                      ) : (
                        <Clock size={16} className="text-amber-500" />
                      )}
                      <span className={cn(
                        "text-xs font-medium capitalize",
                        campaign.status === 'completed' ? "text-emerald-700" :
                        campaign.status === 'failed' ? "text-red-700" :
                        "text-amber-700"
                      )}>
                        {campaign.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-500 whitespace-nowrap">
                    {new Date(campaign.created_at).toLocaleDateString()}
                    <br />
                    <span className="text-xs">
                      {new Date(campaign.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
