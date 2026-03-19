import { 
  MessageSquare, 
  Users, 
  Settings, 
  Send,
  UploadCloud,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import React, { useState } from 'react';
import { cn } from "@/src/lib/utils";

export function Sidebar({ 
  className, 
  activeTab, 
  onTabChange 
}: { 
  className?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={cn(
      "flex flex-col h-full bg-zinc-950 text-zinc-300 border-r border-zinc-800 transition-all duration-300 relative", 
      isExpanded ? "w-64" : "w-20",
      className
    )}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-8 bg-zinc-800 text-zinc-400 hover:text-white rounded-full p-1 border border-zinc-700 hover:bg-zinc-700 z-10 transition-colors"
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className={cn("p-6 flex items-center gap-3 text-white font-semibold text-lg tracking-tight overflow-hidden whitespace-nowrap", !isExpanded && "justify-center px-0")}>
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        {isExpanded && <span>BulkSender</span>}
      </div>

      <div className={cn("flex-1 py-6 space-y-1 overflow-hidden", isExpanded ? "px-4" : "px-3")}>
        {isExpanded ? (
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2 whitespace-nowrap">
            Menu
          </div>
        ) : (
          <div className="h-4 mb-4 border-b border-zinc-800/50 mx-2"></div>
        )}
        
        <NavItem 
          icon={<Send size={20} />} 
          label="Campaigns" 
          active={activeTab === 'campaigns'} 
          onClick={() => onTabChange('campaigns')}
          isExpanded={isExpanded}
        />
        <NavItem 
          icon={<UploadCloud size={20} />} 
          label="Uploads" 
          active={activeTab === 'uploads'} 
          onClick={() => onTabChange('uploads')}
          isExpanded={isExpanded}
        />
        
        {isExpanded ? (
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-8 mb-4 px-2 whitespace-nowrap">
            Settings
          </div>
        ) : (
          <div className="h-4 mt-8 mb-4 border-b border-zinc-800/50 mx-2"></div>
        )}
        
        <NavItem 
          icon={<Settings size={20} />} 
          label="Preferences" 
          active={activeTab === 'preferences'} 
          onClick={() => onTabChange('preferences')}
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, isExpanded }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; isExpanded: boolean }) {
  return (
    <button
      onClick={onClick}
      title={!isExpanded ? label : undefined}
      className={cn(
        "flex items-center gap-3 py-2.5 w-full text-left rounded-lg transition-all duration-200",
        isExpanded ? "px-3" : "px-0 justify-center",
        active 
          ? "bg-indigo-500/10 text-indigo-400 font-medium" 
          : "hover:bg-zinc-900 hover:text-white text-zinc-400"
      )}
    >
      <div className="shrink-0">{icon}</div>
      {isExpanded && <span className="text-sm whitespace-nowrap">{label}</span>}
    </button>
  );
}
