import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const timeoutRef = useRef(null);

  const showToast = useCallback(
    (message, type = "info") => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setToast({
        message,
        type,
        visible: true,
      });

      timeoutRef.current = setTimeout(() => {
        setToast((prev) => ({
          ...prev,
          visible: false,
        }));
      }, 3000);
    },
    []
  );

  const closeToast = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  return (
    <ToastContext.Provider
      value={{ showToast, closeToast }}
    >
      {children}

      {toast.visible && (
        <div
          onClick={closeToast}
          className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow text-white cursor-pointer transition-opacity
            ${
              toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                ? "bg-red-600"
                : "bg-gray-800"
            }`}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
