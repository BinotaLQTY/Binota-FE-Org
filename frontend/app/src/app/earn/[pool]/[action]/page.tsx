export function generateStaticParams() {
  return [
    { pool: "bnb", action: "deposit" },
    { pool: "bnb", action: "claim" },
  ];
}

export default function EarnPoolActionPage() {
  // see layout in the parent folder
  return null;
}
