import type { Option, TicketCategoryKey } from "../types";

export const ticketCategories: Option<TicketCategoryKey>[] = [
  { key: "technical", label: "مشکل فنی" },
  { key: "auction", label: "مزایده و پیشنهاد" },
  { key: "account", label: "حساب کاربری" },
  { key: "other", label: "سایر" },
];

export const autoReplies: Record<TicketCategoryKey, string> = {
  technical:
    "تیکت شما ثبت شد. اگر مشکل در صفحه‌ی مشخصی رخ داده است، آدرس آن صفحه و مرورگر مورد استفاده‌ی خود را نیز ذکر کنید.",
  auction:
    "تیکت شما ثبت شد. اگر موضوع به مزایده‌ی مشخصی مربوط است، عنوان مزایده و مبلغ پیشنهاد خود را نیز ذکر کنید.",
  account:
    "تیکت شما ثبت شد. برای بررسی مشکل حساب کاربری، ایمیلی که با آن ثبت‌نام کرده‌اید را ذکر کنید. لطفاً هرگز رمز عبور خود را ارسال نکنید.",
  other:
    "تیکت شما ثبت شد. در صورت وجود توضیح بیشتر، آن را بنویسید تا بررسی سریع‌تر انجام شود.",
};
