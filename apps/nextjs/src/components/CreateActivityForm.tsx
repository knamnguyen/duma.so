"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";

import { Button } from "@sassy/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@sassy/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@sassy/ui/form";
import { Input } from "@sassy/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@sassy/ui/select";
import { toast } from "@sassy/ui/sonner";
import { Textarea } from "@sassy/ui/textarea";
import { activityCreateSchema } from "@sassy/validators";

import { useTRPC } from "~/trpc/react";

interface CreateActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateActivityForm = ({
  isOpen,
  onClose,
}: CreateActivityFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [tagsInput, setTagsInput] = useState("");

  const form = useForm({
    schema: activityCreateSchema,
    defaultValues: {
      type: "workdate",
      name: "",
      description: "",
      tags: [],
      dateTime: new Date(),
      location: "",
    },
  });

  const createMutation = useMutation(
    trpc.activity.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Activity created successfully!");
        form.reset();
        setTagsInput("");
        onClose();
        
        // Invalidate and refetch the activity list query to get newest on top
        // Use the queryKey from tRPC to ensure correct matching
        const queryKey = trpc.activity.list.queryKey();
        
        // Use requestAnimationFrame to ensure refetch happens after all renders complete
        requestAnimationFrame(() => {
          // Invalidate first to mark as stale
          queryClient.invalidateQueries({ queryKey });
          // Then refetch after a small delay to avoid render conflicts
          setTimeout(() => {
            queryClient.refetchQueries({ 
              queryKey,
              type: 'active', // Only refetch active queries
            });
          }, 50);
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create activity");
      },
    }),
  );

  const onSubmit = async (values: z.infer<typeof activityCreateSchema>) => {
    // Convert tags string to array before submitting
    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    
    if (tagsArray.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "At least one tag is required",
      });
      return;
    }

    await createMutation.mutateAsync({
      ...values,
      tags: tagsArray,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          // Reset form and tags input when closing
          form.reset();
          setTagsInput("");
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Activity</DialogTitle>
          <DialogDescription>
            Share an activity and connect with like-minded people
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="workdate">Work Date</SelectItem>
                      <SelectItem value="studydate">Study Date</SelectItem>
                      <SelectItem value="hangout">Hangout</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Coffee shop coding session"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your activity..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., coffee, coding, networking"
                      value={tagsInput}
                      onChange={(e) => {
                        setTagsInput(e.target.value);
                        // Update form field for validation (convert to array)
                        const tagsArray = e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean);
                        field.onChange(tagsArray);
                      }}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().slice(0, 16)
                          : field.value
                      }
                      onChange={(e) => {
                        field.onChange(new Date(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Blue Bottle Coffee, Hayes Valley"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="!flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create Activity"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

