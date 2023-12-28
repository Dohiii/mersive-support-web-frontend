// MainContainer.tsx
import { FC, ReactNode } from 'react';

// Define props interface
interface MainContainerProps {
  children: ReactNode;
  // Add any other props you may need
}

// Functional component
const MainContainer: FC<MainContainerProps> = ({ children }) => {
  return (
    <div className="main-container">
      {/* Add any layout or styling for your main container */}
      {children}
    </div>
  );
};

export default MainContainer;
