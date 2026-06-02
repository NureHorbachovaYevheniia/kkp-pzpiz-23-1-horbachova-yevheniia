// Chart підключено через CDN у index.html.

const charts = new Map();

function destroyChart(canvas) {
  const old = charts.get(canvas);
  if (old) {
    old.destroy();
    charts.delete(canvas);
  }
}

// стовпчиковий графік (bar chart)
export function renderBarChart(canvas, labels, values, label) {
  destroyChart(canvas);

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: '#e8742c',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });

  charts.set(canvas, chart);
  return chart;
}

// кругова діаграма (doughnut chart)
export function renderDoughnutChart(canvas, labels, values) {
  destroyChart(canvas);

  const chart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ['#4caf50', '#ffc107', '#f44336', '#9e9e9e'],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  charts.set(canvas, chart);
  return chart;
}
