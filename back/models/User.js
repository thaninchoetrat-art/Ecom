// จำลองคลังเก็บข้อมูลผู้ใช้ชั่วคราวในหน่วยความจำ (In-Memory Mock Database)
const mockUsers = [];

export const User = {
    // 1. ฟังก์ชันจำลองการค้นหาอีเมลในระบบ
    findOne: async function ({ email }) {
        const found = mockUsers.find(u => u.email === email);
        if (found) return found;
        return null;
    },

    // 2. ฟังก์ชันจำลองการบันทึกบัญชีใหม่ลงระบบ
    create: async function (userData) {
        const newUser = {
            _id: 'mock_id_' + Math.random().toString(36).substr(2, 9),
            ...userData
        };
        mockUsers.push(newUser); // บันทึกลงอาร์เรย์ชั่วคราว
        return newUser;
    }
};