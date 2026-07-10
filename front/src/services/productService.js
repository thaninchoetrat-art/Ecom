const API_BASE_URL = "http://localhost:4000/api";

export const fetchProducts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // ใส่เงื่อนไขเช็ก ถ้ามีค่าค่อยส่งไป Backend
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.brand) queryParams.append("brand", filters.brand);
    if (filters.minPrice !== undefined) queryParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice !== undefined) queryParams.append("maxPrice", filters.maxPrice);

    const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`);
    if (!response.ok) throw new Error("Network response was not ok");
    
    return await response.json();
  } catch (error) {
    console.error("Error in fetchProducts service:", error);
    throw error;
  }
};