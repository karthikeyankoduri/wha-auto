export interface Contact {
  id: string;
  batch_id: string;
  name: string;
  phone: string;
  row_number: number;
  created_at: string;
}

export interface UploadBatch {
  id: string;
  file_name: string;
  contact_count: number;
  created_at: string;
}

export interface Campaign {
  id: string;
  batch_id?: string;
  message: string;
  range_start?: number;
  range_end?: number;
  search_query?: string;
  status: string;
  created_at: string;
}

export const db = {
  settings: {
    getWebhookUrl: (): string => localStorage.getItem('webhookUrl') || '',
    setWebhookUrl: (url: string) => localStorage.setItem('webhookUrl', url),
  },
  contacts: {
    getAll: (): Contact[] => JSON.parse(localStorage.getItem('contacts') || '[]'),
    saveAll: (data: Contact[]) => localStorage.setItem('contacts', JSON.stringify(data)),
    addBatch: (newContacts: Omit<Contact, 'id' | 'created_at'>[]) => {
      const existing = db.contacts.getAll();
      const toAdd = newContacts.map(c => ({
        ...c,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      }));
      db.contacts.saveAll([...existing, ...toAdd]);
    },
    count: (): number => db.contacts.getAll().length,
    getMaxRow: (): number => {
      const all = db.contacts.getAll();
      if (all.length === 0) return 0;
      return Math.max(...all.map(c => c.row_number));
    },
    deleteByBatchId: (batchId: string) => {
      const existing = db.contacts.getAll();
      db.contacts.saveAll(existing.filter(c => c.batch_id !== batchId));
    }
  },
  batches: {
    getAll: (): UploadBatch[] => JSON.parse(localStorage.getItem('batches') || '[]'),
    saveAll: (data: UploadBatch[]) => localStorage.setItem('batches', JSON.stringify(data)),
    add: (batch: Omit<UploadBatch, 'id' | 'created_at'>): UploadBatch => {
      const existing = db.batches.getAll();
      const newBatch: UploadBatch = {
        ...batch,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      };
      db.batches.saveAll([newBatch, ...existing]);
      return newBatch;
    },
    delete: (id: string) => {
      const existing = db.batches.getAll();
      db.batches.saveAll(existing.filter(b => b.id !== id));
    }
  },
  campaigns: {
    getAll: (): Campaign[] => JSON.parse(localStorage.getItem('campaigns') || '[]'),
    saveAll: (data: Campaign[]) => localStorage.setItem('campaigns', JSON.stringify(data)),
    add: (campaign: Omit<Campaign, 'id' | 'created_at' | 'status'>): Campaign => {
      const existing = db.campaigns.getAll();
      const newCampaign: Campaign = {
        ...campaign,
        id: crypto.randomUUID(),
        status: 'completed', // We mark it completed for the UI demo
        created_at: new Date().toISOString()
      };
      db.campaigns.saveAll([newCampaign, ...existing]);
      return newCampaign;
    }
  }
};
