<template>
  <div class="relative">
    <canvas ref="canvas" :height="height" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import type { CarStats } from '@fh6/types';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default defineComponent({
  name: 'CarStatsChart',
  props: {
    stats: {
      type: Object as PropType<CarStats>,
      required: true,
    },
    height: {
      type: Number,
      default: 280,
    },
  },
  data() {
    return {
      chart: null as Chart | null,
    };
  },
  watch: {
    stats: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
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
      const textColor = isDark ? '#d1d5db' : '#374151';
      const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

      this.chart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Speed', 'Handling', 'Acceleration', 'Launch', 'Braking', 'Offroad'],
          datasets: [
            {
              label: 'Performance',
              data: [
                this.stats.speed,
                this.stats.handling,
                this.stats.acceleration,
                this.stats.launch,
                this.stats.braking,
                this.stats.offroad,
              ],
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              borderColor: 'rgba(245, 158, 11, 0.9)',
              pointBackgroundColor: 'rgba(245, 158, 11, 1)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4,
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            r: {
              min: 0,
              max: 10,
              ticks: {
                stepSize: 2,
                display: false,
              },
              pointLabels: {
                color: textColor,
                font: { size: 12, weight: '500' },
              },
              grid: { color: gridColor },
              angleLines: { color: gridColor },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.parsed.r.toFixed(1)} / 10`,
              },
            },
          },
        },
      });
    },
    updateChart() {
      if (!this.chart) return;
      this.chart.data.datasets[0].data = [
        this.stats.speed,
        this.stats.handling,
        this.stats.acceleration,
        this.stats.launch,
        this.stats.braking,
        this.stats.offroad,
      ];
      this.chart.update();
    },
  },
});
</script>
