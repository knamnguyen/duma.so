"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Coffee,
  Dumbbell,
  MapPin,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@sassy/ui/avatar";
import { Badge } from "@sassy/ui/badge";
import { Card } from "@sassy/ui/card";
import { Progress } from "@sassy/ui/progress";
import { ScrollArea } from "@sassy/ui/scroll-area";
import { Separator } from "@sassy/ui/separator";

import type { ActivityPost, User } from "~/lib/mockData";
import { mockUsers } from "~/lib/mockData";
import { UserProfileDrawer } from "./UserProfileDrawer";

interface ActivityCardProps {
  activity: ActivityPost;
  host: User;
  allUsers?: User[];
}

const activityIcons = {
  workdate: Coffee,
  studydate: BookOpen,
  hangout: Users,
  sports: Dumbbell,
  event: Calendar,
  other: Users,
};

export const ActivityCard = ({
  activity,
  host,
  allUsers = mockUsers,
}: ActivityCardProps) => {
  const Icon = activityIcons[activity.activityType];
  const spotsLeft = activity.maxParticipants - activity.participationCount;
  const fillPercentage =
    (activity.participationCount / activity.maxParticipants) * 100;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Get participant users including host
  const participantUsers = [
    host,
    ...activity.participants
      .map((id) => allUsers.find((u) => u.id === id))
      .filter(Boolean),
  ] as User[];

  return (
    <>
      <Card className="relative mx-auto h-[600px] w-full max-w-sm overflow-hidden border-0 shadow-2xl">
        {/* Scrollable Content - Entire Card */}
        <ScrollArea className="h-full">
          <div className="space-y-0">
            {/* Main Activity Cover Image */}
            <div className="relative h-96 overflow-hidden">
              <img
                src={activity.coverPhoto}
                alt={activity.description}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Activity Badge */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-background text-foreground shadow-lg">
                  <Icon className="mr-1 h-3 w-3" />
                  {activity.activityType}
                </Badge>
              </div>

              {/* Spots Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-background text-foreground shadow-lg">
                  {spotsLeft} spots left
                </Badge>
              </div>

              {/* Content at Bottom */}
              <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                <div className="space-y-3">
                  {/* Host Info */}
                  <div className="flex items-center gap-3">
                    <Avatar
                      data-avatar-clickable
                      className="h-12 w-12 cursor-pointer border-2 border-white"
                      onClick={() => setSelectedUser(host)}
                    >
                      <AvatarImage src={host.profilePhoto} alt={host.name} />
                      <AvatarFallback>{host.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white/90">
                        Hosted by
                      </p>
                      <h2 className="text-lg font-bold">{host.name}</h2>
                    </div>
                  </div>

                  <p className="text-xl font-bold text-white">
                    {activity.description}
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(activity.dateTime, "EEE, MMM d • h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <MapPin className="h-4 w-4" />
                      <span>{activity.locationHint}</span>
                    </div>
                  </div>

                  {/* Participants Section */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white/90">
                        {activity.participationCount} of{" "}
                        {activity.maxParticipants} spots filled
                      </p>
                      <p className="text-sm font-medium text-white/90">
                        {spotsLeft} left
                      </p>
                    </div>
                    <Progress
                      value={fillPercentage}
                      className="h-2 bg-white/20"
                    />

                    {/* Participant Avatars */}
                    <div className="flex items-center gap-1 pt-1">
                      {participantUsers.slice(0, 5).map((user, index) => (
                        <Avatar
                          key={user.id}
                          data-avatar-clickable
                          className="h-10 w-10 cursor-pointer border-2 border-white transition-transform hover:scale-110"
                          style={{ marginLeft: index > 0 ? "-8px" : "0" }}
                          onClick={() => setSelectedUser(user)}
                        >
                          <AvatarImage
                            src={user.profilePhoto}
                            alt={user.name}
                          />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                      {participantUsers.length > 5 && (
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white/20 text-xs font-bold"
                          style={{ marginLeft: "-8px" }}
                        >
                          +{participantUsers.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Below Cover */}
            <div className="bg-card space-y-6 p-6">
              {/* About Section */}
              <div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  About {host.name}
                </h3>
                <p className="text-muted-foreground">
                  {host.bio || "No bio available"}
                </p>
              </div>

              <Separator />

              {/* Activity Photos */}
              {activity.activityPhotos &&
                activity.activityPhotos.length > 0 && (
                  <div>
                    <h3 className="text-foreground mb-3 text-lg font-semibold">
                      Previous Sessions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {activity.activityPhotos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative aspect-square overflow-hidden rounded-lg"
                        >
                          <img
                            src={photo}
                            alt={`Session ${index + 1}`}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <Separator />

              {/* Past Events */}
              {host.pastEvents && host.pastEvents.length > 0 && (
                <div>
                  <h3 className="text-foreground mb-3 text-lg font-semibold">
                    Past Events
                  </h3>
                  <div className="space-y-3">
                    {host.pastEvents.map((event, index) => {
                      const EventIcon =
                        activityIcons[
                          event.type as keyof typeof activityIcons
                        ] || Users;
                      return (
                        <div
                          key={index}
                          className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 rounded-full p-2">
                              <EventIcon className="text-primary h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-foreground text-sm font-medium">
                                {event.title}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {event.type}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {event.attendees} joined
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <Separator />

              {/* Interests */}
              {host.interests && host.interests.length > 0 && (
                <div>
                  <h3 className="text-foreground mb-3 text-lg font-semibold">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {host.interests.map((interest, idx) => {
                      const colors = [
                        "bg-blue-100 text-blue-700",
                        "bg-green-100 text-green-700",
                        "bg-purple-100 text-purple-700",
                        "bg-pink-100 text-pink-700",
                        "bg-yellow-100 text-yellow-700",
                        "bg-red-100 text-red-700",
                      ];
                      return (
                        <Badge
                          key={interest}
                          className={`${colors[idx % colors.length]} border-0`}
                        >
                          {interest}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </Card>

      <UserProfileDrawer
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  );
};
