import AddNoteGIF from "../../assets/Add note gif.gif";

function EmptyCard() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <img src={AddNoteGIF} alt="Add Note GIF" className="w-60" />

      <p className="w-1/2 text-lg font-medium  text-center leading-7 mt-5">
        Start creating your first Note! Click the &apos;Add Note&apos; button to
        jot down your diaries, memories, thoughts, ideas, reminders, or any
        significant events from your day. Let&apos;s get started!
      </p>
    </div>
  );
}

export default EmptyCard;
