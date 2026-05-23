import { create } from 'zustand';
import { Child, Measurement } from '@/lib/types';

interface PatientState {
  patients: Child[];
  measurements: Measurement[];
  activePatient: Child | null;
  addPatient: (patient: Child) => void;
  addMeasurement: (measurement: Measurement) => void;
  setActivePatient: (patientId: string) => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  patients: [],
  measurements: [],
  activePatient: null,
  addPatient: (patient) => set((state) => ({ patients: [...state.patients, patient] })),
  addMeasurement: (measurement) => set((state) => ({ measurements: [...state.measurements, measurement] })),
  setActivePatient: (patientId) => set((state) => ({
    activePatient: state.patients.find(p => p.id === patientId) || null,
  })),
}));
