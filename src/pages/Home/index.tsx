import { Play, HandPalm } from 'phosphor-react'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useState, createContext } from 'react'
import { CountDown } from './Countdown'
import { NewCycleForm } from './NewCycleForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'

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
  amountOfSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as ICyclesContextType)

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Please inform your task.'),
  minutesAmount: zod
    .number()
    .min(5, 'Your task must be at least 5 minutes longer.')
    .max(60, 'Your task must be 60 minutes maximum.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema> // Inherits the types from the Zod's formSchema

export const Home = () => {
  const [amountOfSecondsPassed, setAmountOfSecondsPassed] = useState(0)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  const [cycles, setCycles] = useState<ICycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  /*
  I did this in order to prevent unecessary iterarions through 
  the cycle array just to find the active cycle
  */

  const task = watch('task')
  const minutesAmount = watch('minutesAmount')
  // const isSubmitDisabled = !task || !minutesAmount
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

  const handleCreateNewCycle = (data: NewCycleFormData) => {
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

    reset()
  }

  const handleInterruptCycle = () => {
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
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountOfSecondsPassed,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <CountDown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="submit">
            <HandPalm size={24} /> Stop
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit">
            <Play size={24} /> Start
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
