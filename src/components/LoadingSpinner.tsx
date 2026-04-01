export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-full border-4 border-[#1a1d2e] border-t-[#d4af37] animate-spin" />
      <p className="text-[#d4af37] font-playfair text-lg text-center tracking-widest uppercase">
        Preparing Event
      </p>
    </div>
  );
}
