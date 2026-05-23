import type { LmsData, GrowthClassification, Sex } from '@/lib/types';
import hfaBoysData from '@/data/who-growth/height-for-age-boys-z.json';
import hfaGirlsData from '@/data/who-growth/height-for-age-girls-z.json';
import wfaBoysData from '@/data/who-growth/weight-for-age-boys-z.json';
import wfaGirlsData from '@/data/who-growth/weight-for-age-girls-z.json';
import wflBoysData from '@/data/who-growth/weight-for-length-boys-z.json';
import wflGirlsData from '@/data/who-growth/weight-for-length-girls-z.json';
import wfhBoysData from '@/data/who-growth/weight-for-height-boys-z.json';
import wfhGirlsData from '@/data/who-growth/weight-for-height-girls-z.json';
import bfaBoysData from '@/data/who-growth/bmi-for-age-boys-z.json';
import bfaGirlsData from '@/data/who-growth/bmi-for-age-girls-z.json';
import hcfaBoysData from '@/data/who-growth/head-circumference-for-age-boys-z.json';
import hcfaGirlsData from '@/data/who-growth/head-circumference-for-age-girls-z.json';
import acfaBoysData from '@/data/who-growth/arm-circumference-for-age-boys-z.json';
import acfaGirlsData from '@/data/who-growth/arm-circumference-for-age-girls-z.json';
import tsfaBoysData from '@/data/who-growth/triceps-skinfold-for-age-boys-z.json';
import tsfaGirlsData from '@/data/who-growth/triceps-skinfold-for-age-girls-z.json';
import ssfaBoysData from '@/data/who-growth/subscapular-skinfold-for-age-boys-z.json';
import ssfaGirlsData from '@/data/who-growth/subscapular-skinfold-for-age-girls-z.json';

// Simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function standardNormalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  let probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) {
    probability = 1 - probability;
  }
  return probability;
}

async function getLmsData(indicator: string, sex: Sex): Promise<LmsData[]> {
    switch (indicator) {
        case 'hfa':
            return sex === 'male' ? (hfaBoysData as LmsData[]) : (hfaGirlsData as LmsData[]);
        case 'wfa':
            return sex === 'male' ? (wfaBoysData as LmsData[]) : (wfaGirlsData as LmsData[]);
        case 'wfl':
            return sex === 'male' ? (wflBoysData as LmsData[]) : (wflGirlsData as LmsData[]);
        case 'wfh':
            return sex === 'male' ? (wfhBoysData as LmsData[]) : (wfhGirlsData as LmsData[]);
        case 'bfa':
            return sex === 'male' ? (bfaBoysData as LmsData[]) : (bfaGirlsData as LmsData[]);
        case 'hcfa':
            return sex === 'male' ? (hcfaBoysData as LmsData[]) : (hcfaGirlsData as LmsData[]);
        case 'acfa':
            return sex === 'male' ? (acfaBoysData as LmsData[]) : (acfaGirlsData as LmsData[]);
        case 'tsfa':
            return sex === 'male' ? (tsfaBoysData as LmsData[]) : (tsfaGirlsData as LmsData[]);
        case 'ssfa':
            return sex === 'male' ? (ssfaBoysData as LmsData[]) : (ssfaGirlsData as LmsData[]);
        default:
            throw new Error(`Invalid indicator: ${indicator}`);
    }
}

function findLmsForAge(data: LmsData[], ageInMonths: number): LmsData | null {
  const age = Math.floor(ageInMonths);
  return data.find(d => d.month === age) || null;
}

function findLmsForLength(data: LmsData[], length: number): LmsData | null {
    const roundedLength = Math.round(length * 2) / 2;
    return data.find(d => d.length === roundedLength) || null;
}

function findLmsForHeight(data: LmsData[], height: number): LmsData | null {
    const roundedHeight = Math.round(height * 2) / 2;
    return data.find(d => d.height === roundedHeight) || null;
}


function calculateZScore(measurement: number, lms: LmsData): number {
    const { L, M, S } = lms;
    if (L !== 0) {
        return (Math.pow(measurement / M, L) - 1) / (L * S);
    } else {
        return Math.log(measurement / M) / S;
    }
}

function getPercentile(zScore: number): number {
    const clampedZ = Math.max(-4, Math.min(4, zScore));
    return standardNormalCDF(clampedZ) * 100;
}

function classifyHeight(zScore: number): string {
  if (zScore < -3) return 'Severely Stunted';
  if (zScore < -2) return 'Stunted';
  if (zScore > 3) return 'Very Tall';
  if (zScore > 2) return 'Tall';
  return 'Normal';
}

function classifyWeightForAge(zScore: number): string {
  if (zScore < -3) return 'Severely Underweight';
  if (zScore < -2) return 'Underweight';
  if (zScore > 2) return 'Overweight';
  if (zScore > 3) return 'Obese';
  return 'Normal';
}

function classifyWeightForLength(zScore: number): string {
    if (zScore < -3) return 'Severely Wasted';
    if (zScore < -2) return 'Wasted';
    if (zScore > 3) return 'Obese';
    if (zScore > 2) return 'Overweight';
    return 'Normal';
}

