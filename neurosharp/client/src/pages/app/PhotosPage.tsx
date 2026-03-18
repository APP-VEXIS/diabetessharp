import { useCallback, useEffect, useRef, useState } from "react";
import { HowToUseBanner } from "../../components/HowToUseBanner";

const HOW_IT_WORKS = `Take a photo of the place where you put something (drawer, shelf, hook, box) and add a short label — e.g. "House keys – top drawer". When you forget where something is, open this page and check your photos. Over time you'll build a visual map of where you keep daily items.`;

const SUGGESTIONS = [
  { icon: "🔑", item: "Keys", tip: "Photo of the drawer, bowl, or hook where you leave them." },
  { icon: "👓", item: "Glasses", tip: "Nightstand, case, or the spot you always put them." },
  { icon: "👛", item: "Wallet / purse", tip: "Shelf, bag, or table where you keep it." },
  { icon: "📱", item: "Phone & charger", tip: "Where you plug it in or where you leave it at night." },
  { icon: "🪙", item: "Remote control", tip: "Couch pocket, basket, or side table." },
  { icon: "💊", item: "Medications", tip: "Cabinet, pill organizer, or bedside spot." },
  { icon: "📄", item: "Important papers", tip: "Folder, drawer, or safe — label which one." },
  { icon: "🔧", item: "Tools / spare parts", tip: "Toolbox, drawer, or shelf so you find them later." },
  { icon: "🚗", item: "Car keys & parking", tip: "Where you hang them; photo of parking level/spot if needed." },
  { icon: "🏠", item: "Spare key", tip: "Hiding place or key box — photo helps you (and only you) remember." },
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
        label: label.trim() || "New memory photo",
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
    addPhotoToList(label || "New memory photo", imageUrl);
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
        const file = new File([blob], "memory-photo.jpg", { type: "image/jpeg" });
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
    addPhotoToList(pendingLabel.trim() || "New memory photo", pendingPhoto.imageUrl);
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

      <div className="mb-6 flex items-center gap-2">
        <div>
          <h1 className="text-xl font-display font-bold text-[var(--color-text)]">Remember Where You Put Things</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Take photos of where you store daily items — keys, glasses, wallet — so you can find them later.
          </p>
        </div>
      </div>

      <HowToUseBanner
        pageKey="ns-photos"
        steps={[
          "Tap the camera icon to photograph where you put something — keys, wallet, glasses.",
          "Add a short label so you can find it fast when you forget — e.g. 'Keys – kitchen hook'.",
          "Photos are stored only on this device and are never uploaded.",
        ]}
      />

      {/* How it works */}
      <div className="glass-card p-5 mb-6">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">How to use</h3>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{HOW_IT_WORKS}</p>
      </div>

      {/* What to photograph */}
      <div className="glass-card p-5 mb-6">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">What to photograph</h3>
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
                <span className="text-2xl shrink-0" aria-hidden>{s.icon}</span>
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

      {/* Add memory photo */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Add a memory photo</h3>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-[var(--color-success-soft)] text-[var(--color-success)]">
            Private
          </span>
        </div>
        <div className="rounded-xl bg-[var(--color-info)]/10 border border-[var(--color-info)]/30 p-3 mb-4 flex items-start gap-2">
          <span className="text-[var(--color-info)] text-lg" aria-hidden>ℹ️</span>
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
            <span className="text-3xl">📷</span>
            <span className="font-medium text-sm">Take Photo</span>
          </button>
          <button
            type="button"
            onClick={handleFileClick}
            className="flex flex-col items-center justify-center gap-2 min-h-[100px] rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-hover)] transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            <span className="text-3xl">📁</span>
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

      {/* My memory album — grid of photos, tap to view and edit description */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">My memory album</h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">
          Your photos to remember where you put things. Tap a photo to see it and edit the description.
        </p>
        {memoryPhotos.length === 0 ? (
          <div className="min-h-[200px] rounded-xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-3 py-12 px-4">
            <span className="text-5xl text-[var(--color-text-muted)] opacity-60">🖼️</span>
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
                  <div className="w-full aspect-square flex items-center justify-center bg-[var(--color-card)] text-4xl">🖼️</div>
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
