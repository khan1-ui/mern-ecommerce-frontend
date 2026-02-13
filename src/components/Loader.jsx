import { useAuth } from "../context/AuthContext";

const Loader = ({ fullScreen = false }) => {
  const { user } = useAuth();

  const color =
    user?.store?.themeColor || "#000000";

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "fixed inset-0 bg-white dark:bg-gray-900 z-50" : "py-10"
      }`}
    >
      <div
        className="h-10 w-10 border-4 border-gray-300 rounded-full animate-spin"
        style={{ borderTopColor: color }}
      ></div>
    </div>
  );
};

export default Loader;
