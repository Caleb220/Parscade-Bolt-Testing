import React, { useLayoutEffect } from 'react';

// Simple test component to check if React hooks work
function DebugTest() {
  useLayoutEffect(() => {
    console.log('useLayoutEffect working correctly');
  }, []);

  return <div>Debug Test - React hooks working</div>;
}

export default DebugTest;