import { Play, HandPalm } from 'phosphor-react'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useState, createContext } from 'react'
import { CountDown } from './Countdown'
import { NewCycleForm } from './NewCycleForm'

interface ICycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface ICyclesContextType {
  activeCycle: ICycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
}

export const CyclesContext = createContext({} as ICyclesContextType)

export const Home = () => {
  const [cycles, setCycles] = useState<ICycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  /*
  I did this in order to prevent unecessary iterarions through 
  the cycle array just to find the active cycle
  */

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

  // const handleCreateNewCycle = (data: NewCycleFormData) => {
  //   const id = String(new Date().getTime())

  //   const newCycle: ICycle = {
  //     id,
  //     task: data.task,
  //     minutesAmount: data.minutesAmount,
  //     startDate: new Date(),
  //   }

  //   // whenever we alter an state that depends on its previous version, it is a best pratice to use as function syntax
  //   setCycles((state) => [...state, newCycle])

  //   setActiveCycleId(id)
  //   setAmountOfSecondsPassed(0)

  //   reset()
  // }

  // const task = watch('task')
  // const minutesAmount = watch('minutesAmount')

  // const isSubmitDisabled = !task || !minutesAmount

  function handleInterruptCycle() {
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

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  return (
    <HomeContainer>
      <form /* onSubmit={handleSubmit(handleCreateNewCycle)} */ action="">
        <CyclesContext.Provider
          value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished }}
        >
          <NewCycleForm />
          <CountDown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="submit">
            <HandPalm size={24} /> Stop
          </StopCountdownButton>
        ) : (
          <StartCountdownButton /* disabled={isSubmitDisabled} */ type="submit">
            <Play size={24} /> Start
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
