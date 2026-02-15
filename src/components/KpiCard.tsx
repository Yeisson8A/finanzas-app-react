import { useState } from "react";
import { getKpiInsight } from "../api/financeApi";

interface Props {
  title: string;
  value: string | number;
  symbol: string;
}

export default function KpiCard({ title, value, symbol }: Props) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);


  const loadInsight = async () => {

    if (insight || loading) return;

    try {
      setLoading(true);

      const res = await getKpiInsight(
        symbol,
        title,
        String(value)
      );

      setInsight(res.data.insight);

    } catch {
      setInsight("AI insight unavailable.");

    } finally {
      setLoading(false);
    }
  };


  const handleMouseEnter = () => {
    setShowTooltip(true);
    loadInsight();
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };


  return (
    <div
      className="kpi-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h4>{title}</h4>
      <p>{value}</p>


      {/* Tooltip solo si hover */}
      {showTooltip && (
        <div className="tooltip">

          {loading && "Analyzing..."}

          {!loading && insight}

        </div>
      )}
    </div>
  );
}
