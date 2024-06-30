import PageNotFoundGIF from "../assets/PageNotFound.json";
import Lottie from "lottie-react";

function PageNotFound() {
  return (
    <main className="flex justify-center items-center h-full min-h-screen mx-4">
      <div className="flex flex-col items-center justify-center gap-20">
        <span className="font-bold text-4xl sm:text-6xl md:text-8xl lg:text-10xl text-custom-gray">
          Page not Found
        </span>
        <Lottie
          className="size-1/2" // Adjust size as needed
          animationData={PageNotFoundGIF}
          // Optionally add other props like autoplay, loop, etc.
        />
      </div>
    </main>
  );
}

export default PageNotFound;
