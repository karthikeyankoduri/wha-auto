import React, { useState, useEffect } from 'react';
import { db, Contact, UploadBatch } from '../lib/store';
import { Users, Search, Trash2, FileSpreadsheet, ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export function UploadsTab() {
  const [batches, setBatches] = useState<UploadBatch[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: 'all' | 'single'; batchId?: string }>({ isOpen: false, type: 'single' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setBatches(db.batches.getAll());
    setContacts(db.contacts.getAll());
  };

  const clearAll = () => {
    setDeleteModal({ isOpen: true, type: 'all' });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.type === 'all') {
      db.contacts.saveAll([]);
      db.batches.saveAll([]);
      fetchData();
      toast.success('All uploads deleted');
    } else if (deleteModal.type === 'single' && deleteModal.batchId) {
      db.batches.delete(deleteModal.batchId);
      db.contacts.deleteByBatchId(deleteModal.batchId);
      fetchData();
      toast.success('Upload deleted');
    }
    setDeleteModal({ isOpen: false, type: 'single' });
  };

  const toggleBatch = (batchId: string) => {
    const newExpanded = new Set(expandedBatches);
    if (newExpanded.has(batchId)) {
      newExpanded.delete(batchId);
    } else {
      newExpanded.add(batchId);
    }
    setExpandedBatches(newExpanded);
  };

  const filteredBatches = batches.filter(b => 
    b.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Uploads</h1>
          <p className="text-sm text-zinc-500 mt-1">View your uploaded files and their contacts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none w-full sm:w-64"
            />
          </div>
          <button 
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBatches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <FileSpreadsheet size={48} className="text-zinc-300 mb-4" />
              <p className="text-base font-medium text-zinc-900">No uploads found</p>
              <p className="text-sm text-zinc-500 mt-1">Upload a file from the Campaigns tab to see it here.</p>
            </div>
          </div>
        ) : (
          filteredBatches.map(batch => {
            const isExpanded = expandedBatches.has(batch.id);
            const batchContacts = contacts.filter(c => c.batch_id === batch.id);

            return (
              <div key={batch.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors"
                  onClick={() => toggleBatch(batch.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <FileSpreadsheet size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900">{batch.file_name}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {batch.contact_count} contacts • Uploaded on {new Date(batch.created_at).toLocaleDateString()} at {new Date(batch.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-400">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModal({ isOpen: true, type: 'single', batchId: batch.id });
                      }}
                      className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete upload"
                    >
                      <Trash2 size={18} />
                    </button>
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-zinc-200 bg-zinc-50 p-4">
                    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 border-b border-zinc-200 sticky top-0">
                            <tr>
                              <th className="px-6 py-3 font-medium">Row #</th>
                              <th className="px-6 py-3 font-medium">Name</th>
                              <th className="px-6 py-3 font-medium">Phone Number</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 bg-white">
                            {batchContacts.map((contact) => (
                              <tr key={contact.id} className="hover:bg-zinc-50/50 transition-colors">
                                <td className="px-6 py-3 text-zinc-500 font-mono">
                                  {contact.row_number}
                                </td>
                                <td className="px-6 py-3 font-medium text-zinc-900">
                                  {contact.name || '-'}
                                </td>
                                <td className="px-6 py-3 text-zinc-600">
                                  {contact.phone || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                {deleteModal.type === 'all' ? 'Delete All Uploads' : 'Delete Upload'}
              </h3>
              <p className="text-sm text-zinc-500">
                {deleteModal.type === 'all' 
                  ? 'Are you sure you want to delete all uploaded files and their contacts? This action cannot be undone.'
                  : 'Are you sure you want to delete this uploaded file and its contacts? This action cannot be undone.'}
              </p>
            </div>
            <div className="bg-zinc-50 px-6 py-4 flex justify-end gap-3 border-t border-zinc-100">
              <button
                onClick={() => setDeleteModal({ isOpen: false, type: 'single' })}
                className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 bg-zinc-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
