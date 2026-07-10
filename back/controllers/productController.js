// เก็บไว้แค่ฟังก์ชันนี้เพื่ออัปโหลดรูปเท่านั้น
export async function uploadProductImage(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });
    const serverUrl = `${req.protocol}://${req.get('host')}`;
    return res.status(200).json({ 
        imageUrl: `${serverUrl}/uploads/${req.file.filename}` 
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}