function classifyBmi(zScore: number): string {
    if (zScore < -3) return 'Severely Thin';
    if (zScore < -2) return 'Thin';
    if (zScore > 2) return 'Overweight';
    if (zScore > 3) return 'Obese';
    return 'Normal';
}

function classifyHeadCircumference(zScore: number): string {
    if (zScore < -2) return 'Microcephaly';
    if (zScore > 2) return 'Macrocephaly';
    return 'Normal';
}

function classifyMuac(zScore: number): string {
    if (zScore < -3) return 'Severe Acute Malnutrition';
    if (zScore < -2) return 'Moderate Acute Malnutrition';
    return 'Normal';
}

function classifySkinfold(zScore: number): string {
    if (zScore < -3) return 'Very Low';
    if (zScore < -2) return 'Low';
    if (zScore > 2) return 'High';
    if (zScore > 3) return 'Very High';
    return 'Normal';
}


function getValueForZScore(zScore: number, l: number, m: number, s: number): number {
    if (l !== 0) {
        return m * Math.pow(1 + l * s * zScore, 1 / l);
    }
    return m * Math.exp(s * zScore);
}

export async function calculateHeightForAge(
  ageInMonths: number,
  height: number,
  sex: Sex
): Promise<GrowthClassification> {
  await sleep(1400); 
  const data = await getLmsData('hfa', sex);
  const lms = findLmsForAge(data, ageInMonths);

  if (!lms) {
    throw new Error(`Age ${ageInMonths} months is out of range for calculation.`);
  }

  const zScore = calculateZScore(height, lms);
  const percentile = getPercentile(zScore);
  const classification = classifyHeight(zScore);

  return {
    zScore,
    percentile,
    classification,
  };
}

export async function calculateWeightForAge(
  ageInMonths: number,
  weight: number,
  sex: Sex
): Promise<GrowthClassification> {
  await sleep(1400); 
  const data = await getLmsData('wfa', sex);
  const lms = findLmsForAge(data, ageInMonths);

  if (!lms) {
    throw new Error(`Age ${ageInMonths} months is out of range for calculation.`);
  }

  const zScore = calculateZScore(weight, lms);
  const percentile = getPercentile(zScore);
  const classification = classifyWeightForAge(zScore);

  return { zScore, percentile, classification };
}

export async function calculateWeightForLength(
  length: number,
  weight: number,
  sex: Sex
): Promise<GrowthClassification> {
  await sleep(1400); 
  const data = await getLmsData('wfl', sex);
  const lms = findLmsForLength(data, length);

  if (!lms) {
    throw new Error(`Length ${length}cm is out of range for calculation.`);
  }

  const zScore = calculateZScore(weight, lms);
  const percentile = getPercentile(zScore);
  const classification = classifyWeightForLength(zScore);

  return { zScore, percentile, classification };
}

export async function calculateWeightForHeight(
  height: number,
  weight: number,
  sex: Sex
): Promise<GrowthClassification> {
  await sleep(1400);
  const data = await getLmsData('wfh', sex);
  const lms = findLmsForHeight(data, height);
  
  if (!lms) {
    throw new Error(`Height ${height}cm is out of range for calculation.`);
  }

  const zScore = calculateZScore(weight, lms);
  const percentile = getPercentile(zScore);
  const classification = classifyWeightForLength(zScore);

  return { zScore, percentile, classification };
}

export async function calculateBmiForAge(
  ageInMonths: number,
  bmi: number,
  sex: Sex
): Promise<GrowthClassification> {
  await sleep(1400);
  const data = await getLmsData('bfa', sex);
  const lms = findLmsForAge(data, ageInMonths);
  
  if (!lms) {
    throw new Error(`Age ${ageInMonths} months is out of range for calculation.`);
  }

  const zScore = calculateZScore(bmi, lms);
  const percentile = getPercentile(zScore);
  const classification = classifyBmi(zScore);

  return { zScore, percentile, classification };
}

export async function calculateHeadCircumferenceForAge(
  ageInMonths: number,
  headCircumference: number,
  sex: Sex
): Promise<GrowthClassification> {
  await sleep(1400);
  const data = await getLmsData('hcfa', sex);
  const lms = findLmsForAge(data, ageInMonths);
  
  if (!lms) {
    throw new Error(`Age ${ageInMonths} months is out of range for calculation.`);
  }

  const zScore = calculateZScore(headCircumference, lms);
  const percentile = getPercentile(zScore);
  const classification = classifyHeadCircumference(zScore);

  return { zScore, percentile, classification };
}

export async function calculateMuacForAge(
  ageInMonths: number,
  muac: number,
  sex: Sex
): Promise<GrowthClassification> {
  await sleep(1400);
  const data = await getLmsData('acfa', sex);
  const lms = findLmsForAge(data, ageInMonths);
  
  if (!lms) {
    throw new Error(`Age ${ageInMonths} months is out of range for calculation.`);
  }

  const zScore = calculateZScore(muac, lms);
  const percentile = getPercentile(zScore);
  const classification = classifyMuac(zScore);

  return { zScore, percentile, classification };
}

