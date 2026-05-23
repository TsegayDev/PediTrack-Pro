
import { LucideIcon } from "lucide-react";

export type Sex = 'male' | 'female';

export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  sex: Sex;
}

export interface Measurement {
  id: string;
  childId: string;
  date: string;
  height?: number; // cm
  weight?: number; // kg
  headCircumference?: number; // cm
  muac?: number; // cm
  tricepsSkinfold?: number; // mm
  subscapularSkinfold?: number; // mm
  bmi?: number;
  systolicBP?: number;
  diastolicBP?: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  Icon: LucideIcon;
  gradient: string;
}

export interface LmsData {
  month?: number;
  length?: number;
  height?: number;
  L: number;
  M: number;
  S: number;
}

export interface GrowthClassification {
  zScore: number;
  percentile: number;
  classification: string;
}

export interface BpData {
    age: number;
    percentiles: {
        bp_percentile: string;
        systolic: { [key: string]: number };
        diastolic: { [key: string]: number };
    }[];
}

export interface BpClassification {
    classification: string;
    systolic: number;
    diastolic: number;
    systolic_percentile: number | string;
    diastolic_percentile: number | string;
    bp_percentile: number | string;
}

export interface Activity {
  id: string;
  timestamp: number;
  toolId: string;
  toolName: string;
  fullName: string;
  summary: string;
  data: {
    inputs: any;
    results: any;
  }
}


    