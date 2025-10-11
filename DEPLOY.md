# 🚀 Hướng dẫn Deploy lên Render.com

## Tổng quan
- **Backend API**: Node.js Web Service (free tier)
- **Frontend**: Static Site (free tier)  
- **Database**: MongoDB Atlas (đã có sẵn)

## 📋 Các bước deploy

### Bước 1: Chuẩn bị GitHub Repository

1. **Push code lên GitHub** (nếu chưa):
```powershell
cd D:\Web_IOT_garden\BK_FARM_PROJECT-main\BK_FARM_PROJECT
git add .
git commit -m "feat: Add Render deployment config"
git push origin main
```

2. Đảm bảo repo là **public** hoặc upgrade Render account để dùng private repo.

---

### Bước 2: Tạo tài khoản Render

1. Vào https://render.com/
2. Click **"Get Started"** → Sign up with **GitHub**
3. Authorize Render truy cập GitHub repos của bạn

---

### Bước 3: Deploy Backend (Web Service)

1. Từ Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect repository: `datnguyenhcmut/BK_FARM_PROJECT`
3. Configure:
   - **Name**: `bkfarmers-backend`
   - **Region**: Singapore (gần VN nhất)
   - **Branch**: `main`
   - **Root Directory**: `bkfarmers-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables** (click "Add Environment Variable"):
   ```
   NODE_ENV = production
   PORT = 10000
   MONGO_URI = mongodb+srv://BK_FARM:IOT_GARDEN@bkfarm.esvuhts.mongodb.net/bkfarmers?retryWrites=true&w=majority&appName=BKFARM
   JWT_SECRET = BKFarmersSecretKey
   TOKEN_EXPIRE = 7d
   ```

5. Click **"Create Web Service"**

6. Đợi 2-3 phút để deploy. Khi xong, bạn sẽ thấy URL kiểu:
   ```
   https://bkfarmers-backend.onrender.com
   ```

7. **Test backend**: Vào browser hoặc chạy PowerShell:
   ```powershell
   Invoke-RestMethod -Uri https://bkfarmers-backend.onrender.com/api/auth/dev/users
   ```

---

### Bước 4: Deploy Frontend (Static Site)

1. Từ Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect repository: `datnguyenhcmut/BK_FARM_PROJECT`
3. Configure:
   - **Name**: `bkfarmers-frontend`
   - **Region**: Singapore
   - **Branch**: `main`
   - **Root Directory**: (để trống - root của repo)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL = https://bkfarmers-backend.onrender.com
   ```
   (Thay `https://bkfarmers-backend.onrender.com` bằng URL backend thực tế từ bước 3)

5. Click **"Create Static Site"**

6. Đợi 2-3 phút. Khi xong, bạn sẽ có URL:
   ```
   https://bkfarmers-frontend.onrender.com
   ```

---

### Bước 5: Test toàn bộ

1. Mở browser, vào: `https://bkfarmers-frontend.onrender.com`
2. Click "Đăng ký"
3. Nhập SĐT + mật khẩu → Đăng ký
4. ✅ Nếu thành công → chuyển sang trang Login → đăng nhập → vào web

---

## 🔧 Troubleshooting

### Backend deploy failed
- Kiểm tra Logs trong Render Dashboard
- Đảm bảo `MONGO_URI` đúng (copy từ file `.env` local)
- Kiểm tra MongoDB Atlas cho phép kết nối từ mọi IP (0.0.0.0/0)

### Frontend không kết nối được backend
- Kiểm tra `VITE_API_URL` có đúng backend URL không
- **Quan trọng**: URL phải là `https://bkfarmers-backend.onrender.com` (KHÔNG có `/api` ở cuối)
- Redeploy frontend sau khi sửa env var

### CORS errors
- Backend đã có `app.use(cors())` rồi, nên không lo
- Nếu vẫn lỗi, thêm config CORS chi tiết trong `bkfarmers-backend/src/index.js`:
  ```javascript
  app.use(cors({
    origin: ['https://bkfarmers-frontend.onrender.com'],
    credentials: true
  }));
  ```

---

## 🎉 Sau khi deploy xong

**Link công khai để chia sẻ**:
```
https://bkfarmers-frontend.onrender.com
```

Bất kỳ ai có link này đều có thể:
- Đăng ký tài khoản
- Đăng nhập
- Sử dụng web

---

## 📝 Lưu ý

### Free tier limitations:
- Backend **ngủ sau 15 phút không hoạt động** → lần đầu truy cập sẽ chậm 30-50 giây (cold start)
- Giới hạn 750 giờ/tháng (đủ dùng cho 1 service 24/7)
- Nếu muốn backend không ngủ → upgrade plan ($7/month)

### Auto-deploy:
- Mỗi khi bạn `git push origin main`, Render tự động deploy lại
- Không cần làm gì thêm!

### Custom domain (tùy chọn):
- Bạn có thể mua domain (ví dụ: `bkfarmers.com`)
- Trỏ domain về Render theo hướng dẫn của Render
- Free SSL certificate tự động

---

## 🔗 Links hữu ích

- Render Dashboard: https://dashboard.render.com/
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://cloud.mongodb.com/
