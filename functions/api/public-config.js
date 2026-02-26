export async function onRequestGet({ env }) {
  return Response.json({
    brandName: env.BRAND_NAME || "",
    brandNameFa: env.BRAND_NAME_FA || "",
    pageTitleFa: env.PAGE_TITLE_FA || "منو",
    logoUrl: env.LOGO_URL || "",
    theme: {
      primary: env.PRIMARY_COLOR || "#5b2b2f",
      bg: env.BG_COLOR || "#ded7c5",
      text: env.TEXT_COLOR || "#5b2b2f",
      accent: env.ACCENT_COLOR || "#591d2a"
    },
    noteFa:
      env.NOTE_FA ||
      "• در صورت وجود هرگونه حساسیت غذایی، لطفاً به پرسنل {brandFa} اطلاع دهید."
  });
}