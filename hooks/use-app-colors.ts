import { theme } from '../constants/colors';

// Đã tắt chế độ tự động chuyển sáng/tối theo yêu cầu của bạn.
// Hàm này luôn trả về màu Đen (Dark Theme).
export function useAppColors() {
  return theme.dark; 
}
