
import { MetricData } from "../types/admin";
import { delay } from "./utils/apiUtils";
import { mockMetrics } from "./mockData";

// Analytics/Metrics
export const getMetrics = async () => {
  await delay(800);
  return { metrics: mockMetrics };
};

export const getMetricByNameAndDate = async (name: string, date: string) => {
  await delay(800);
  const metric = mockMetrics.find(metric => metric.name === name && metric.date === date);
  
  if (!metric) {
    throw new Error("Metric not found");
  }
  
  return { metric };
};

export const createMetric = async (metricData: MetricData) => {
  await delay(1000);
  const newMetric = {
    ...metricData,
    id: (mockMetrics.length + 1).toString()
  };
  
  mockMetrics.push(newMetric);
  return { metric: newMetric };
};

export const updateMetric = async (id: string, metricData: Partial<MetricData>) => {
  await delay(1000);
  const metricIndex = mockMetrics.findIndex(metric => metric.id === id);
  
  if (metricIndex === -1) {
    throw new Error("Metric not found");
  }
  
  mockMetrics[metricIndex] = { ...mockMetrics[metricIndex], ...metricData };
  return { metric: mockMetrics[metricIndex] };
};

export const deleteMetric = async (id: string) => {
  await delay(1000);
  const metricIndex = mockMetrics.findIndex(metric => metric.id === id);
  
  if (metricIndex === -1) {
    throw new Error("Metric not found");
  }
  
  mockMetrics.splice(metricIndex, 1);
  return { success: true };
};
