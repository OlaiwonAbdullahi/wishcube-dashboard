import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface OrdersStatusPieProps {
  data: Array<{ _id: string; count: number }>;
}

const COLORS = ["#B4F8C8", "#FFAEBC", "#A0E7E5", "#FBE7C6", "#FF6B6B"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="#191A23" className="text-[10px] font-black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function OrdersStatusPie({ data }: OrdersStatusPieProps) {
  const chartData = data.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              stroke="#191A23"
              strokeWidth={2}
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
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
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-[10px] font-black uppercase text-[#191A23]">{value}</span>}
              iconType="square"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
