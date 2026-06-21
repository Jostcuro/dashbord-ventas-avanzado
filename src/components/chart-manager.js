import { Chart, registerables } from 'chart.js';
import { getMonthKey, getMonthLabel, formatCurrency } from '../utils/formatters.js';

Chart.register(...registerables);

let revenueChart = null;
let regionChart = null;
let categoryChart = null;

const chartColors = {
  brand: '#4F46E5',
  brandLight: '#6366F1',
  brandDark: '#4338CA',
  palette: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
};

function getTextColor() {
  return document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563';
}

function getGridColor() {
  return document.documentElement.classList.contains('dark') ? '#1f2937' : '#e5e7eb';
}

function destroyCharts() {
  if (revenueChart) { revenueChart.destroy(); revenueChart = null; }
  if (regionChart) { regionChart.destroy(); regionChart = null; }
  if (categoryChart) { categoryChart.destroy(); categoryChart = null; }
}

function renderRevenueChart(data) {
  const monthlyRevenue = {};
  data.forEach(sale => {
    const key = getMonthKey(sale.date);
    monthlyRevenue[key] = (monthlyRevenue[key] || 0) + sale.totalValue;
  });

  const sortedKeys = Object.keys(monthlyRevenue).sort();
  const labels = sortedKeys.map(getMonthLabel);
  const values = sortedKeys.map(k => monthlyRevenue[k]);

  const ctx = document.getElementById('chart-revenue');
  if (!ctx) return;

  revenueChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Revenue',
        data: values,
        borderColor: chartColors.brand,
        backgroundColor: chartColors.brand + '20',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => formatCurrency(ctx.parsed.y)
          }
        }
      },
      scales: {
        x: {
          ticks: { color: getTextColor() },
          grid: { color: getGridColor() }
        },
        y: {
          ticks: {
            color: getTextColor(),
            callback: (val) => formatCurrency(val)
          },
          grid: { color: getGridColor() }
        }
      }
    }
  });
}

function renderRegionChart(data) {
  const regionSales = {};
  data.forEach(sale => {
    const region = sale.user?.region || 'Unknown';
    regionSales[region] = (regionSales[region] || 0) + sale.totalValue;
  });

  const labels = Object.keys(regionSales);
  const values = Object.values(regionSales);

  const ctx = document.getElementById('chart-region');
  if (!ctx) return;

  regionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Revenue by Region',
        data: values,
        backgroundColor: chartColors.palette.slice(0, labels.length),
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => formatCurrency(ctx.parsed.y)
          }
        }
      },
      scales: {
        x: {
          ticks: { color: getTextColor() },
          grid: { display: false }
        },
        y: {
          ticks: {
            color: getTextColor(),
            callback: (val) => formatCurrency(val)
          },
          grid: { color: getGridColor() }
        }
      }
    }
  });
}

function renderCategoryChart(data) {
  const categorySales = {};
  data.forEach(sale => {
    const category = sale.product?.category || 'Unknown';
    categorySales[category] = (categorySales[category] || 0) + sale.totalValue;
  });

  const labels = Object.keys(categorySales);
  const values = Object.values(categorySales);

  const ctx = document.getElementById('chart-category');
  if (!ctx) return;

  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: chartColors.palette.slice(0, labels.length),
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: getTextColor(),
            usePointStyle: true,
            padding: 16
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)}`
          }
        }
      }
    }
  });
}

export function initChartManager(data) {
  destroyCharts();
  renderRevenueChart(data);
  renderRegionChart(data);
  renderCategoryChart(data);
}

export const updateChartManager = initChartManager;
