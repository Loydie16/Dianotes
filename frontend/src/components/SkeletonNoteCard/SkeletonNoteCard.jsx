import { Skeleton } from "@/components/ui/skeleton";

const SkeletonNoteCard = () => (
  <div className="p-4 border rounded shadow">
    <Skeleton className="h-12 w-1/2 mb-2" />
    <Skeleton className="h-40 w-full mb-2" />
    <Skeleton className="h-10 w-full mb-2" />
    <Skeleton className="h-8 w-1/4" />
  </div>
);

export default SkeletonNoteCard;
