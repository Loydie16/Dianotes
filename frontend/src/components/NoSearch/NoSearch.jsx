import NoSearchFoundImg from "../../assets/Searh Not Found.gif";

function EmptyCard() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <img src={NoSearchFoundImg} alt="Search Query Not Found" />

      <p className="w-1/2 text-2xl font-medium  text-center leading-7 mt-5">
        Oops! No notes found matching your search.
      </p>
    </div>
  );
}

export default EmptyCard;
