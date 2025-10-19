export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Mật khẩu phải có ít nhất 8 ký tự');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất một chữ cái viết hoa');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất một chữ cái viết thường');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất một chữ số');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateFullName = (fullName: string): boolean => {
  return fullName.trim().length >= 2;
};

export const validateRegisterForm = (
  email: string,
  password: string,
  confirmPassword: string,
  fullName: string
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!validateEmail(email)) {
    errors.email = 'Email không hợp lệ';
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.errors.join(', ');
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }

  if (!validateFullName(fullName)) {
    errors.fullName = 'Tên đầy đủ phải có ít nhất 2 ký tự';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (
  email: string,
  password: string
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!validateEmail(email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!password) {
    errors.password = 'Mật khẩu không được để trống';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

