# Hệ thống Quản lý Điểm Thưởng

Hệ thống API quản lý điểm thưởng (Point Management System) giúp theo dõi, tích lũy và quy đổi điểm thưởng cho người dùng.

## Tính năng

- **Quản lý điểm**: Tích điểm, đổi điểm, xem số dư điểm
- **Bảng xếp hạng**: Xếp hạng người dùng theo điểm số (ngày, tuần, tháng)
- **Lịch sử giao dịch**: Theo dõi các hoạt động tích điểm và sử dụng điểm
- **Tích hợp người dùng**: Cache thông tin người dùng từ hệ thống bên ngoài
- **Swagger API Docs**: Tài liệu API tự động với Swagger UI

## Cài đặt

### Yêu cầu

- Node.js (v14+)
- MongoDB

### Các bước cài đặt

1. Clone repository:

```bash
git clone <repository-url>
cd point_management
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env` từ file `.env.example`:

```bash
cp .env.example .env
```

4. Cấu hình môi trường trong file `.env`

5. Khởi động server:

```bash
npm start
```

## API Documentation

Hệ thống sử dụng Swagger UI để cung cấp tài liệu API trực quan.

- Truy cập: `http://localhost:3000/api-docs`

## Cấu trúc dự án

```
/src
  /config       # Cấu hình
  /controllers  # Xử lý request/response
  /middleware   # Middleware (auth, validation)
  /models       # Mô hình dữ liệu MongoDB
  /routes       # Định nghĩa routes
  /services     # Business logic
  /utils        # Hàm tiện ích
  app.js        # Khởi tạo ứng dụng
```

## API Endpoints

### Points

- `GET /api/points/balance/:userId` - Lấy số dư điểm của người dùng
- `GET /api/points/history/:userId` - Lấy lịch sử giao dịch điểm
- `POST /api/points/earn` - Tích điểm cho người dùng
- `POST /api/points/redeem` - Đổi điểm thưởng

### Rankings

- `GET /api/rankings` - Lấy bảng xếp hạng người dùng
- `GET /api/rankings/:userId` - Lấy xếp hạng của người dùng
- `POST /api/rankings/update` - Cập nhật bảng xếp hạng

### Users

- `GET /api/users/info/:userId` - Lấy thông tin người dùng
- `POST /api/users/cache` - Cập nhật thông tin người dùng vào cache
- `POST /api/users/cache/bulk` - Cập nhật hàng loạt thông tin người dùng

### Admin

- `GET /api/admin/point-configs` - Lấy danh sách cấu hình điểm
- `GET /api/admin/point-configs/:id` - Lấy chi tiết cấu hình điểm
- `POST /api/admin/point-configs` - Tạo cấu hình điểm mới
- `PUT /api/admin/point-configs/:id` - Cập nhật cấu hình điểm
- `DELETE /api/admin/point-configs/:id` - Xóa cấu hình điểm
- `GET /api/admin/badges` - Lấy danh sách huy hiệu
- `POST /api/admin/badges` - Tạo huy hiệu mới
- `PUT /api/admin/badges/:id` - Cập nhật huy hiệu
- `GET /api/admin/statistics` - Lấy thống kê điểm

## Tích hợp với Hệ thống User

Hệ thống sử dụng cache để lưu trữ thông tin người dùng từ hệ thống bên ngoài. Dữ liệu người dùng được lưu trong collection `UserInfo` và tự động cập nhật khi cần.

1. **Tự động lấy thông tin**: Khi hiển thị điểm hoặc xếp hạng, hệ thống tự động lấy thông tin người dùng từ cache hoặc API bên ngoài.

2. **Cập nhật thủ công**: Sử dụng API `/api/users/cache` để cập nhật thông tin người dùng vào cache.

3. **Cập nhật hàng loạt**: Sử dụng API `/api/users/cache/bulk` để cập nhật thông tin nhiều người dùng cùng lúc.

## License

MIT
