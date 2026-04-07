<template>
  <AppCard :title="title" padding="md">
    <canvas ref="canvas" :height="height" />
  </AppCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  Chart,
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import AppCard from '@/components/common/AppCard.vue';

Chart.register(
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
);

export default defineComponent({
  name: 'ActivityChart',
  components: { AppCard },
  props: {
    title: {
      type: String,
      default: 'Activity',
    },
    labels: {
      type: Array as () => string[],
      default: () => [],
    },
    datasets: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String as () => 'line' | 'bar',
      default: 'line',
    },
    height: {
      type: Number,
      default: 200,
    },
  },
  data() {
    return {
      chart: null as Chart<any> | null,
    };
  },
  watch: {
    labels() { this.updateChart(); },
    datasets() { this.updateChart(); },
  },
  mounted() {
    this.initChart();
  },
  beforeUnmount() {
    this.chart?.destroy();
  },
  methods: {
    initChart() {
      const ctx = (this.$refs.canvas as HTMLCanvasElement).getContext('2d');
      if (!ctx) return;

      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? '#9ca3af' : '#6b7280';
      const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

      this.chart = new Chart(ctx, {
        type: this.type,
        data: {
          labels: this.labels,
          datasets: this.datasets as any[],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          interaction: { mode: 'index', intersect: false },
          scales: {
            x: {
              ticks: { color: textColor, font: { size: 11 } },
              grid: { color: gridColor },
            },
            y: {
              ticks: { color: textColor, font: { size: 11 } },
              grid: { color: gridColor },
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              labels: { color: textColor, font: { size: 12 }, boxWidth: 12 },
            },
          },
        },
      });
    },
    updateChart() {
      if (!this.chart) return;
      this.chart.data.labels = this.labels;
      this.chart.data.datasets = this.datasets as any[];
      this.chart.update();
    },
  },
});
</script>
