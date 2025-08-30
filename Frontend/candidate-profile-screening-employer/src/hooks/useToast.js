import { useState, useCallback } from 'react';

const useToast = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToastMessage = useCallback((message, type = "success", duration = 3000) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    setShowToast(false);
  }, []);

  return {
    showToast,
    toastMessage,
    toastType,
    showToastMessage,
    hideToast
  };
};

export default useToast;
