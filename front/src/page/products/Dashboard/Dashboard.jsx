import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import OverviewView from './OverviewView';
import ProductsView from './ProductsView';
import CategoriesView from './CategoriesView';
import MembersView from './MembersView';
import { fetchProducts, fetchCategories, fetchMembers, saveProducts, saveCategories } from '../productService';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('overview');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  
  // States สำหรับ Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    setProducts(fetchProducts());
    setCategories(fetchCategories());
    setMembers(fetchMembers());
  }, []);

  // ฟังก์ชันจัดการหมวดหมู่
  const handleDeleteCategory = (id) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    saveCategories(updated);
  };

  const handleAddCategory = (name) => {
    const newCat = { id: Date.now(), name };
    const updated = [...categories, newCat];
    setCategories(updated);
    saveCategories(updated);
    setIsCatModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9fafb' }}>
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {activeMenu === 'overview' && <OverviewView memberCount={members.length} productCount={products.length} categoryCount={categories.length} />}
        
        {activeMenu === 'products' && (
          <ProductsView 
            products={products} 
            setProducts={(data) => { setProducts(data); saveProducts(data); }} 
            setIsModalOpen={setIsModalOpen} 
            setEditingProduct={setEditingProduct} 
          />
        )}
        
        {activeMenu === 'categories' && (
          <CategoriesView 
            categories={categories} 
            products={products} 
            setIsCatModalOpen={setIsCatModalOpen} 
            onDelete={handleDeleteCategory} 
          />
        )}
      </div>
    </div>
  );
}