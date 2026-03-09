import { EarnPoolScreen } from "@/src/screens/EarnPoolScreen/EarnPoolScreen";

export function generateStaticParams() {
  return [
    { pool: "mon" },
    { pool: "shmon" },
    { pool: "smon" },
    { pool: "gmon" },
  ];
}

export default function Layout() {
  return <EarnPoolScreen />;
}
