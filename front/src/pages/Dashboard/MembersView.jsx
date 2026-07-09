import React from 'react';

export default function MembersView({ members, setSelectedMember }) {
  return (
    <div style={{ maxWidth: '1024px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#db2777', margin: 0 }}>👥 ระบบจัดการสมาชิก</h1>
      <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 24px 0' }}>ตรวจสอบรายชื่อสมาชิกและข้อมูลรายละเอียดพฤติกรรมการซื้อ</p>

      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '16px', border: '1px solid #fbcfe8', overflow: 'hidden' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#fff1f2', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #fbcfe8' }}>
              <th style={{ padding: '16px' }}>รหัสสมาชิก</th>
              <th style={{ padding: '16px' }}>ชื่อ-นามสกุล</th>
              <th style={{ padding: '16px' }}>สถานะ</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>ข้อมูลสมาชิก</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px', color: '#4b5563' }}>
            {members.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid #fbcfe8' }}>
                <td style={{ padding: '16px', fontWeight: 'bold', color: '#db2777' }}>{member.id}</td>
                <td style={{ padding: '16px', color: '#111827' }}>{member.name}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold',
                    backgroundColor: member.status === 'VIP' ? '#fdf2f8' : member.status === 'Active' ? '#f0fdf4' : '#fef3c7',
                    color: member.status === 'VIP' ? '#db2777' : member.status === 'Active' ? '#16a34a' : '#d97706'
                  }}>{member.status}</span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <button onClick={() => setSelectedMember(member)} style={{ fontSize: '12px', color: '#db2777', backgroundColor: '#fdf2f8', padding: '6px 14px', borderRadius: '8px', border: '1px solid #fbcfe8', cursor: 'pointer', fontWeight: 'bold' }}>ดูข้อมูล</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}