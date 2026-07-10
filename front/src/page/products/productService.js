const KEYS = { PRODUCTS: 'my_products', CATEGORIES: 'my_categories', MEMBERS: 'my_members' };

export const fetchProducts = () => JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || "[]");
export const saveProducts = (data) => localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(data));

export const fetchCategories = () => JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || "[]");
export const saveCategories = (data) => localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(data));

export const fetchMembers = () => JSON.parse(localStorage.getItem(KEYS.MEMBERS) || "[]");