// app/component/Dashboard.tsx
'use client';

import { Bar, Doughnut, Line, Pie, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  RadialLinearScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  RadialLinearScale
);

const Dashboard: React.FC = () => {
  // Sample data for charts
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Users',
        data: [500, 800, 1000, 1200, 1400, 1600],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
      },
    ],
  };

  const barData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [3000, 4000, 3200, 4500],
        backgroundColor: '#34D399',
      },
    ],
  };

  const doughnutData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [
      {
        label: 'Project Status',
        data: [60, 25, 15],
        backgroundColor: ['#22D3EE', '#FBBF24', '#EF4444'],
      },
    ],
  };

  const pieData = {
    labels: ['Engineering', 'Marketing', 'Sales', 'Customer Support'],
    datasets: [
      {
        label: 'Task Distribution',
        data: [35, 25, 20, 20],
        backgroundColor: ['#4F46E5', '#F97316', '#34D399', '#EF4444'],
      },
    ],
  };

  const radarData = {
    labels: ['Communication', 'Teamwork', 'Problem-solving', 'Creativity', 'Technical Knowledge'],
    datasets: [
      {
        label: 'Team Skills',
        data: [4, 3, 5, 4, 3],
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        borderColor: '#4F46E5',
      },
    ],
  };

  return (
    <div className="container mx-auto p-4 h-screen overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Row: 3 Charts */}
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto overflow-hidden">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Monthly User Growth</h2>
          <div className="h-80">
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto overflow-hidden">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Weekly Revenue</h2>
          <div className="h-80">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto overflow-hidden">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Project Status</h2>
          <div className="h-80">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Bottom Row: 2 Centered Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 justify-items-center">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto overflow-hidden">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Task Distribution</h2>
          <div className="h-80">
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto overflow-hidden">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Team Skills Analysis</h2>
          <div className="h-80">
            <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
