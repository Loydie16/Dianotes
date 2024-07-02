import { useNavigate } from "react-router-dom";
import homeIMG from "../assets/Add notes-bro.png";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Typewriter from "typewriter-effect";

function Home() {
  const navigate = useNavigate();
  return (
    <main className="flex flex-col-reverse sm:flex-row justify-center items-center w-full h-full min-h-screen">
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 mb-20 md:mb-0 gap-4">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-center text-stroke-2 text-stroke-black">
          DIANOTES.
        </h1>
        <p className="text-lg sm:text-2xl lg:text-4xl text-center">
          where you can jot down all your{" "}
          <span className="inline-block text-lg sm:text-2xl lg:text-4xl text-center font-mono text-stroke text-stroke-black">
            <Typewriter
              options={{
                delay: 50,
                cursor: "|",
                strings: [
                  "diaries.",
                  "memories.",
                  "thoughts.",
                  "ideas.",
                  "reminders.",
                  "significant events from your day.",
                ],
                autoStart: true,
                loop: true,
                skipAddStyles: true,
              }}
            />
          </span>
        </p>
        <div className="flex gap-4 items-center justify-around w-full mt-10">
          <Button
            type="button"
            variant=""
            className="px-10 py-6 text-xl font-bold"
            onClick={() => {
              navigate("/login");
            }}
          >
            LOGIN
          </Button>
          <ModeToggle/>
        </div>
      </div>
      <div className="flext justify-center items-center md:size-[45%] w-full">
        <img src={homeIMG} alt="" className="" />
      </div>
    </main>
  );
}

export default Home;
