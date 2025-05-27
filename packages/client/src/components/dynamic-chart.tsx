import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const DynamicChart: React.FC<{ data: any[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);

  // Exemple : LineChart si présence de "date"
  if (keys.includes('date') || keys.includes('timestamp')) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={keys[1]} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // Fallback BarChart
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey={keys[0]} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={keys[1]} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};
