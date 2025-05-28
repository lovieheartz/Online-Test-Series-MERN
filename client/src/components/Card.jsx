const Card = ({ title }) => {
  return (
    <div
      className="
        bg-white p-5 rounded-xl
        w-[260px] h-[140px]
        shadow-md
        flex flex-col justify-center items-start
        transition-transform duration-200 ease-in-out
        hover:-translate-y-1 hover:shadow-lg
        flex-shrink-0
        scroll-snap-start
        sm:w-[220px] sm:h-[120px] sm:p-4
      "
    >
      <h3 className="m-0 text-lg font-semibold text-blue-900">{title}</h3>
      {/* 
      If you want paragraph text in future:
      <p className="mt-2 text-sm text-gray-600">Description or content</p> 
      */}
    </div>
  );
};

export default Card;
