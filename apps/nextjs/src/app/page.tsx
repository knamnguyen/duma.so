"use client";

import { useState } from "react";
import Image from "next/image";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import { Button } from "@sassy/ui/button";

import { BottomNav } from "~/components/BottomNav";
import { Chat } from "~/components/Chat";
import { CreateActivityForm } from "~/components/CreateActivityForm";
import { HostedActivities } from "~/components/HostedActivities";
import { MyActivities } from "~/components/MyActivities";
import { Profile } from "~/components/Profile";
import { SwipeFeed } from "~/components/SwipeFeed";

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState("home");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  const handleCreateActivityClick = () => {
    if (!isLoaded) return; // Wait for auth to load

    if (!isSignedIn) {
      // User is not logged in - Clerk will handle showing the sign-in modal
      // We'll use SignInButton to trigger the modal
      return;
    }

    // User is logged in - open create activity modal
    setIsCreateModalOpen(true);
  };

  const renderContent = () => {
    switch (currentTab) {
      case "home":
        return <SwipeFeed />;
      case "create":
        return <HostedActivities />;
      case "activities":
        return <MyActivities />;
      case "profile":
        return <Profile />;
      case "chat":
        return <Chat />;
      default:
        return <SwipeFeed />;
    }
  };

  return (
    <div className="bg-background min-h-screen pb-16">
      {/* Header */}
      <header className="bg-background/80 border-border sticky top-0 z-10 border-b backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <h1 className="text-foreground text-2xl font-bold">Duma</h1>
          </div>
          {isLoaded && !isSignedIn ? (
            <SignInButton mode="modal">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Activity
              </Button>
            </SignInButton>
          ) : (
            <Button
              size="sm"
              onClick={handleCreateActivityClick}
              className="gap-2"
              disabled={!isLoaded}
            >
              <Plus className="h-4 w-4" />
              Create Activity
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{renderContent()}</main>

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
