import React, { createContext, useState, useContext, useRef } from 'react';

const UnsavedChangesContext = createContext();

export const UnsavedChangesProvider = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [callback, setCallback] = useState(() => () => {});

  const unsavedRef = useRef(null);

  const registerRef = (ref) => {
    unsavedRef.current = ref;
  };

  const openModal = (onConfirm) => {
    setCallback(() => onConfirm);
    if (unsavedRef.current) {
      unsavedRef.current.showModal();
    }
  };

  const closeModal = () => {
    setCallback(null);
    if (unsavedRef.current) {
      unsavedRef.current.close();
    }
  };

  const confirmChanges = () => {
    if (callback) {
      setHasUnsavedChanges(false);
      callback();
    }
    closeModal();
  };

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        openModal,
        closeModal,
        confirmChanges,
        setHasUnsavedChanges,
        registerRef,
      }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = () => useContext(UnsavedChangesContext);
