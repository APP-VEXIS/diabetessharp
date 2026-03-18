import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  FolderOpen,
  Lightbulb,
  Pin,
  Lock,
  Info,
  Image,
  Droplet,
  Utensils,
  Footprints,
  Pill,
  ClipboardList,
  BarChart2,
  Activity,
  Moon,
} from "lucide-react";
import type { ComponentType } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";

const HOW_IT_WORKS = `Use photos to track your progress: meals, glucose readings, or foot checks. Add a short label (e.g. "Breakfast – oatmeal", "Fasting 98", "Left foot check"). Over time you'll see how your routine and numbers evolve.`;

const SUGGESTIONS: {
  Icon: ComponentType<{ size?: number; className?: string }>;
  item: string;
  tip: string;
}[] = [
  { Icon: Droplet, item: "Glucose reading", tip: "Photo of your meter with the result, or a note with date and value." },
  { Icon: Utensils, item: "Meal", tip: "What you ate — helps you match foods to your numbers later." },
  { Icon: Footprints, item: "Foot check", tip: "Daily foot check photo to spot any changes (important for diabetes)." },
  { Icon: Pill, item: "Medications", tip: "Your pill organizer or meds taken — to keep a visual log." },
  { Icon: ClipboardList, item: "Shopping list", tip: "List or cart photo for diabetes-friendly groceries." },
  { Icon: BarChart2, item: "Weight / log", tip: "Scale reading or handwritten log if you track weight." },
  { Icon: Activity, item: "Activity", tip: "Walk, gym, or any movement — to remember what you did that day." },
  { Icon: Moon, item: "Sleep / stress", tip: "Quick note or photo to track rest and how you feel." },
];

type MemoryPhoto = { id: string; label: string; date: string; imageUrl?: string };

type PendingPhoto = { file: File; imageUrl: string };

