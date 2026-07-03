import React, {createContext, useState} from 'react';
export const LoyaltyContext = createContext(null);
export function LoyaltyProvider({children}){
  const [points, setPoints] = useState(0);
  return (
    <LoyaltyContext.Provider value={{points,setPoints}}>
      {children}
    </LoyaltyContext.Provider>
  );
}
