# 🎬 CineGo Mobile App

CineGo là ứng dụng đặt vé xem phim hiện đại, mượt mà và tối ưu trải nghiệm người dùng trên nền tảng di động. Được xây dựng với **Expo** và **React Native**, CineGo mang đến giải pháp đặt vé nhanh chóng cùng giao diện Dark Mode sang trọng.

---

## ✨ Tính năng nổi bật

- 🎫 **Đặt vé nhanh chóng:** Chọn phim, suất chiếu và vị trí ghế ngồi chỉ trong vài bước.
- 💳 **Tích hợp Ví điện tử:** Hỗ trợ thanh toán qua **MoMo, ZaloPay, VNPay** và Thẻ ngân hàng.
- 📵 **Vé Offline:** Tự động lưu thông tin vé vào bộ nhớ máy (`AsyncStorage`), giúp người dùng xem được mã QR vé ngay cả khi không có mạng tại rạp.
- 🌙 **Premium Dark Theme:** Giao diện tối chuyên nghiệp, tối ưu hóa hiển thị cho rạp chiếu phim.
- 🍿 **Quản lý Bắp & Nước:** Đặt kèm combo đồ ăn thức uống dễ dàng.

---

## 🚀 Công nghệ sử dụng

- **Framework:** React Native (Expo SDK 54)
- **Navigation:** Expo Router (File-based routing)
- **Storage:** @react-native-async-storage/async-storage
- **UI:** Expo Linear Gradient, Lucide Icons, Expo Vector Icons
- **Feedback:** React Native Toast Message

---

## 🛠️ Hướng dẫn cài đặt (Setup)

### 1. Yêu cầu hệ thống
- Đã cài đặt [Node.js](https://nodejs.org/) (LTS)
- Điện thoại cài sẵn ứng dụng **Expo Go** (để test trên máy thật)

### 2. Cài đặt các bước
```bash
# Clone dự án (nếu cần)
git clone <url-du-an>

# Di chuyển vào thư mục CineGoApp
cd CineGoApp

# Cài đặt các thư viện phụ thuộc
npm install
```

### 3. Chạy ứng dụng
Để khởi động Metro Bundler và chạy ứng dụng:
```bash
# Chạy ở chế độ sạch (xóa cache) - Khuyên dùng sau khi cài thư viện mới
npx expo start -c
```

- Bấm **`a`** để mở trên Android Emulator.
- Bấm **`i`** để mở trên iOS Simulator.
- Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại để trải nghiệm thực tế.

---

## 📂 Cấu trúc thư mục chính

- `app/`: Chứa các màn hình và logic routing (Expo Router).
  - `(tabs)/`: Các trang chính (Home, Ticket, Profile).
  - `cinema/`: Luồng đặt vé, chọn ghế, chọn combo.
  - `auth/`: Màn hình Đăng nhập, Đăng ký.
- `components/`: Các thành phần giao diện dùng chung (MovieCard, Section, Header...).
- `constants/`: Định nghĩa màu sắc (`colors.ts`), cấu hình hệ thống.
- `hooks/`: Các custom hooks (useAppColors, useColorScheme...).
- `utils/`: Các tiện ích xử lý dữ liệu, lưu trữ (`storage.ts`).

---

## 📝 Ghi chú cho lập trình viên

- Dự án đã được tối ưu để chạy tốt nhất trên **Android** và **iOS**.
- Luôn sử dụng lệnh `npx expo start -c` nếu bạn gặp lỗi liên quan đến "Unable to resolve module".

---

**CineGo** - *Trải nghiệm điện ảnh trong tầm tay bạn!* 🍿🎬
