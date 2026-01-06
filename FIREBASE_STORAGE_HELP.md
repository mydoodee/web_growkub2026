# วิธีแก้ไขปัญหา CORS สำหรับ Firebase Storage

ข้อผิดพลาด **CORS (Cross-Origin Resource Sharing)** เกิดขึ้นเพราะ Firebase Storage Bucket ของคุณยังไม่ได้อนุญาตให้เว็บไซต์จาก `http://localhost:3000` ส่งไฟล์เข้าไปครับ

## วิธีการที่ 1: ใช้ Google Cloud Shell (ง่ายที่สุด)

1. เข้าไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. เลือกโปรเจกต์ของคุณ (**growkub-dev**)
3. คลิกปุ่ม **"Activate Cloud Shell"** (ไอคอน `>_` ที่มุมขวาบน)
4. เมื่อ Terminal ขึ้นมาแล้ว ให้พิมพ์คำสั่งด้านล่างนี้ทีละบรรทัดครับ:

```bash
# 1. สร้างไฟล์ตั้งค่า
echo '[{"origin": ["*"],"method": ["GET", "POST", "PUT", "DELETE", "HEAD"],"maxAgeSeconds": 3600}]' > cors.json

# 2. นำไปใช้งานกับ Bucket ของคุณ (เปลี่ยน [BUCKET_NAME] เป็น growkub-dev.firebasestorage.app)
gsutil cors set cors.json gs://growkub-dev.firebasestorage.app
```

## วิธีการที่ 2: ตรวจสอบ Rules ของ Storage (ใน Firebase Console)

ตรวจสอบให้แน่ใจว่า Rules ในแท็บ **Storage > Rules** เป็นแบบอนุญาต (สำหรับการทดสอบ):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

---
**หมายเหตุ**: หลังจากรันคำสั่ง CORS แล้ว อาจต้องรอประมาณ 1-2 นาทีเพื่อให้ระบบอัปเดตครับ
