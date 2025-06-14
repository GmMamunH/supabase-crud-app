import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
    </div>
  );
};

export default Loader;
