export default function CategoriesView({ categories, products, setIsCatModalOpen, onDelete }) {
  return (
    <div>
      <button onClick={() => setIsCatModalOpen(true)}>+ เพิ่มหมวดหมู่</button>
      <table>
        {categories.map((cat) => (
          <tr key={cat.id}>
            <td>{cat.name}</td>
            <td>{products.filter(p => p.category === cat.name).length} รายการ</td>
            <td>
              <button onClick={() => onDelete(cat.id)}>ลบ</button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}