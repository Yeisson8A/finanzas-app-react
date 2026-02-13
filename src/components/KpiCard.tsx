interface Props {
  title: string;
  value: string | number;
}

export default function KpiCard({ title, value }: Props) {
  return (
    <div className="kpi-card">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}
