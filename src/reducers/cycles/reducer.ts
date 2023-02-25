import produce from 'immer'
import { ActionTypes } from './actions'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  start: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CycleState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CycleState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })
    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const cycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )
      if (cycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[cycleIndex].interruptedDate = new Date()
      })
    }
    case ActionTypes.FINISH_CURRENT_CYCLE: {
      const cycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )
      if (cycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[cycleIndex].finishedDate = new Date()
      })
    }
    default:
      return state
  }
}
