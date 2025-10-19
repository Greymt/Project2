# 📚 Luyện Thi Trắc Nghiệm Tiếng Anh Online

Ứng dụng web để luyện thi trắc nghiệm tiếng Anh (TOEIC, IELTS) với các tính năng quản lý bài thi, câu hỏi, và thống kê chi tiết.

## 🎯 Các Tính Năng Chính

### Cho Người Dùng
-  Đăng ký tài khoản
-  Đăng nhập hệ thống
-  Làm bài thi trắc nghiệm với bộ đếm thời gian
-  Xem kết quả bài thi chi tiết
-  Học câu hỏi theo chủ đề với giải thích

### Cho Quản Trị Viên
-  Quản lý ngân hàng câu hỏi
-  Quản lý bài thi
-  Quản lý người dùng
-  Xem thống kê hệ thống

## 🚀 Công Nghệ Sử Dụng

- **Frontend**: Next.js 12, React, TypeScript
- **State Management**: Redux Toolkit
- **UI Framework**: Material-UI (MUI) v5
- **Styling**: SCSS + Emotion
- **Authentication**: JWT (Mock)
- **API**: Next.js API Routes (RESTful)

## 📋 Hướng Dẫn Cài Đặt

### Yêu Cầu
- Node.js 14+
- npm hoặc yarn

### Cài Đặt

```bash
# Clone repository
git clone <repository-url>
cd Project2

# Cài đặt dependencies
npm install
# hoặc
yarn install

# Chạy development server
npm run dev
# hoặc
yarn dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 🔐 Tài Khoản Test

### Người Dùng Thường
- Email: `user@example.com`
- Mật khẩu: `Password123`

### Quản Trị Viên
- Email: `admin@example.com`
- Mật khẩu: `Admin123`

## 📁 Cấu Trúc Thư Mục

```
Project2/
├── pages/                    # Next.js pages
│   ├── api/                 # API endpoints
│   ├── auth/                # Authentication pages
│   ├── quiz/                # Quiz pages
│   ├── learning/            # Learning pages
│   └── admin/               # Admin pages
├── components/              # React components
│   ├── auth/               # Auth components
│   ├── quiz/               # Quiz components
│   ├── learning/           # Learning components
│   ├── admin/              # Admin components
│   └── layout/             # Layout components
├── app/                     # Redux store
│   ├── slices/             # Redux slices
│   └── store.ts            # Redux store config
├── types/                   # TypeScript types
├── utils/                   # Utility functions
└── styles/                  # Global styles
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin người dùng

### Quiz
- `GET /api/quiz` - Danh sách bài thi
- `GET /api/quiz/[id]` - Chi tiết bài thi
- `POST /api/quiz/submit` - Nộp bài thi
- `GET /api/quiz/results/[id]` - Kết quả bài thi

### Questions
- `GET /api/questions` - Danh sách câu hỏi
- `GET /api/questions/topics` - Danh sách chủ đề

### Admin
- `GET /api/admin/stats` - Thống kê hệ thống

## 🏗️ Build & Deployment

```bash
# Build production
npm run build

# Start production server
npm start
```

## 📝 Ghi Chú

- Hiện tại ứng dụng sử dụng mock data (in-memory arrays)
- Để sử dụng database thực, cần kết nối database
- JWT tokens được mock bằng base64 encoding
- Mật khẩu chưa được hash (cần bcrypt cho production)

## 🔄 Các Bước Tiếp Theo

1. Kết nối database
2. Implement bcrypt cho password hashing
3. Thêm tính năng quản lý câu hỏi cho admin
4. Thêm tính năng quản lý bài thi cho admin
5. Thêm tính năng quản lý người dùng cho admin
6. Deploy lên production
