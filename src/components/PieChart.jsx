import React from "react";
import { Pie } from "react-chartjs-2";

const PieChart = ({ title, data }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="font-semibold mb-4 text-lg text-gray-800">{title}</h3>
    <div className="relative h-60">
      <Pie
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
          },
        }}
      />
    </div>
  </div>
);

export default PieChart;