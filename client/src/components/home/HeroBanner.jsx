export default function HeroBanner() {
  return (
    <section className="w-full bg-cover bg-center py-10 sm:py-14">
      <div className="max-w-[1200px] mx-auto px-4 flex justify-center">
        {/* SEARCH BOX WRAPPER */}
        <div className="bg-[#4A4A4A] w-full max-w-[700px] rounded-2xl shadow-lg p-4 sm:p-6">
          {/* Tabs */}
          <div
            className="
            flex flex-wrap items-center justify-center 
            gap-6 sm:gap-10 
            text-white text-base sm:text-lg font-medium 
            pb-3 sm:pb-4 
            border-b border-white/20
          "
          >
            <button className="pb-1 sm:pb-2 border-b-2 border-red-500 text-white">
              Mua bán
            </button>
            <button className="text-gray-200 hover:text-white transition">
              Cho thuê
            </button>
            <button className="text-gray-200 hover:text-white transition">
              Dự án
            </button>
          </div>

          {/* SEARCH BAR */}
          <div
            className="
              flex flex-col sm:flex-row 
              items-stretch sm:items-center 
              gap-3 bg-white rounded-xl 
              p-3 mt-4 sm:mt-5
            "
          >
            {/* icon + input */}
            <div className="flex items-center flex-1 bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="text"
                placeholder="Nhà phố Bình Thạnh"
                className="flex-1 outline-none text-gray-700 text-[15px] pl-3"
              />
            </div>

            {/* SEARCH BUTTON */}
            <button
              className="
                bg-red-600 text-white 
                px-6 py-2 
                rounded-lg text-sm font-medium 
                hover:bg-red-700 transition
                w-full sm:w-auto
              "
            >
              Tìm kiếm
            </button>

            {/* MAP BUTTON */}
            <button
              className="
                border border-gray-300 text-gray-700 
                px-5 py-2 rounded-lg text-sm font-medium 
                hover:bg-gray-100 transition
                w-full sm:w-auto
              "
            >
              Xem bản đồ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
