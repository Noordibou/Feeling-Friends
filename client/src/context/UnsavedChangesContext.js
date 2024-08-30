import React, { createContext, useState, useContext } from 'react';

const UnsavedChangesContext = createContext();

export const UnsavedChangesProvider = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [ showUnsavedModal, setShowUnsavedModal] = useState(false)
  const [callback, setCallback] = useState(() => () => {});

  const openModal = (onConfirm) => {
    setCallback(() => onConfirm);
    setShowUnsavedModal(true)
  };

  const closeModal = () => {
    setCallback(null);
    setShowUnsavedModal(false);
  };

  const confirmChanges = () => {
    if (callback) {
      callback(); // Executes the redirection or any other action
    }
    closeModal();
  };
  
  return (
    <UnsavedChangesContext.Provider value={{ hasUnsavedChanges, openModal, closeModal, confirmChanges, setHasUnsavedChanges, showUnsavedModal, setShowUnsavedModal }}>
      {children}
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = () => useContext(UnsavedChangesContext);