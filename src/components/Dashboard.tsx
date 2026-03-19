import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { CampaignForm } from './CampaignForm';
import { CampaignTable } from './CampaignTable';

export function Dashboard({ onNavigateToUploads }: { onNavigateToUploads: () => void }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUploadSuccess = () => {
    handleRefresh();
    onNavigateToUploads();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Messaging Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your contacts and automate WhatsApp campaigns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Actions */}
        <div className="lg:col-span-1 space-y-6">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          <CampaignForm onCampaignCreated={handleRefresh} />
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2">
          <CampaignTable refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
