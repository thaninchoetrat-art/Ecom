import React, {createContext, useState} from 'react';
export const ProductContext = createContext(null);
export function ProductProvider({children}){
  const [products, setProducts] = useState([]);
  return (
    <ProductContext.Provider value={{products,setProducts}}>
      {children}
    </ProductContext.Provider>
  );
}
