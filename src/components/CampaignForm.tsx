import React, { useState, useEffect } from 'react';
import { db, UploadBatch, Contact } from '../lib/store';
import toast from 'react-hot-toast';
import { Send, Users, Search, ListOrdered } from 'lucide-react';

export function CampaignForm({ onCampaignCreated }: { onCampaignCreated: () => void }) {
  const [message, setMessage] = useState('');
  const [selectionMode, setSelectionMode] = useState<'range' | 'search'>('range');
  const [rangeStart, setRangeStart] = useState<number | ''>('');
  const [rangeEnd, setRangeEnd] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [batches, setBatches] = useState<UploadBatch[]>([]);
  const [batchContacts, setBatchContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatchId) {
      const allContacts = db.contacts.getAll();
      setBatchContacts(allContacts.filter(c => c.batch_id === selectedBatchId));
    } else {
      setBatchContacts([]);
    }
  }, [selectedBatchId]);

  const fetchBatches = () => {
    const allBatches = db.batches.getAll();
    setBatches(allBatches);
    if (allBatches.length > 0 && !selectedBatchId) {
      setSelectedBatchId(allBatches[0].id);
    }
  };

  const selectedBatch = batches.find(b => b.id === selectedBatchId);
  const totalContacts = selectedBatch ? selectedBatch.contact_count : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBatchId) {
      toast.error('Please select an upload file');
      return;
    }

    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }
    
    if (selectionMode === 'range') {
      if (rangeStart === '' || rangeEnd === '') {
        toast.error('Please specify a range');
        return;
      }

      if (rangeStart > rangeEnd) {
        toast.error('Start range must be less than or equal to end range');
        return;
      }

      if (rangeEnd > totalContacts) {
        toast.error(`End range cannot exceed total contacts in file (${totalContacts})`);
        return;
      }
    } else {
      if (!searchQuery.trim()) {
        toast.error('Please enter a search term');
        return;
      }
    }

    setLoading(true);

    try {
      const campaign = db.campaigns.add({
        message,
        batch_id: selectedBatchId,
        range_start: selectionMode === 'range' ? (rangeStart as number) : undefined,
        range_end: selectionMode === 'range' ? (rangeEnd as number) : undefined,
        search_query: selectionMode === 'search' ? searchQuery : undefined
      });

      // Fetch fresh from DB to ensure we have the data
      const allContacts = db.contacts.getAll();
      const currentBatchContacts = allContacts.filter(c => c.batch_id === selectedBatchId);
      
      if (currentBatchContacts.length === 0) {
        toast.error('No contacts found for this file. The upload may have failed due to browser storage limits.');
        setLoading(false);
        return;
      }

      let selectedContacts: Contact[] = [];
      if (selectionMode === 'range') {
        const start = Number(rangeStart);
        const end = Number(rangeEnd);
        selectedContacts = currentBatchContacts.filter(c => {
          const rowNum = Number(c.row_number);
          return rowNum >= start && rowNum <= end;
        });
      } else {
        const query = searchQuery.toLowerCase().trim();
        selectedContacts = currentBatchContacts.filter(c => 
          (c.name && c.name.toLowerCase().includes(query)) || 
          (c.phone && c.phone.toLowerCase().includes(query)) ||
          (c.row_number.toString() === query)
        );
      }
      
      if (selectedContacts.length === 0) {
        toast.error(selectionMode === 'range' ? 'No contacts found in the specified range.' : 'No contacts found matching your search.');
        setLoading(false);
        return;
      }
      
      const payload = {
        campaign_id: campaign.id,
        batch_id: selectedBatchId,
        message: message,
        contacts: selectedContacts.map(c => ({
          name: c.name,
          phone: c.phone,
          row_number: c.row_number
        }))
      };

      const webhookUrl = db.settings.getWebhookUrl();
      
      if (!webhookUrl) {
        toast.error('Please configure a Webhook URL in Preferences first.');
        setLoading(false);
        return;
      }

      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        toast.success('Campaign triggered successfully!');
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
        toast.error('Campaign saved, but webhook failed to trigger.');
      }

      setMessage('');
      setRangeStart('');
      setRangeEnd('');
      setSearchQuery('');
      onCampaignCreated();
    } catch (error: any) {
      console.error('Campaign error:', error);
      toast.error(error.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedContacts = () => {
    if (selectionMode === 'range') {
      if (rangeStart === '' || rangeEnd === '' || rangeStart > rangeEnd) return [];
      return batchContacts.filter(c => c.row_number >= rangeStart && c.row_number <= rangeEnd);
    } else {
      if (!searchQuery.trim()) return [];
      const query = searchQuery.toLowerCase().trim();
      return batchContacts.filter(c => 
        (c.name && c.name.toLowerCase().includes(query)) || 
        (c.phone && c.phone.toLowerCase().includes(query)) ||
        (c.row_number.toString() === query)
      );
    }
  };

  const selectedContactsList = getSelectedContacts();
  const selectedCount = selectedContactsList.length;
  const previewContacts = selectedContactsList.slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900 mb-4">Create Campaign</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Select Upload File
          </label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
          >
            <option value="" disabled>-- Select a file --</option>
            {batches.map(batch => (
              <option key={batch.id} value={batch.id}>
                {batch.file_name} ({batch.contact_count} contacts)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Message Template
          </label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors resize-none"
            placeholder="Hello {{name}}, this is a test message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="text-xs text-zinc-500 mt-1.5">
            Use <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-700">{"{{name}}"}</code> to personalize the message.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Recipient Selection
          </label>
          <div className="flex bg-zinc-100 p-1 rounded-lg mb-4 w-fit">
            <button
              type="button"
              onClick={() => setSelectionMode('range')}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectionMode === 'range' 
                  ? 'bg-white text-zinc-900 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <ListOrdered size={16} />
              By Range
            </button>
            <button
              type="button"
              onClick={() => setSelectionMode('search')}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectionMode === 'search' 
                  ? 'bg-white text-zinc-900 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <Search size={16} />
              By Name/Number
            </button>
          </div>

          {selectionMode === 'range' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Start Range
                </label>
                <input
                  type="number"
                  min="1"
                  max={totalContacts || 1}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                  placeholder="e.g. 1"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  End Range
                </label>
                <input
                  type="number"
                  min="1"
                  max={totalContacts || 1}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                  placeholder={`e.g. ${totalContacts || 300}`}
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value ? Number(e.target.value) : '')}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Search Contact
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                  placeholder="Enter name, phone number, or row..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
          <div className="flex items-center gap-2 text-indigo-700">
            <Users size={18} />
            <span className="text-sm font-medium">Recipients Selected:</span>
          </div>
          <span className="text-lg font-bold text-indigo-700">
            {selectedCount > 0 ? selectedCount : 0} <span className="text-sm font-normal text-indigo-500">/ {totalContacts} total</span>
          </span>
        </div>

        {selectedCount > 0 && previewContacts.length > 0 && (
          <div className="border border-zinc-200 rounded-xl overflow-hidden mt-4">
            <div className="bg-zinc-50 px-4 py-2 border-b border-zinc-200 flex justify-between items-center">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Preview (First {previewContacts.length} of {selectedCount})</p>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 bg-white border-b border-zinc-100">
                <tr>
                  <th className="px-4 py-2 font-medium">Row</th>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {previewContacts.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-2 text-zinc-500 font-mono">{c.row_number}</td>
                    <td className="px-4 py-2 text-zinc-900">{c.name || '-'}</td>
                    <td className="px-4 py-2 text-zinc-600">{c.phone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || selectedCount <= 0 || !selectedBatchId}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Sending...' : (
            <>
              <Send size={18} />
              Send Campaign
            </>
          )}
        </button>
      </form>
    </div>
  );
}
