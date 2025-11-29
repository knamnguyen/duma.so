"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { BottomNav } from '~/components/BottomNav';
import { SwipeFeed } from '~/components/SwipeFeed';
import { MyActivities } from '~/components/MyActivities';
import { Profile } from '~/components/Profile';
import { HostedActivities } from '~/components/HostedActivities';
import { Chat } from '~/components/Chat';
import { CreateActivityForm } from '~/components/CreateActivityForm';
import { Button } from '@sassy/ui/button';
import Image from 'next/image';

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <SwipeFeed />;
      case 'create':
        return <HostedActivities />;
      case 'activities':
        return <MyActivities />;
      case 'profile':
        return <Profile />;
      case 'chat':
        return <Chat />;
      default:
        return <SwipeFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Duma</h1>
          </div>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Activity
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Create Activity Modal */}
      <CreateActivityForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
