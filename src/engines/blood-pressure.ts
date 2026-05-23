import type { Sex, BpClassification as BpClassificationType } from '@/lib/types';
import boysBpData from '@/data/who-growth/blood-pressure-for-age-boys.json';
import girlsBpData from '@/data/who-growth/blood-pressure-for-age-girls.json';
import { calculateHeightForAge } from './growth';

// Simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type BpData = {
  age: number;
  percentiles: {
    bp_percentile: string;
    systolic: { [key: string]: number };
    diastolic: { [key: string]: number };
  }[];
};

export interface BpClassification extends BpClassificationType {
    systolic: number;
    diastolic: number;
};

function getClosestHeightPercentile(percentile: number): string {
    const availablePercentiles = [5, 10, 25, 50, 75, 90, 95];
    return availablePercentiles.reduce((prev, curr) => 
        Math.abs(curr - percentile) < Math.abs(prev - percentile) ? curr : prev
    ).toString();
}

function getReadingForPercentile(
  bpDataForAge: BpData,
  heightPercentileKey: string,
  bpPercentile: '50th' | '90th' | '95th'
): { systolic: number; diastolic: number } {
  const percentileData = bpDataForAge.percentiles.find(p => p.bp_percentile === bpPercentile);
  if (!percentileData) {
    throw new Error(`Could not find ${bpPercentile} BP percentile data.`);
  }
  return {
    systolic: percentileData.systolic[heightPercentileKey + 'th'],
    diastolic: percentileData.diastolic[heightPercentileKey + 'th'],
  };
}


function classifyBloodPressure(
  systolic: number,
  diastolic: number,
  ageInYears: number,
  sex: Sex,
  heightPercentile: number
): BpClassification {
    const bpData = sex === 'male' ? boysBpData.blood_pressure_data.boys : girlsBpData.blood_pressure_data.girls;
    const ageData = bpData.find(d => d.age === Math.floor(ageInYears));

    if (!ageData) {
        throw new Error('Blood pressure data not available for this age.');
    }
    
    const heightPercentileKey = getClosestHeightPercentile(heightPercentile);

    const bp50 = getReadingForPercentile(ageData, heightPercentileKey, '50th');
    const bp90 = getReadingForPercentile(ageData, heightPercentileKey, '90th');
    const bp95 = getReadingForPercentile(ageData, heightPercentileKey, '95th');

    const systolicPercentile = calculateBPPercentile(systolic, bp50.systolic, bp90.systolic, bp95.systolic);
    const diastolicPercentile = calculateBPPercentile(diastolic, bp50.diastolic, bp90.diastolic, bp95.diastolic);
    
    let classification = '';

    const sysPercentileNumber = typeof systolicPercentile === 'string' ? 99 : systolicPercentile;
    const diaPercentileNumber = typeof diastolicPercentile === 'string' ? 99 : diastolicPercentile;

    const finalPercentile = Math.max(sysPercentileNumber, diaPercentileNumber);


    if (ageInYears >= 1 && ageInYears < 13) {
        if (finalPercentile < 90) {
            classification = 'Normal';
        } else if (finalPercentile >= 90 && finalPercentile < 95) {
            classification = 'Elevated';
        } else if (finalPercentile >= 95) {
            const stage2Sys = bp95.systolic + 12;
            const stage2Dia = bp95.diastolic + 12;
            if (systolic >= stage2Sys || diastolic >= stage2Dia) {
                classification = 'Stage 2 Hypertension';
            } else {
                classification = 'Stage 1 Hypertension';
            }
        }
    } else { // 13 years and older
        if (systolic < 120 && diastolic < 80) {
            classification = 'Normal';
        } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
            classification = 'Elevated';
        } else if (systolic >= 130 && systolic <= 139 || diastolic >= 80 && diastolic <= 89) {
            classification = 'Stage 1 Hypertension';
        } else if (systolic >= 140 || diastolic >= 90) {
            classification = 'Stage 2 Hypertension';
        }
    }

    if (finalPercentile < 10) {
        classification = "Hypotension";
    }

    return {
        classification,
        systolic,
        diastolic,
        systolic_percentile: typeof systolicPercentile === 'number' ? systolicPercentile.toFixed(1) : systolicPercentile,
        diastolic_percentile: typeof diastolicPercentile === 'number' ? diastolicPercentile.toFixed(1) : diastolicPercentile,
        bp_percentile: finalPercentile.toFixed(1)
    };
}

function calculateBPPercentile(value: number, p50: number, p90: number, p95: number): number | string {
    if (value < p50) {
        // Crude linear interpolation for values below 50th percentile
        const p5 = p50 - (p90 - p50) * (50 / 40) // Estimate 5th percentile
        if (value < p5) return 5
        return 5 + ((value - p5) / (p50 - p5)) * 45;
    }
    if (value < p90) {
        return 50 + ((value - p50) / (p90 - p50)) * 40;
    }
    if (value < p95) {
        return 90 + ((value - p90) / (p95 - p90)) * 5;
    }
    return '>95';
}

export async function analyzeBloodPressure(
  ageInYears: number,
  sex: Sex,
  height: number,
  systolic: number,
  diastolic: number
): Promise<BpClassification> {
  await sleep(1500); // Simulate calculation time

  if(ageInYears < 1 || ageInYears > 17) {
      throw new Error("Age must be between 1 and 17 years for this tool.");
  }
  
  const ageInMonths = ageInYears * 12;
  const heightAnalysis = await calculateHeightForAge(ageInMonths, height, sex);
  const heightPercentile = heightAnalysis.percentile;

  const bpClassification = classifyBloodPressure(systolic, diastolic, ageInYears, sex, heightPercentile);
  
  return bpClassification;
}

export async function getBloodPressureChartData(sex: Sex) {
    const bpData = sex === 'male' ? boysBpData.blood_pressure_data.boys : girlsBpData.blood_pressure_data.girls;
    
    // We will use the 50th height percentile for the chart reference
    const heightPercentileKey = '50';

    return bpData.map(ageData => {
        const p50 = getReadingForPercentile(ageData, heightPercentileKey, '50th');
        const p90 = getReadingForPercentile(ageData, heightPercentileKey, '90th');
        const p95 = getReadingForPercentile(ageData, heightPercentileKey, '95th');

        return {
            age: ageData.age,
            systolic: {
                p50: p50.systolic,
                p90: p90.systolic,
                p95: p95.systolic,
            },
            diastolic: {
                p50: p50.diastolic,
                p90: p90.diastolic,
                p95: p95.diastolic,
            }
        }
    });
}
