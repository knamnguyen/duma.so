"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@sassy/ui/button";

import { useTRPC } from "~/trpc/react";

export default function TestActivityPage() {
  const trpc = useTRPC();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  // Query for listing activities
  const { data: activities, refetch: refetchActivities } = useQuery(
    trpc.activity.list.queryOptions({}),
  );

  // Mutation for creating activity
  const createActivity = useMutation(
    trpc.activity.create.mutationOptions({
      onSuccess: (data) => {
        addResult(`✅ Activity created: ${data.name} (ID: ${data.id})`);
        addResult(`   Cover photo: ${data.coverPhoto.substring(0, 50)}...`);
        addResult(`   Images fetched: ${data.imageUrls.length}`);
        refetchActivities();
      },
      onError: (error) => {
        addResult(`❌ Create failed: ${error.message}`);
      },
    }),
  );

  const handleTestCreate = () => {
    addResult("🔄 Creating test activity...");
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    createActivity.mutate({
      type: "hangout",
      name: "Test Coffee Session",
      description:
        "This is a test activity created via the test page. Let's meet for coffee!",
      tags: ["coffee", "test", "networking"],
      dateTime: futureDate,
      location: "Test Location",
    });
  };

  const handleTestList = () => {
    addResult(
      `📋 Listing activities... Found ${activities?.length ?? 0} activities`,
    );
    if (activities && activities.length > 0) {
      activities.forEach((activity, idx) => {
        addResult(
          `   ${idx + 1}. ${activity.name} - ${activity.host.primaryEmailAddress}`,
        );
      });
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Activity API Test Page</h1>

      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <Button
            onClick={handleTestCreate}
            disabled={createActivity.isPending}
          >
            {createActivity.isPending ? "Creating..." : "Test Create Activity"}
          </Button>
          <Button onClick={handleTestList} variant="outline">
            Test List Activities
          </Button>
          <Button
            onClick={() => {
              refetchActivities();
              addResult("🔄 Refreshed activity list");
            }}
            variant="outline"
          >
            Refresh List
          </Button>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h2 className="mb-2 font-semibold">
            Current Activities ({activities?.length ?? 0})
          </h2>
          {activities && activities.length > 0 ? (
            <ul className="space-y-2">
              {activities.map((activity) => (
                <li key={activity.id} className="border-b pb-2">
                  <div className="font-medium">{activity.name}</div>
                  <div className="text-muted-foreground text-sm">
                    Type: {activity.type} | Host:{" "}
                    {activity.host.primaryEmailAddress} | Date:{" "}
                    {new Date(activity.dateTime).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No activities found</p>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto rounded-lg bg-slate-900 p-4 font-mono text-sm text-green-400">
        <div className="mb-2 font-bold">Test Results:</div>
        {testResults.length === 0 ? (
          <div className="text-muted-foreground">
            No test results yet. Click buttons above to test.
          </div>
        ) : (
          testResults.map((result, idx) => (
            <div key={idx} className="mb-1">
              {result}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
