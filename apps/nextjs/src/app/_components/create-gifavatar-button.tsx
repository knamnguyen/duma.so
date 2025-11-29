"use client";

import type WebcamType from "react-webcam";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignUpButton, useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Loader2, UploadCloud } from "lucide-react";

import { Button } from "@sassy/ui/button";
import {
  FileInput,
  FileUploader,
  useFileUpload,
} from "@sassy/ui/components/file-uploader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@sassy/ui/dialog";

import { useTRPC } from "~/trpc/react";
import { compressImage } from "./compress-image";

type CreateGifavatarButtonProps = {
  variant?: "default" | "header";
  className?: string;
};

const ACCEPT = { "image/*": [".png", ".jpg", ".jpeg"] } as const;
const LOADING_MESSAGES = [
  "Preparing special sauce for your image",
  "Whispering to pixels to behave",
  "Politely asking background to step aside",
  "Polishing your profile magic",
  "Teaching edges to be crisp",
] as const;

export function CreateGifavatarButton({
  variant = "default",
  className,
}: CreateGifavatarButtonProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { isLoaded, isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState<string>("");
  const [showNoCreditsDialog, setShowNoCreditsDialog] = useState(false);

  const metricsQuery = useQuery({
    ...trpc.social.metrics.queryOptions(),
    enabled: isLoaded && isSignedIn,
  });

  const uploadStart = useMutation(
    trpc.editor.uploadStart.mutationOptions({
      onSuccess: () => {
        void metricsQuery.refetch();
      },
    }),
  );
  const removeBackground = useMutation(
    trpc.editor.removeBackground.mutationOptions(),
  );

  const buttonClasses =
    variant === "header"
      ? "cursor-pointer text-white rounded-xl bg-[#ff6fae] px-4 py-2 text-sm font-semibold  shadow-[0_12px_26px_rgba(255,111,174,0.32)] hover:bg-[#ff4f9f] hover:text-white"
      : "cursor-pointer text-white rounded-xl bg-[#ff6fae] px-6 py-2 text-sm font-semibold  shadow-[0_14px_30px_rgba(255,111,174,0.35)] hover:bg-[#ff4f9f] hover:text-white";

  const handleButtonClick = () => {
    // If signed in, wait for credits to load before opening dialog
    if (isSignedIn && isLoaded) {
      // If credits are still loading, don't open dialog yet
      if (metricsQuery.isLoading || !metricsQuery.data) {
        return;
      }
      // Check credits before opening dialog
      const credits = metricsQuery.data.totalCredits ?? 0;
      if (credits < 1) {
        setShowNoCreditsDialog(true);
        return;
      }
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) {
      setIsCameraOpen(false);
      setSelectedFile(null);
      setIsProcessing(false);
      setLoadingMsg("");
    }
  }, [open]);

  useEffect(() => {
    if (!isProcessing) return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[i] ?? "");
    }, 1500);
    return () => clearInterval(id);
  }, [isProcessing]);

  const processFile = async (file: File) => {
    if (!file) return;
    if (isProcessing) return;

    // Check credits before processing
    if (isSignedIn && isLoaded) {
      const credits = metricsQuery.data?.totalCredits ?? 0;
      if (credits < 1) {
        setShowNoCreditsDialog(true);
        return;
      }
    }

    setIsProcessing(true);
    setLoadingMsg(LOADING_MESSAGES[0] ?? "");

    try {
      // Compress image to target ~3MB to ensure base64 stays under 4.5MB limit
      const compressedFile = await compressImage(file);

      const dataUrl = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
        r.readAsDataURL(compressedFile);
      });

      // Ensure mime type is valid (compressedFile.type should be png or jpeg)
      const mimeType =
        compressedFile.type === "image/png"
          ? "image/png"
          : compressedFile.type === "image/jpeg" ||
              compressedFile.type === "image/jpg"
            ? "image/jpeg"
            : "image/jpeg"; // Default to JPEG if unknown

      const uploadResult = await uploadStart.mutateAsync({
        dataUrl,
        mime: mimeType,
      });

      await removeBackground.mutateAsync({
        uploadPath: uploadResult.path,
      });

      const projectId = uploadResult.id;
      router.push(`/editor/${projectId}`);
      setOpen(false);
    } catch (error) {
      console.error("Failed to process image:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong.";
      if (errorMessage.includes("Insufficient credits")) {
        setShowNoCreditsDialog(true);
        setIsProcessing(false);
      } else {
        setLoadingMsg("Something went wrong. Please try again.");
        setIsProcessing(false);
      }
    }
  };

  const isCreditsLoading =
    isSignedIn && isLoaded && (metricsQuery.isLoading || !metricsQuery.data);
  const isButtonDisabled = isCreditsLoading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
        className={[buttonClasses, className].filter(Boolean).join(" ")}
      >
        Create Gifavatar
      </Button>
      <DialogContent className="max-w-xl border-none bg-white/95 p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-semibold text-[#111827]">
            Upload a photo of yourself to get started
          </DialogTitle>
          <p className="text-sm text-[#4a5562]">
            Close up, portrait photo of you (don't upload photos with many
            people)
          </p>
        </DialogHeader>
        <div className="px-6 pb-6">
          <SignedIn>
            <FileUploader
              value={selectedFile ? [selectedFile] : []}
              onValueChange={(value: File[] | null) => {
                if (isProcessing) return;
                const file = value?.[0] ?? null;
                setSelectedFile(file);
                if (file) {
                  void processFile(file);
                }
              }}
              dropzoneOptions={{
                accept: ACCEPT,
                maxFiles: 1,
                maxSize: 4 * 1024 * 1024, // 4MB - will be compressed to ~3MB before upload
              }}
            >
              <FileInput
                className={`border border-dashed border-[#d6d3d1] bg-white/80 p-8 transition-[border-color,box-shadow] hover:border-[#ff6fae] ${isProcessing ? "pointer-events-none opacity-60" : ""}`}
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[#ff6fae] shadow-[0_14px_28px_rgba(17,24,39,0.08)]">
                    <UploadCloud className="h-6 w-6" aria-hidden />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-[#111827]">
                      Drop files here, or click to browse
                    </p>
                    <p className="text-sm text-[#4a5562]">
                      PNG or JPEG under 4MB. Images will be automatically
                      compressed if needed. After selection, background removal
                      starts immediately for a new project and credits will be
                      consumed.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button
                      type="button"
                      className="rounded-xl bg-[#1f1f1f] px-5 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(17,24,39,0.16)] hover:bg-[#2c2c2c]"
                      disabled={isProcessing}
                    >
                      Select files
                    </Button>
                    <CaptureFromCameraButton
                      className="rounded-xl border-black/10 bg-white px-5 text-sm font-semibold text-[#1f1f1f]"
                      onOpenCamera={() => {
                        if (isProcessing) return;
                        setIsCameraOpen(true);
                      }}
                      disabled={isProcessing}
                    />
                  </div>
                  {selectedFile && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-2 text-xs font-medium text-[#4a5562] shadow-inner">
                        <ImageIcon className="h-4 w-4 text-[#ff6fae]" />
                        <span>{selectedFile.name}</span>
                        <span aria-hidden className="h-4 w-px bg-[#d1d5db]" />
                        <span>
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-2 rounded-xl bg-white/80 px-4 py-3 text-sm text-[#4a5562]">
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin text-[#ff6fae]" />
                            <p className="font-medium">{loadingMsg}</p>
                          </>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </FileInput>
            </FileUploader>
          </SignedIn>
          <SignedOut>
            <div className="border border-dashed border-[#d6d3d1] bg-white/80 p-8 text-center shadow-inner">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[#ff6fae] shadow-[0_14px_28px_rgba(17,24,39,0.08)]">
                <UploadCloud className="h-6 w-6" aria-hidden />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-lg font-semibold text-[#111827]">
                  Sign up to upload your photo and generate a Gifavatar
                </p>
                <p className="text-sm text-[#4a5562]">
                  Keep your best portrait handy—once you join, we’ll guide you
                  through background removal and animation.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <SignUpButton mode="modal" forceRedirectUrl="/">
                  <Button className="rounded-xl bg-[#1f1f1f] px-5 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(17,24,39,0.16)] hover:bg-[#2c2c2c]">
                    Select files
                  </Button>
                </SignUpButton>
                <SignUpButton mode="modal" forceRedirectUrl="/">
                  <Button
                    variant="outline"
                    className="rounded-xl border-black/10 bg-white px-5 text-sm font-semibold text-[#1f1f1f]"
                  >
                    Capture from camera
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </SignedOut>
        </div>
      </DialogContent>
      <CameraCaptureDialog
        open={isCameraOpen}
        onOpenChange={setIsCameraOpen}
        onCapture={(file) => {
          setSelectedFile(file);
          setIsCameraOpen(false);
          if (!isProcessing && file) {
            void processFile(file);
          }
        }}
      />
      <NoCreditsDialog
        open={showNoCreditsDialog}
        onOpenChange={setShowNoCreditsDialog}
      />
    </Dialog>
  );
}

export default CreateGifavatarButton;

type CaptureFromCameraButtonProps = {
  className?: string;
  onOpenCamera: () => void;
  disabled?: boolean;
};

function CaptureFromCameraButton({
  className,
  onOpenCamera,
  disabled,
}: CaptureFromCameraButtonProps) {
  const handleCaptureFromCamera = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      onOpenCamera();
    },
    [onOpenCamera],
  );

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleCaptureFromCamera}
      disabled={disabled}
    >
      Capture from camera
    </Button>
  );
}

type CameraCaptureDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (file: File) => void;
};

function CameraCaptureDialog({
  open,
  onOpenChange,
  onCapture,
}: CameraCaptureDialogProps) {
  const webcamRef = useRef<WebcamType | null>(null);
  const [WebcamComponent, setWebcamComponent] =
    useState<WebcamComponentType | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snapshotDataUrl, setSnapshotDataUrl] = useState<string | null>(null);

  const videoConstraints = useMemo(
    () => ({
      width: { ideal: 1280 },
      height: { ideal: 720 },
      facingMode: "user" as const,
    }),
    [],
  );

  useEffect(() => {
    let isMounted = true;
    import("react-webcam")
      .then((mod) => {
        if (isMounted) {
          setWebcamComponent(() => mod.default);
        }
      })
      .catch((importError) => {
        console.error(importError);
        if (isMounted) {
          setError("We couldn't load the camera module. Please try again.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setSnapshotDataUrl(null);
      setError(null);
      setIsInitializing(true);
      const stream = webcamRef.current?.stream;
      stream?.getTracks().forEach((track) => track.stop());
    }
  }, [open]);

  useEffect(() => {
    return () => {
      const stream = webcamRef.current?.stream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleTakePhoto = useCallback(() => {
    if (!webcamRef.current) {
      setError("Camera is not ready yet. Please try again.");
      return;
    }
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("We couldn't capture the photo. Please try again.");
      return;
    }
    setSnapshotDataUrl(imageSrc);
  }, []);

  const handleUsePhoto = useCallback(async () => {
    if (!snapshotDataUrl) return;
    try {
      const response = await fetch(snapshotDataUrl);
      const blob = await response.blob();
      const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
        type: blob.type || "image/jpeg",
      });
      onCapture(file);
    } catch (captureError) {
      console.error(captureError);
      setError(
        "We couldn't process the captured photo. Please take another snapshot.",
      );
    }
  }, [snapshotDataUrl, onCapture]);

  const handleClose = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        const stream = webcamRef.current?.stream;
        stream?.getTracks().forEach((track) => track.stop());
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg border-none bg-black/95 p-0 text-white">
        <div className="flex flex-col gap-4 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Capture from camera
            </DialogTitle>
            <p className="text-sm text-white/70">
              Position yourself in the frame, then snap your photo.
            </p>
          </DialogHeader>

          <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
            {error ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-white/70">
                <span>{error}</span>
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                  onClick={() => {
                    setError(null);
                    setSnapshotDataUrl(null);
                    setIsInitializing(true);
                  }}
                >
                  Retry
                </Button>
              </div>
            ) : snapshotDataUrl ? (
              <img
                src={snapshotDataUrl}
                alt="Captured preview"
                className="h-full w-full object-cover"
              />
            ) : WebcamComponent ? (
              <WebcamComponent
                ref={webcamRef}
                audio={false}
                videoConstraints={videoConstraints}
                onUserMedia={() => setIsInitializing(false)}
                onUserMediaError={(mediaError) => {
                  console.error(mediaError);
                  setError(
                    "We couldn't access your camera. Check permissions and try again.",
                  );
                  setIsInitializing(false);
                }}
                screenshotFormat="image/jpeg"
                mirrored
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/70">
                Loading camera…
              </div>
            )}

            {isInitializing && !snapshotDataUrl && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white/80">
                Allow camera access to continue…
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>

            {snapshotDataUrl ? (
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                  onClick={() => {
                    setSnapshotDataUrl(null);
                    setIsInitializing(false);
                  }}
                >
                  Retake
                </Button>
                <Button
                  type="button"
                  className="bg-[#ff6fae] text-[#1f1f1f] hover:bg-[#ff4f9f]"
                  onClick={handleUsePhoto}
                >
                  Use photo
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                className="bg-[#ff6fae] text-[#1f1f1f] hover:bg-[#ff4f9f]"
                onClick={handleTakePhoto}
                disabled={isInitializing || Boolean(error)}
              >
                Take photo
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type WebcamComponentType = typeof import("react-webcam").default;
type WebcamComponentProps = React.ComponentProps<WebcamComponentType>;

type NoCreditsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function NoCreditsDialog({ open, onOpenChange }: NoCreditsDialogProps) {
  const router = useRouter();

  const handleEarnCredits = () => {
    onOpenChange(false);
    router.push("/social-referral");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-none bg-white/95 p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl font-semibold text-[#111827]">
            No Credits Available
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-[#4a5562]">
            You don't have enough credits to create a new project. Each new
            project costs 1 credit.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
          <div className="mt-4 space-y-3">
            <p className="text-sm text-[#4a5562]">
              Don't worry! You can still generate unlimited gif avatars in your
              existing projects.
            </p>
            <Button
              className="w-full rounded-xl bg-[#ff6fae] text-white shadow-[0_14px_30px_rgba(255,111,174,0.35)] hover:bg-[#ff4f9f] hover:text-white"
              onClick={handleEarnCredits}
            >
              Earn Free Credits
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl border-black/10 bg-white text-[#1f1f1f] hover:bg-gray-50"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
