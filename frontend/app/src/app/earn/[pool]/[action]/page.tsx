export function generateStaticParams() {
  const pools = ["bnb", "mon", "shmon", "smon", "gmon"];
  const actions = ["deposit", "claim"];

  return pools.flatMap((pool) =>
    actions.map((action) => ({ pool, action }))
  );
}

export default function EarnPoolActionPage() {
  // see layout in the parent folder
  return null;
}