export function PhotosPage() {
  const [memoryPhotos, setMemoryPhotos] = useState<MemoryPhoto[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<PendingPhoto | null>(null);
  const [pendingLabel, setPendingLabel] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addPhotoToList = useCallback((label: string, imageUrl: string | undefined) => {
    setMemoryPhotos((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        label: label.trim() || "New photo",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        imageUrl,
      },
    ]);
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 3000);
  }, []);

  const savePhoto = useCallback((file: File | null, imageUrlFromFile?: string) => {
    const imageUrl = imageUrlFromFile ?? (file ? URL.createObjectURL(file) : undefined);
    const label = newLabel.trim();
    if (!label && file) {
      setPendingPhoto({ file, imageUrl: imageUrl ?? "" });
      setPendingLabel("");
      return;
    }
    addPhotoToList(label || "New photo", imageUrl);
    setNewLabel("");
  }, [newLabel, addPhotoToList]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
    setCameraError(null);
  }, []);

  const openCamera = useCallback(() => {
    setCameraError(null);
    setCameraOpen(true);
  }, []);

  useEffect(() => {
    if (!cameraOpen) return;
    const video = videoRef.current;
    let stream: MediaStream | null = null;
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (video) {
          video.srcObject = stream;
          await video.play();
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Camera access denied";
        setCameraError(
          msg.includes("Permission") || msg.includes("denied")
            ? "Camera permission denied. Use \"Choose File\" to pick a photo, or allow camera in your browser settings."
            : "Could not open camera. Use \"Choose File\" to pick a photo from your gallery."
        );
        setCameraOpen(false);
      }
    };
    start();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [cameraOpen]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || !streamRef.current || video.readyState < 2) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "tracking-photo.jpg", { type: "image/jpeg" });
        savePhoto(file);
        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  }, [savePhoto, stopCamera]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) savePhoto(file);
    e.target.value = "";
  };

  const savePendingPhoto = () => {
    if (!pendingPhoto) return;
    addPhotoToList(pendingLabel.trim() || "New photo", pendingPhoto.imageUrl);
    setPendingPhoto(null);
    setPendingLabel("");
    setNewLabel("");
  };

  const updatePhotoLabel = (id: string, label: string) => {
    setMemoryPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, label: label.trim() || p.label } : p)));
    setSelectedPhoto((p) => (p && p.id === id ? { ...p, label: label.trim() || p.label } : p));
  };

  const openPhotoDetail = (p: MemoryPhoto) => {
    setSelectedPhoto(p);
    setEditingLabel(p.label);
  };

  return (
    <div>
      {/* Modal: add description for photo when it was taken without a label */}
      {pendingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card p-5 w-full max-w-md rounded-2xl border border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">Add a description for this photo</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              So you remember where you put it — e.g. &quot;House keys – top drawer by the door&quot;.
            </p>
            <input
              type="text"
              value={pendingLabel}
              onChange={(e) => setPendingLabel(e.target.value)}
              placeholder="e.g. Keys – kitchen drawer"
              className="input-field w-full mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setPendingPhoto(null); setPendingLabel(""); }}
                className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={savePendingPhoto}
                className="flex-1 py-2.5 rounded-xl bg-[var(--color-accent)] text-white font-semibold text-sm"
              >
                Save photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: view photo in album and edit description */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card p-5 w-full max-w-lg rounded-2xl border border-[var(--color-border)] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Photo details</h3>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {selectedPhoto.imageUrl && (
              <img
                src={selectedPhoto.imageUrl}
                alt=""
                className="w-full rounded-xl object-cover max-h-[40vh] bg-[var(--color-card)] mb-4"
              />
            )}
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Description</label>
            <input
              type="text"
              value={editingLabel}
              onChange={(e) => setEditingLabel(e.target.value)}
              placeholder="Where you put it..."
              className="input-field w-full mb-2"
            />
            <p className="text-xs text-[var(--color-text-muted)] mb-4">{selectedPhoto.date}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] font-medium text-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => { updatePhotoLabel(selectedPhoto.id, editingLabel); setSelectedPhoto(null); }}
                className="flex-1 py-2.5 rounded-xl bg-[var(--color-accent)] text-white font-semibold text-sm"
              >
                Save description
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera modal — opens real camera stream */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          <div className="flex-1 relative flex items-center justify-center min-h-0">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-center gap-4 p-4 safe-area-pb bg-black/80">
            <button
              type="button"
              onClick={stopCamera}
              className="px-5 py-3 rounded-xl bg-white/20 text-white font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={capturePhoto}
              className="px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold text-sm shadow-lg"
            >
              Capture
            </button>
          </div>
        </div>
      )}

      {cameraError && (
        <div className="mb-4 rounded-xl bg-[var(--color-warning-soft)] border border-[var(--color-warning)]/40 p-3 text-sm text-[var(--color-text)]">
          {cameraError}
        </div>
      )}

      <div className="mb-6 flex items-center gap-3">
        <Camera size={24} className="text-[var(--color-accent)] shrink-0" aria-hidden />
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Photo Diary</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Track meals, readings, and daily health moments with photos — and match them to your numbers over time.
          </p>
        </div>
      </div>

      <HowToUseBanner
        pageKey="photos"
        steps={[
          "Tap the camera icon to take a photo or upload one from your gallery.",
          "Add a short description so you can match the photo to your glucose readings later.",
          "Photos are stored only on your device and are never uploaded without your consent.",
        ]}
      />

      {/* How it works */}
      <div className="glass-card p-5 mb-6">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
          <Lightbulb size={16} className="text-[var(--color-accent)] shrink-0" /> How to use
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{HOW_IT_WORKS}</p>
      </div>

      {/* What to photograph */}
      <div className="glass-card p-5 mb-6">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3 flex items-center gap-2">
          <Pin size={16} className="text-[var(--color-accent)] shrink-0" /> Suggestions — what to photograph
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">
          Tap a suggestion to open the camera and take a photo — the label will be set for you. Add a description so you remember where you put it.
        </p>
        <ul className="space-y-3">
          {SUGGESTIONS.map((s) => (
            <li key={s.item}>
              <button
                type="button"
                onClick={() => {
                  setNewLabel(s.item);
                  openCamera();
                }}
                className="w-full flex gap-3 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-left hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-soft)] flex items-center justify-center shrink-0">
                  <s.Icon size={18} className="text-[var(--color-accent)]" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm text-[var(--color-text)]">{s.item}</span>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{s.tip}</p>
                </div>
                <span className="text-[var(--color-accent)] text-sm shrink-0">Take photo →</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Add photo */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
            <Camera size={16} className="text-[var(--color-accent)] shrink-0" /> Add photo
          </h3>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-[var(--color-success)]/20 text-[var(--color-success)] border border-[var(--color-success)]/30">
            <Lock size={11} /> Private
          </span>
        </div>
        <div className="rounded-xl bg-[var(--color-info)]/10 border border-[var(--color-info)]/30 p-3 mb-4 flex items-start gap-2">
          <Info size={18} className="text-[var(--color-info)] shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm text-[var(--color-text-muted)]">
            Take a photo of the <strong>spot</strong> where you put something (e.g. the open drawer, the hook, the shelf), then add a short label like &quot;Keys – top drawer&quot; or &quot;Glasses – nightstand&quot;. Your photos stay private and only you can see them.
          </p>
        </div>
        <div className="mb-4">
          <label htmlFor="photo-label" className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
            Label (what you stored there)
          </label>
          <input
            id="photo-label"
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder='e.g. House keys – top drawer by the door'
            className="input-field w-full"
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          aria-hidden
        />
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={openCamera}
            className="flex flex-col items-center justify-center gap-2 min-h-[100px] rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            <Camera size={32} aria-hidden />
            <span className="font-medium text-sm">Take Photo</span>
          </button>
          <button
            type="button"
            onClick={handleFileClick}
            className="flex flex-col items-center justify-center gap-2 min-h-[100px] rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            <FolderOpen size={32} aria-hidden />
            <span className="font-medium text-sm">Choose File</span>
          </button>
        </div>
        <p className="mt-3 text-xs text-[var(--color-text-muted)]">
          Take Photo opens the camera on your phone or notebook. If it doesn&apos;t open, allow camera access in your browser settings or use Choose File to pick an image from your gallery.
        </p>
        {showAddSuccess && (
          <p className="mt-3 text-sm text-[var(--color-success)] font-medium">
            ✓ Saved. You can find it in your list below.
          </p>
        )}
      </div>

      {/* My photos — grid for tracking meals, glucose, foot check */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">My photos</h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">
          Your photos for meals, glucose, or foot checks. Tap a photo to view or edit the label.
        </p>
        {memoryPhotos.length === 0 ? (
          <div className="min-h-[200px] rounded-xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-3 py-12 px-4">
            <Image size={48} className="text-[var(--color-text-muted)] opacity-60" aria-hidden />
            <p className="text-sm text-[var(--color-text-muted)] text-center max-w-[280px]">
              No photos yet. Tap a suggestion above to take a photo, or add one with Take Photo / Choose File. When you forget where something is, open this album.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {memoryPhotos.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => openPhotoDetail(p)}
                className="rounded-xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors text-left"
              >
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="w-full aspect-square object-cover bg-[var(--color-card)]"
                  />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center bg-[var(--color-card)] text-[var(--color-text-muted)]">
            <Image size={40} aria-hidden />
          </div>
                )}
                <div className="p-2 min-w-0">
                  <p className="font-medium text-xs text-[var(--color-text)] truncate">{p.label}</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">{p.date}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
