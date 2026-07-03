import React from 'react';
export default function ProductCard({product}){
  return (
    <div className="product-card">{product?.name || 'Product'}</div>
  );
}
