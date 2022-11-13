import { createContext, ReactNode, useState } from 'react'

interface ICreateCycleData {
  task: string
  minutesAmount: number
}

interface ICycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface ICyclesContextType {
  cycles: ICycle[]
  activeCycle: ICycle | undefined
  activeCycleId: string | null
  amountOfSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: ICreateCycleData) => void
  interruptCurrentCycle: () => void
}

interface ICyclesContextProviderProps {
  children: ReactNode
}

export const CyclesContext = createContext({} as ICyclesContextType)

export const CyclesContextProvider = ({
  children,
}: ICyclesContextProviderProps) => {
  const [cycles, setCycles] = useState<ICycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountOfSecondsPassed, setAmountOfSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const setSecondsPassed = (seconds: number) => {
    setAmountOfSecondsPassed(seconds)
  }

  const markCurrentCycleAsFinished = () => {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  const createNewCycle = (data: ICreateCycleData) => {
    const id = String(new Date().getTime())

    const newCycle: ICycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    // whenever we alter an state that depends on its previous version, it is a best pratice to use as function syntax
    setCycles((state) => [...state, newCycle])

    setActiveCycleId(id)
    setAmountOfSecondsPassed(0)
  }

  const interruptCurrentCycle = () => {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountOfSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
