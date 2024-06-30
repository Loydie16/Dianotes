import errorGIF from "../assets/PageError.json";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Error() {

  const navigate = useNavigate();

  return (
    <main className="flex justify-center items-center h-full min-h-screen">
      <div className="flex flex-col items-center justify-center m-4 ">
        <span className="font-bold text-4xl sm:text-6xl md:text-8xl lg:text-10xl text-custom-gray text-center">
          Page/Server Respond with an Error
        </span>
        <Lottie className="size-2/6" animationData={errorGIF} />
        <Button
          type="button"
          onClick={() => {
            navigate("/");
          }}
        >
          Go to Homepage
        </Button>
      </div>
    </main>
  );
}

export default Error;
