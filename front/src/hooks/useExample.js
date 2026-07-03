import {useState} from 'react';
export default function useExample(){
  const [val, setVal] = useState(null);
  return [val, setVal];
}
