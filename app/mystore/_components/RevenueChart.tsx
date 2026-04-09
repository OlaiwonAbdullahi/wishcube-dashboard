import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface RevenueChartProps {
  data: Array<{
    _id: { month: number; year: number };
    revenue: number;
    earnings: number;
    count: number;
  }>;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const COLORS = ["#B4F8C8", "#FFAEBC", "#A0E7E5", "#FBE7C6"];

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((item) => ({
    name: MONTHS[item._id.month - 1] || "Dec",
    revenue: item.revenue,
    earnings: item.earnings,
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fontWeight: 900, fill: "#191A23" }} 
            axisLine={{ stroke: "#191A23", strokeWidth: 2 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10, fontWeight: 900, fill: "#191A23" }} 
            axisLine={{ stroke: "#191A23", strokeWidth: 2 }}
            tickLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip 
            cursor={{ fill: "rgba(25, 26, 35, 0.05)" }}
            contentStyle={{ 
              backgroundColor: "#fff", 
              border: "2px solid #191A23", 
              borderRadius: "0px",
              boxShadow: "4px 4px 0px 0px #191A23",
              fontSize: "12px",
              fontWeight: 900,
              textTransform: "uppercase"
            }}
          />
          <Bar dataKey="revenue" fill="#191A23">
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#191A23" strokeWidth={2} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
