<template>
  <div class="chart-container">
    <Line
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'TrendChart',
  components: { Line },
  props: {
    results: {
      type: Array,
      required: true
    }
  },
  computed: {
    chartData() {
      const labels = this.results[0].data.map(item => {
        const date = new Date(item.period);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
      });

      const datasets = this.results.map(result => ({
        label: result.title,
        data: result.data.map(item => item.ratio),
        borderColor: this.getRandomColor(),
        tension: 0.1,
        fill: false
      }));

      return {
        labels,
        datasets
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#333'
            }
          },
          title: {
            display: true,
            text: '지역별 트렌드 비교',
            color: '#333',
            font: {
              size: 16
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: '#333'
            },
            backgroundColor: 'white'
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              color: '#333'
            },
            backgroundColor: 'white'
          }
        },
        backgroundColor: 'white',
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        }
      }
    }
  },
  data() {
    return {
      usedColors: new Set()
    }
  },
  methods: {
    getRandomColor() {
      const colors = [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#96CEB4',
        '#D4A5A5',
        '#9B59B6'
      ];
      
      // 아직 사용하지 않은 색상들만 필터링
      const availableColors = colors.filter(color => !this.usedColors.has(color));
      
      // 모든 색상을 사용했다면 초기화
      if (availableColors.length === 0) {
        this.usedColors.clear();
        return colors[0];
      }
      
      // 남은 색상 중 랜덤 선택
      const selectedColor = availableColors[Math.floor(Math.random() * availableColors.length)];
      this.usedColors.add(selectedColor);
      
      return selectedColor;
    }
  }
}
</script>

<style scoped>
.chart-container {
  height: 400px;
  width: 100%;
  background: white !important;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}
</style> 