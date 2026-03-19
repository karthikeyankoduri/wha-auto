import React, { useState, useEffect } from 'react';
import { db } from '../lib/store';
import toast from 'react-hot-toast';
import { Save, Link as LinkIcon } from 'lucide-react';

export function PreferencesTab() {
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    setWebhookUrl(db.settings.getWebhookUrl());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.settings.setWebhookUrl(webhookUrl);
    toast.success('Preferences saved successfully!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Preferences</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your application settings and integrations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden max-w-2xl">
        <div className="p-6 border-b border-zinc-200 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <LinkIcon size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Webhook Integration</h2>
              <p className="text-sm text-zinc-500">Configure where your campaigns are sent.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Webhook URL
            </label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
              placeholder="https://your-n8n-instance.com/webhook/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-zinc-500 mt-2">
              When you send a campaign, the message and selected contacts will be sent as a POST request to this URL.
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-100">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save size={16} />
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
