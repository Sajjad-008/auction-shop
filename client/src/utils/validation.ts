export const validateName = (v: string): string => {
  if (!v.trim()) return "نام و نام خانوادگی را وارد کن.";
  if (v.trim().length < 3) return "نام باید حداقل ۳ حرف باشد.";
  return "";
};

export const validateEmail = (v: string): string => {
  if (!v.trim()) return "ایمیل را وارد کن.";
  if (!/^\S+@\S+\.\S+$/.test(v.trim())) return "ایمیل معتبر نیست.";
  return "";
};

export const validateRequired = (v: string): string =>
  v ? "" : "رمز عبور را وارد کن.";

export const validatePassword = (v: string): string => {
  if (!v) return "رمز عبور را وارد کن.";
  if (v.length < 8) return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
  return "";
};

export const validateConfirm = (password: string, confirm: string): string => {
  if (!confirm) return "تکرار رمز عبور را وارد کن.";
  if (password !== confirm) return "رمزها با هم یکسان نیستند.";
  return "";
};
