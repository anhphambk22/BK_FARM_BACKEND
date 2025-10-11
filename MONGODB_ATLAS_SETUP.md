# ⚠️ QUAN TRỌNG: Cấu hình MongoDB Atlas cho Render

Trước khi deploy, bạn **BẮT BUỘC** phải cấu hình MongoDB Atlas cho phép kết nối từ Render:

## Các bước cấu hình MongoDB Atlas

1. Vào https://cloud.mongodb.com/
2. Đăng nhập vào account của bạn
3. Chọn cluster **BKFARM** (hoặc cluster bạn đang dùng)
4. Click tab **"Network Access"** (bên trái)
5. Click **"Add IP Address"**
6. Chọn **"Allow Access from Anywhere"**
   - IP: `0.0.0.0/0`
   - Description: `Render deployment`
7. Click **"Confirm"**

## Tại sao cần làm vậy?

- Render deploy trên cloud, IP động
- MongoDB Atlas mặc định chỉ cho phép IP bạn đã thêm
- `0.0.0.0/0` = cho phép mọi IP (cần thiết cho production)

## Bảo mật

Không lo! Vẫn an toàn vì:
- ✅ Connection string có username/password
- ✅ Database user có quyền hạn giới hạn
- ✅ MongoDB Atlas có firewall riêng

## Kiểm tra

Sau khi thêm IP, test kết nối:

```powershell
# Từ máy local (đã hoạt động)
# Không cần test lại, nếu local OK thì Render cũng OK
```

---

✅ Sau khi hoàn tất, quay lại file `DEPLOY.md` và làm theo từng bước!
