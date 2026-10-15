export const validateName = (v) => {
  if (!v.trim()) return "نام و نام خانوادگی را وارد کن.";
  if (v.trim().length < 3) return "نام باید حداقل ۳ حرف باشد.";
  return "";
};

export const validateEmail = (v) => {
  if (!v.trim()) return "ایمیل را وارد کن.";
  if (!/^\S+@\S+\.\S+$/.test(v.trim())) return "ایمیل معتبر نیست.";
  return "";
};

export const validateRequired = (v) => (v ? "" : "رمز عبور را وارد کن.");

export const validatePassword = (v) => {
  if (!v) return "رمز عبور را وارد کن.";
  if (v.length < 8) return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
  return "";
};

export const validateConfirm = (password, confirm) => {
  if (!confirm) return "تکرار رمز عبور را وارد کن.";
  if (password !== confirm) return "رمزها با هم یکسان نیستند.";
  return "";
};
