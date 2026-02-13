import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { MarketDataPoint } from "../models/types";
import { formatDate } from "../utils/date";

interface Props {
  data: MarketDataPoint[];
}

export default function MarketChart({ data }: Props) {
  return (
    <div className="chart">

      <h3>Market Price</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis />
          <Tooltip labelFormatter={(label) => formatDate(label as string)} />
          <Line dataKey="close" stroke="#1976d2" />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}