export async function calculateTricepsSkinfoldForAge(
  ageInMonths: number,
  skinfold: number,
  sex: Sex
): Promise<GrowthClassification> {
  await sleep(1400);
  const data = await getLmsData('tsfa', sex);
  const lms = findLmsForAge(data, ageInMonths);
  
  if (!lms) {
    throw new Error(`Age ${ageInMonths} months is out of range for calculation.`);
  }

  const zScore = calculateZScore(skinfold, lms);
  const percentile = getPercentile(zScore);
  const classification = classifySkinfold(zScore);

  return { zScore, percentile, classification };
}

export async function calculateSubscapularSkinfoldForAge(
  ageInMonths: number,
  skinfold: number,
  sex: Sex
): Promise<GrowthClassification> {
  await sleep(1400);
  const data = await getLmsData('ssfa', sex);
  const lms = findLmsForAge(data, ageInMonths);
  
  if (!lms) {
    throw new Error(`Age ${ageInMonths} months is out of range for calculation.`);
  }

  const zScore = calculateZScore(skinfold, lms);
  const percentile = getPercentile(zScore);
  const classification = classifySkinfold(zScore);

  return { zScore, percentile, classification };
}


export async function getHeightForAgeChartData(sex: Sex, zScores: number[]) {
    const data = await getLmsData('hfa', sex);
    const chartData = data.map(point => {
        const row: { month: number; [key: string]: number } = { month: point.month! };
        for (const z of zScores) {
            row[`sd${z}`] = getValueForZScore(z, point.L, point.M, point.S);
        }
        return row;
    });
    return chartData;
}

export async function getWeightForAgeChartData(sex: Sex, zScores: number[]) {
    const data = await getLmsData('wfa', sex);
    const chartData = data.map(point => {
        const row: { month: number; [key: string]: number } = { month: point.month! };
        for (const z of zScores) {
            row[`sd${z}`] = getValueForZScore(z, point.L, point.M, point.S);
        }
        return row;
    });
    return chartData;
}

export async function getWeightForLengthChartData(sex: Sex, zScores: number[]) {
    const data = await getLmsData('wfl', sex);
    const chartData = data.map(point => {
        const row: { length: number; [key: string]: number } = { length: point.length! };
        for (const z of zScores) {
            row[`sd${z}`] = getValueForZScore(z, point.L, point.M, point.S);
        }
        return row;
    });
    return chartData;
}

export async function getWeightForHeightChartData(sex: Sex, zScores: number[]) {
    const data = await getLmsData('wfh', sex);
    const chartData = data.map(point => {
        const row: { height: number; [key: string]: number } = { height: point.height! };
        for (const z of zScores) {
            row[`sd${z}`] = getValueForZScore(z, point.L, point.M, point.S);
        }
        return row;
    });
    return chartData;
}

export async function getBmiForAgeChartData(sex: Sex, zScores: number[]) {
    const data = await getLmsData('bfa', sex);
    const chartData = data.map(point => {
        const row: { month: number; [key: string]: number } = { month: point.month! };
        for (const z of zScores) {
            row[`sd${z}`] = getValueForZScore(z, point.L, point.M, point.S);
        }
        return row;
    });
    return chartData;
}

export async function getHeadCircumferenceForAgeChartData(sex: Sex, zScores: number[]) {
    const data = await getLmsData('hcfa', sex);
    const chartData = data.map(point => {
        const row: { month: number; [key: string]: number } = { month: point.month! };
        for (const z of zScores) {
            row[`sd${z}`] = getValueForZScore(z, point.L, point.M, point.S);
        }
        return row;
    });
    return chartData;
}

export async function getMuacForAgeChartData(sex: Sex, zScores: number[]) {
    const data = await getLmsData('acfa', sex);
    const chartData = data.map(point => {
        const row: { month: number; [key: string]: number } = { month: point.month! };
        for (const z of zScores) {
            row[`sd${z}`] = getValueForZScore(z, point.L, point.M, point.S);
        }
        return row;
    });
    return chartData;
}

export async function getTricepsSkinfoldForAgeChartData(sex: Sex, zScores: number[]) {
    const data = await getLmsData('tsfa', sex);
    const chartData = data.map(point => {
        const row: { month: number; [key: string]: number } = { month: point.month! };
        for (const z of zScores) {
            row[`sd${z}`] = getValueForZScore(z, point.L, point.M, point.S);
        }
        return row;
    });
    return chartData;
}

export async function getSubscapularSkinfoldForAgeChartData(sex: Sex, zScores: number[]) {
    const data = await getLmsData('ssfa', sex);
    const chartData = data.map(point => {
        const row: { month: number; [key: string]: number } = { month: point.month! };
        for (const z of zScores) {
            row[`sd${z}`] = getValueForZScore(z, point.L, point.M, point.S);
        }
        return row;
    });
    return chartData;
}
