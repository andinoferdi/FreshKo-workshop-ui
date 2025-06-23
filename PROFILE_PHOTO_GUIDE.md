# 📸 Panduan Fitur Foto Profil FreshKo

## Fitur Upload Foto Profil

Sistem FreshKo sekarang mendukung upload dan pengelolaan foto profil user dengan fitur lengkap.

## 🎯 Fitur Utama

### ✅ Upload Foto

- **Format Support**: JPG, PNG, GIF, WebP, dan format image lainnya
- **Ukuran Maksimal**: 5MB per file
- **Auto-save**: Langsung tersimpan setelah dipilih
- **Preview Real-time**: Melihat foto sebelum tersimpan

### ✅ Manajemen Foto

- **Ganti Foto**: Klik tombol camera untuk upload foto baru
- **Hapus Foto**: Tombol X merah untuk menghapus foto
- **Avatar Fallback**: Menampilkan inisial nama jika tidak ada foto

### ✅ Display di UI

- **Profile Page**: Foto utama di halaman profile
- **Header Dropdown**: Avatar mini di user dropdown
- **Responsive**: Tampil baik di desktop dan mobile

## 🏗️ Implementasi Teknis

### Data Storage

```typescript
// User interface updated
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string; // Base64 encoded image
  role?: "user" | "admin";
  createdAt: string;
}
```

### File Storage

- **Format**: Base64 encoded string
- **Location**: localStorage `freshko-users` dan `freshko-store`
- **Size**: Compressed untuk efisiensi storage

### Upload Flow

1. User klik button camera/avatar
2. File input membuka dialog pilih file
3. Validasi format dan ukuran file
4. Convert ke Base64 dengan FileReader
5. Preview langsung di UI
6. Auto-save ke localStorage
7. Update user session state

## 🎨 UI/UX Features

### Profile Page Avatar

```jsx
// Conditional rendering
{
  avatarPreview || user.avatar ? (
    <img
      src={avatarPreview || user.avatar}
      className="w-24 h-24 rounded-full object-cover"
    />
  ) : (
    <div className="w-24 h-24 bg-gradient-primary rounded-full">
      {user.firstName[0]}
      {user.lastName[0]}
    </div>
  );
}
```

### Header Dropdown Avatar

```jsx
{
  user.avatar ? (
    <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
  ) : (
    <div className="w-10 h-10 bg-gradient-primary rounded-full">
      {user.firstName[0]}
      {user.lastName[0]}
    </div>
  );
}
```

## 🔧 Validasi & Error Handling

### File Validation

- **Type Check**: `file.type.startsWith('image/')`
- **Size Check**: `file.size <= 5MB`
- **Error Messages**: Toast notification untuk invalid files

### Loading States

- **Upload Progress**: Spinner overlay saat upload
- **Button Disabled**: Prevent multiple uploads
- **Visual Feedback**: Loading indicator

### Error Recovery

- **Failed Upload**: Revert to previous state
- **Invalid File**: Clear file input dan show error
- **Storage Error**: Graceful fallback

## 📱 Responsive Design

### Mobile Optimization

- **Touch-friendly**: Button size optimal untuk touch
- **File Picker**: Native mobile file picker
- **Preview**: Full-width preview di mobile

### Cross-browser Support

- **File API**: Modern FileReader API
- **Base64**: Universal image format
- **Fallback**: Graceful degradation

## 🛡️ Security & Performance

### Security Considerations

- **Client-side Only**: No server upload (sesuai architecture)
- **File Type Restriction**: Hanya image files
- **Size Limit**: Prevent excessive storage usage
- **Input Sanitization**: Validate file objects

### Performance Optimization

- **Lazy Loading**: Avatar load on demand
- **Compression**: Base64 dengan quality control
- **Memory Management**: Clear FileReader after use
- **Storage Efficiency**: Cleanup old avatars

## 🎮 Cara Penggunaan

### Upload Foto Baru

1. Login ke akun
2. Pergi ke `/account/profile`
3. Klik icon **Camera** di avatar
4. Pilih file gambar (max 5MB)
5. Foto otomatis tersimpan dan tampil

### Mengganti Foto

1. Klik icon **Camera** lagi
2. Pilih foto baru
3. Foto lama otomatis diganti

### Menghapus Foto

1. Klik tombol **X** merah di corner avatar
2. Konfirmasi penghapusan
3. Kembali ke avatar inisial

## 📦 File Updates

### Modified Files

```
src/lib/store.ts              # Updated User interface + avatar handling
src/app/account/profile/page.tsx  # Profile page dengan upload feature
src/components/Header.tsx     # Header dropdown dengan avatar display
```

### New Features

- Upload foto profil dengan drag & drop
- Real-time preview sebelum save
- Auto-save setelah file dipilih
- Remove foto dengan konfirmasi
- Avatar display di header dropdown
- Responsive design untuk mobile

## 🚀 Future Enhancements

### Potential Improvements

- **Image Cropping**: Built-in crop tool
- **Multiple Photos**: Gallery support
- **Image Filters**: Basic editing features
- **CDN Integration**: External image hosting
- **Compression**: Auto-resize large images
- **Drag & Drop**: Advanced upload UX

### Backend Integration Ready

```typescript
// Easy migration ke backend
const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch("/api/upload-avatar", {
    method: "POST",
    body: formData,
  });

  return response.json();
};
```

## ✨ Demo

1. **Register/Login** → Akun baru akan punya avatar inisial
2. **Profile Page** → Upload foto pertama kali
3. **Header Check** → Lihat avatar mini di dropdown
4. **Change Photo** → Ganti dengan foto lain
5. **Remove Photo** → Hapus dan kembali ke inisial

Fitur ini memberikan pengalaman personal yang lebih baik dan membuat FreshKo terasa seperti platform e-commerce modern! 🎉
