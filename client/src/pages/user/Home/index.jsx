import HeroBanner from "@/components/home/HeroBanner";

export default function Home() {
  return (
    <>
      <HeroBanner />

      <div className="container mx-auto px-4 mt-10 grid grid-cols-12 gap-6">

        {/* Content */}
        <div className="col-span-12 md:col-span-9">
          <h2 className="text-xl font-bold mb-4">Danh sách bất động sản</h2>
          <p>Danh sách sẽ hiển thị tại đây.</p>
        </div>
      </div>
    </>
  );
}
