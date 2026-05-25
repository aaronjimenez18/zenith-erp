export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#134235] flex items-center justify-center text-white text-lg font-bold">
          Z
        </div>
        <div className="w-6 h-6 border-2 border-[#134235] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}
