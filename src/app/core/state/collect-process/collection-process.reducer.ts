import { createReducer, on } from "@ngrx/store"
import * as CollectionProcessActions from "./collection-process.actions"
import type { CollectionData } from "../../models/collect-process.model"

export interface CollectionProcessState {
  currentStep: number
  collectionData: CollectionData
}

export const initialState: CollectionProcessState = {
  currentStep: 1,
  collectionData: {
    wasteType: [],
    actualWeight: 0,
    photos: [],
    status: "pending",
  },
}

export const collectionProcessReducer = createReducer(
  initialState,
  on(CollectionProcessActions.nextStep, (state) => ({ ...state, currentStep: Math.min(state.currentStep + 1, 4) })),
  on(CollectionProcessActions.previousStep, (state) => ({ ...state, currentStep: Math.max(state.currentStep - 1, 1) })),
  on(CollectionProcessActions.updateMaterialType, (state, { materialType }) => ({
    ...state,
    collectionData: { ...state.collectionData, materialType },
  })),
  on(CollectionProcessActions.updateActualWeight, (state, { weight }) => ({
    ...state,
    collectionData: { ...state.collectionData, actualWeight: weight },
  })),
  on(CollectionProcessActions.addPhotos, (state, { photos }) => ({
    ...state,
    collectionData: { ...state.collectionData, photos: [...state.collectionData.photos, ...photos] },
  })),
  on(CollectionProcessActions.validateTransaction, (state) => ({
    ...state,
    collectionData: { ...state.collectionData, status: "validated" },
  })),
  on(CollectionProcessActions.rejectTransaction, (state) => ({
    ...state,
    collectionData: { ...state.collectionData, status: "rejected" },
  })),
  on(CollectionProcessActions.loadFromLocalStorage, (state, { data }) => ({
    ...state,
    collectionData: data,
  })),
)

