import React from 'react';
export default function CartItem({item}){
  return <div className="cart-item">{item?.name || 'Item'}</div>;
}
