# 🚀 Hướng dẫn chạy nhanh BK Farmers

## Yêu cầu
- Node.js (đã cài)
- MongoDB Atlas connection string (đã có trong `.env`)

## Các bước chạy

### 1️⃣ Khởi động Backend
Mở PowerShell, chạy:
```powershell
cd D:\Web_IOT_garden\BK_FARM_PROJECT-main\BK_FARM_PROJECT\bkfarmers-backend
$env:PORT=3000
npm run dev
```
✅ Chờ thấy: `MongoDB connected` và `Server started on 3000`

### 2️⃣ Khởi động Frontend
Mở PowerShell khác, chạy:
```powershell
cd D:\Web_IOT_garden\BK_FARM_PROJECT-main\BK_FARM_PROJECT
npm run dev
```
✅ Vite sẽ báo địa chỉ, thường là: `http://localhost:5173`

### 3️⃣ Mở trình duyệt
Vào: `http://localhost:5173`

## ✨ Luồng đăng ký → đăng nhập tự động

1. **Vào trang đăng ký**: Click "Đăng ký" hoặc vào `/register`
2. **Nhập thông tin**:
   - Số điện thoại (VD: `0849123456`)
   - Mật khẩu (VD: `Pass1234!`)
3. **Nhấn "Đăng ký"**
4. ✅ **Tự động đăng nhập**: Bạn sẽ được chuyển vào trang chính (`/`) ngay lập tức

## 🔍 Kiểm tra nhanh Backend (tùy chọn)
```powershell
# Xem danh sách users (dev)
Invoke-RestMethod -Uri http://localhost:3000/api/auth/dev/users

# Test đăng ký thủ công
$body = @{ phone='0849999888'; password='Test123!' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/register -Body $body -ContentType 'application/json'
```

## ❓ Nếu gặp lỗi

### "Failed to fetch" / "Không thể kết nối"
- Kiểm tra backend có chạy không (port 3000)
- Chạy: `netstat -aon | Select-String ":3000"`

### "Phone already used" / "Số điện thoại đã được đăng ký"
- Dùng số khác hoặc vào `/login` để đăng nhập với tài khoản đã có

### Lỗi MongoDB
- Kiểm tra `.env` trong `bkfarmers-backend` có `MONGO_URI` đúng
- Kiểm tra MongoDB Atlas cho phép kết nối từ IP của bạn

## 📝 Thông tin kỹ thuật
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- API endpoints:
  - `POST /api/auth/register` - Đăng ký (trả về token)
  - `POST /api/auth/login` - Đăng nhập
  - `GET /api/auth/me` - Lấy thông tin user hiện tại
