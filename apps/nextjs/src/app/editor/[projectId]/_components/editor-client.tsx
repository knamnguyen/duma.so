"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@sassy/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@sassy/ui/card";
import { Checkbox } from "@sassy/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@sassy/ui/dialog";
import { Label } from "@sassy/ui/label";
import { Slider } from "@sassy/ui/slider";

import type { AnimationStyle } from "../../../_components/animation-style-selector";
import type { PlatformKey } from "./platform-selector-preview";
import type { TransformConfig } from "~/app/_components/avatar-preview";
import { DEFAULT_TRANSFORM_CONFIG } from "~/app/_components/avatar-preview";
import { capturePreviewAsGif } from "~/app/_components/platform-preview/capture-preview";
import { useRandomPeepAvatar } from "~/app/social-referral/_components/use-random-peep-avatar";
import { useTRPC } from "~/trpc/react";
import { AnimationStyleSelector } from "../../../_components/animation-style-selector";
import { ColorPicker } from "../../../_components/color-picker";
import {
  DEFAULT_PLATFORM_ID,
  PlatformSelectorPreview,
} from "./platform-selector-preview";

type EditorClientProps = {
  projectId: string;
};

export default function EditorClient({ projectId }: EditorClientProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { user, isLoaded, isSignedIn } = useUser();
  const fallbackAvatar = useRandomPeepAvatar();
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const avatarCaptureRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [renderAvatarSquare, setRenderAvatarSquare] = useState(false);
  const [capturedResult, setCapturedResult] = useState<{
    url: string;
    id: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load project data
  const { data: project, isLoading: isLoadingProject } = useQuery({
    ...trpc.editor.getProject.queryOptions({ projectId }),
    refetchOnWindowFocus: false,
  });

  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [selectedPlatformId, setSelectedPlatformId] =
    useState<PlatformKey>(DEFAULT_PLATFORM_ID);
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>({
    photoMovement: null,
    addOnEffect: null,
  });
  const [transformConfig, setTransformConfig] = useState<TransformConfig>({
    positionX: 0,
    positionY: 0,
    zoom: 1,
    rotate: 0,
    enableStillFrame: true,
    gifSize: 200,
    animationDuration: 5.5,
  });
  const [strokeConfig, setStrokeConfig] = useState<{
    enabled: boolean;
    weight: number;
    color: string;
  }>({
    enabled: false,
    weight: 0,
    color: "#000000",
  });

  const bgRemovedUrl = project?.backgroundRemovedLatest?.url ?? null;

  // Set right column max-height to viewport height
  useEffect(() => {
    const rightColumn = rightColumnRef.current;
    if (!rightColumn) return;

    const headerHeight = 80; // h-20 = 5rem = 80px
    const viewportHeight = window.innerHeight;
    const maxHeight = viewportHeight - headerHeight;

    rightColumn.style.maxHeight = `${maxHeight}px`;

    const handleResize = () => {
      const newViewportHeight = window.innerHeight;
      const newMaxHeight = newViewportHeight - headerHeight;
      rightColumn.style.maxHeight = `${newMaxHeight}px`;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Commented out server API call - using DOM capture instead
  // const generateGif = useMutation(trpc.editor.generateGif.mutationOptions());
  const saveCapturedGif = useMutation(
    trpc.editor.saveCapturedGif.mutationOptions({
      onSuccess: () => {
        // Refresh project data to show new result
        void queryClient.invalidateQueries({
          queryKey: trpc.editor.getProject.queryKey({ projectId }),
        });
      },
    }),
  );

  // Stroke handlers
  const handleStrokeWeightChange = (weight: number) => {
    setStrokeConfig({
      ...strokeConfig,
      weight,
      enabled: weight > 0,
    });
  };

  const handleStrokeColorChange = (color: string) => {
    setStrokeConfig({
      ...strokeConfig,
      color,
    });
  };

  // Commented out server API call - using DOM capture instead
  // const handleGenerate = async () => {
  //   if (!bgRemovedUrl || !project?.backgroundRemovedLatest) return;
  //   const path = project.backgroundRemovedLatest.path;
  //   const out = await generateGif.mutateAsync({
  //     bgRemovedPath: path,
  //     animationStyle,
  //     bgColor,
  //     transformConfig,
  //     strokeConfig: strokeConfig.enabled
  //       ? {
  //           enabled: true,
  //           weight: strokeConfig.weight,
  //           color: strokeConfig.color,
  //         }
  //       : undefined,
  //   });
  //   // Refresh project data to show new generation
  //   await queryClient.invalidateQueries({
  //     queryKey: trpc.editor.getProject.queryKey({ projectId }),
  //   });
  //   window.open(out.url, "_blank", "noopener,noreferrer");
  // };

  const handleCapturePreview = async () => {
    const avatarElement = avatarCaptureRef.current;
    if (!avatarElement) {
      toast.error("Avatar preview is not ready yet. Please try again.");
      return;
    }

    setIsCapturing(true);
    // Enable square rendering for capture
    setRenderAvatarSquare(true);

    // Wait a frame for React to re-render with square avatar
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const blob = await capturePreviewAsGif({
        element: avatarElement,
        durationMs: transformConfig.animationDuration * 1000,
        fps: 12,
      });

      // Convert blob to dataUrl for upload
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to convert blob to dataUrl"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Save to server
      const result = await saveCapturedGif.mutateAsync({
        dataUrl,
        projectId,
      });

      // Show dialog with preview
      setCapturedResult({ url: result.url, id: result.id });
      setIsDialogOpen(true);
      toast.success("GIF saved successfully!");
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Unable to capture and save preview. Please try again.";
      toast.error(message);
    } finally {
      setIsCapturing(false);
      // Restore circular rendering after capture
      setRenderAvatarSquare(false);
    }
  };

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Don't use fallback avatar if we have bgRemovedUrl - prioritize the actual project image
  const resolvedLocalAvatar = useMemo(() => {
    // Only use fallback if we don't have bgRemovedUrl
    if (!bgRemovedUrl && fallbackAvatar && fallbackAvatar.trim().length > 0)
      return fallbackAvatar;
    return null;
  }, [fallbackAvatar, bgRemovedUrl]);

  const displayName =
    user?.fullName && user.fullName.trim().length > 0
      ? user.fullName
      : [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
        user?.username ||
        "You";
  const emailAddress = "you@gifavatar.app";
  const greetingName = user?.firstName || displayName;

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch">
          <div className="h-full min-h-0">
            <PlatformSelectorPreview
              selectedPlatformId={selectedPlatformId}
              onPlatformChange={setSelectedPlatformId}
              bgRemovedUrl={bgRemovedUrl}
              localUrl={resolvedLocalAvatar}
              previewIsLoading={isLoadingProject}
              animationStyle={animationStyle}
              bgColor={bgColor}
              displayName={displayName}
              emailAddress={emailAddress}
              greetingName={greetingName}
              isLoaded={isLoaded ?? false}
              isSignedIn={isSignedIn ?? false}
              isLoadingProject={isLoadingProject}
              transformConfig={transformConfig}
              strokeConfig={strokeConfig.enabled ? strokeConfig : undefined}
              avatarCaptureRef={avatarCaptureRef}
              renderAvatarSquare={renderAvatarSquare}
            />
          </div>

          <Card
            ref={rightColumnRef}
            className="sticky top-28 z-20 flex min-h-0 flex-col overflow-hidden"
          >
            <div className="border-b bg-white px-6 pt-4 pb-4">
              <Button
                type="button"
                onClick={handleCapturePreview}
                disabled={
                  !bgRemovedUrl || isCapturing || saveCapturedGif.isPending
                }
                className="w-full rounded-xl bg-[#ff6fae] text-white shadow-[0_14px_30px_rgba(255,111,174,0.35)] hover:bg-[#ff4f9f] hover:text-white"
              >
                {isCapturing || saveCapturedGif.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isCapturing ? "Capturing preview..." : "Saving GIF..."}
                  </>
                ) : (
                  "Capture & Save Preview"
                )}
              </Button>
            </div>
            <CardContent className="flex-1 space-y-4 overflow-y-auto">
              <ColorPicker
                value={bgColor}
                onChange={setBgColor}
                label="Background color"
              />

              {bgRemovedUrl && (
                <div className="space-y-3">
                  <Label>Stroke</Label>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-normal">Weight</Label>
                        <span className="text-sm text-gray-600">
                          {strokeConfig.weight}px
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={50}
                        step={1}
                        value={[strokeConfig.weight]}
                        onValueChange={(vals) =>
                          handleStrokeWeightChange(vals[0] ?? 0)
                        }
                        className="[&>button]:border-2 [&>button]:border-[#ff6fae] [&>button]:bg-white [&>div:first-child]:bg-pink-200 [&>div>div]:bg-[#ff6fae]"
                      />
                    </div>
                    <ColorPicker
                      value={strokeConfig.color}
                      onChange={handleStrokeColorChange}
                      label="Stroke color"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-6 pt-4">
                {/* Position X and Y */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Position X</Label>
                      <span className="text-sm text-gray-600">
                        {transformConfig.positionX.toFixed(0)}%
                      </span>
                    </div>
                    <Slider
                      min={-50}
                      max={50}
                      step={1}
                      value={[transformConfig.positionX]}
                      onValueChange={(vals) =>
                        setTransformConfig({
                          ...transformConfig,
                          positionX: vals[0] ?? transformConfig.positionX,
                        })
                      }
                      className="[&>button]:border-2 [&>button]:border-[#ff6fae] [&>button]:bg-white [&>div:first-child]:bg-pink-200 [&>div>div]:bg-[#ff6fae]"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Position Y</Label>
                      <span className="text-sm text-gray-600">
                        {transformConfig.positionY.toFixed(0)}%
                      </span>
                    </div>
                    <Slider
                      min={-50}
                      max={50}
                      step={1}
                      value={[transformConfig.positionY]}
                      onValueChange={(vals) =>
                        setTransformConfig({
                          ...transformConfig,
                          positionY: vals[0] ?? transformConfig.positionY,
                        })
                      }
                      className="[&>button]:border-2 [&>button]:border-[#ff6fae] [&>button]:bg-white [&>div:first-child]:bg-pink-200 [&>div>div]:bg-[#ff6fae]"
                    />
                  </div>
                </div>

                {/* Zoom and Rotate */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Zoom</Label>
                      <span className="text-sm text-gray-600">
                        {transformConfig.zoom.toFixed(1)}x
                      </span>
                    </div>
                    <Slider
                      min={0.1}
                      max={10}
                      step={0.1}
                      value={[transformConfig.zoom]}
                      onValueChange={(vals) =>
                        setTransformConfig({
                          ...transformConfig,
                          zoom: vals[0] ?? transformConfig.zoom,
                        })
                      }
                      className="[&>button]:border-2 [&>button]:border-[#ff6fae] [&>button]:bg-white [&>div:first-child]:bg-pink-200 [&>div>div]:bg-[#ff6fae]"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Rotate</Label>
                      <span className="text-sm text-gray-600">
                        {transformConfig.rotate.toFixed(0)}°
                      </span>
                    </div>
                    <Slider
                      min={-180}
                      max={180}
                      step={1}
                      value={[transformConfig.rotate]}
                      onValueChange={(vals) =>
                        setTransformConfig({
                          ...transformConfig,
                          rotate: vals[0] ?? transformConfig.rotate,
                        })
                      }
                      className="[&>button]:border-2 [&>button]:border-[#ff6fae] [&>button]:bg-white [&>div:first-child]:bg-pink-200 [&>div>div]:bg-[#ff6fae]"
                    />
                  </div>
                </div>

                {/* GIF Size and Still Frame Toggle */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>GIF Size</Label>
                      <span className="text-sm text-gray-600">
                        {transformConfig.gifSize}px
                      </span>
                    </div>
                    <Slider
                      min={50}
                      max={500}
                      step={10}
                      value={[transformConfig.gifSize]}
                      onValueChange={(vals) =>
                        setTransformConfig({
                          ...transformConfig,
                          gifSize: vals[0] ?? transformConfig.gifSize,
                        })
                      }
                      className="[&>button]:border-2 [&>button]:border-[#ff6fae] [&>button]:bg-white [&>div:first-child]:bg-pink-200 [&>div>div]:bg-[#ff6fae]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={transformConfig.enableStillFrame}
                      onCheckedChange={(checked) =>
                        setTransformConfig({
                          ...transformConfig,
                          enableStillFrame: checked === true,
                        })
                      }
                      className="border-[#ff6fae] data-[state=checked]:border-[#ff6fae] data-[state=checked]:bg-[#ff6fae]"
                    />
                    <Label>Static frame (0.5s) at beginning</Label>
                  </div>
                </div>

                {/* Animation Duration */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Animation Duration</Label>
                    <span className="text-sm text-gray-600">
                      {transformConfig.animationDuration.toFixed(1)}s
                    </span>
                  </div>
                  <Slider
                    min={0.5}
                    max={10}
                    step={0.1}
                    value={[transformConfig.animationDuration]}
                    onValueChange={(vals) =>
                      setTransformConfig({
                        ...transformConfig,
                        animationDuration:
                          vals[0] ?? transformConfig.animationDuration,
                      })
                    }
                    className="[&>button]:border-2 [&>button]:border-[#ff6fae] [&>button]:bg-white [&>div:first-child]:bg-pink-200 [&>div>div]:bg-[#ff6fae]"
                  />
                </div>
              </div>

              <AnimationStyleSelector
                selectedStyle={animationStyle}
                onStyleChange={setAnimationStyle}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {project && project.results.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Past generations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {project.results.map((result) => (
                <div
                  key={result.id}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <img
                    src={result.url}
                    alt={`Generated GIF ${result.id}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-xl bg-[#ff6fae] text-white opacity-0 shadow-[0_12px_26px_rgba(255,111,174,0.32)] transition-opacity group-hover:opacity-100 hover:bg-[#ff4f9f] hover:text-white"
                      onClick={() => handleDownload(result.url)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog for newly captured GIF */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>GIF Captured Successfully!</DialogTitle>
            <DialogDescription>
              Your GIF has been saved. You can download it below.
            </DialogDescription>
          </DialogHeader>
          {capturedResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-4">
                <img
                  src={capturedResult.url}
                  alt="Captured GIF"
                  className="max-h-64 w-full object-contain"
                />
              </div>
              <div className="space-y-3">
                <Button
                  type="button"
                  className="w-full rounded-xl bg-[#ff6fae] text-white shadow-[0_14px_30px_rgba(255,111,174,0.35)] hover:bg-[#ff4f9f] hover:text-white"
                  onClick={() => {
                    setIsDialogOpen(false);
                    router.push("/social-referral");
                  }}
                >
                  Share on socials to earn free usage
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => {
                    handleDownload(capturedResult.url);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
