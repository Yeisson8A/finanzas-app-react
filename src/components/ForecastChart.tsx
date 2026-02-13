import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

import type { ForecastItem } from "../models/types";
import { formatDate } from "../utils/date";

interface Props {
  data: ForecastItem[];
}

export default function ForecastChart({ data }: Props) {
  return (
    <div className="chart">

      <h3>Forecast</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          <XAxis dataKey="ds" tickFormatter={formatDate} />
          <YAxis />
          <Tooltip labelFormatter={(label) => formatDate(label as string)} />

          <Area
            dataKey="yhat_upper"
            stroke="none"
            fill="#bbdefb"
          />

          <Area
            dataKey="yhat_lower"
            stroke="none"
            fill="#ffffff"
          />

          <Line
            dataKey="yhat"
            stroke="#0d47a1"
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}
