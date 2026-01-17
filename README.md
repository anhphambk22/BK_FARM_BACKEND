BK Farmers backend

## Cấu hình và chạy

1) Tạo file `.env` (có thể copy từ `.env.example`) và điền:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
PORT=3000
TOKEN_EXPIRE=1d
```

2) MongoDB Atlas (khuyến nghị cho dữ liệu bền):
- Vào Atlas > Database Access: tạo user (nếu chưa có)
- Vào Atlas > Network Access: Add Current IP Address để whitelist IP hiện tại
- Copy chuỗi kết nối vào `MONGO_URI`

3) Cài đặt và chạy server
- `npm install`
- `npm run dev`

4) Health check nhanh

4) Kiểm tra trạng thái DB
	- `isInMemory=false` nghĩa là đã kết nối thành công Atlas/local MongoDB

## API Endpoints (Auth)

## E2E kiểm thử nhanh
	1) gọi `/api/health`
	2) đăng ký một số điện thoại ngẫu nhiên
	3) đăng nhập với số vừa đăng ký
	4) gọi `/api/auth/me` với token
4) Kiểm tra kết nối DB (tuỳ chọn)
 - Gọi `GET /api/dev/db-info` (dev-only) để biết đang dùng Atlas hay in-memory
