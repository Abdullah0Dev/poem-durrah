const arabic = new Intl.NumberFormat("ar-EG", { useGrouping: false });
export const toArabicNumber = (n: number) => arabic.format(n);
