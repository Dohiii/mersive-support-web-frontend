import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LicenseContextProps {
  selectedFile: { file: Blob | null; name: string } | null;
  setFile: (file: { file: Blob | null; name: string } | null) => void;
}

const LicenseContext = createContext<LicenseContextProps | undefined>(undefined);

interface LicenseProviderProps {
  children: ReactNode;
}

export const LicenseProvider: React.FC<LicenseProviderProps> = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState<{ file: Blob | null; name: string } | null>(null);

  const setFile = (file: { file: Blob |File| null; name: string } | null) => {
    setSelectedFile(file);
  };

  return (
    <LicenseContext.Provider value={{ selectedFile, setFile }}>
      {children}
    </LicenseContext.Provider>
  );
};

export const useLicenseContext = (): LicenseContextProps => {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error('useLicenseContext must be used within a LicenseProvider');
  }
  return context;
};
