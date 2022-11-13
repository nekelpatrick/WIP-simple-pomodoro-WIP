import { Play, HandPalm } from 'phosphor-react'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

import { CountDown } from './Countdown'
import { NewCycleForm } from './NewCycleForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'
import { useContext } from 'react'
import { CyclesContext } from '../../contexts/CyclesContext'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Please inform your task.'),
  minutesAmount: zod
    .number()
    .min(5, 'Your task must be at least 5 minutes longer.')
    .max(60, 'Your task must be 60 minutes maximum.'),
})

type INewCycleFormData = zod.infer<typeof newCycleFormValidationSchema> // Inherits the types from the Zod's formSchema

export const Home = () => {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)

  const newCycleForm = useForm<INewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  /*
  I did this in order to prevent unecessary iterarions through 
  the cycle array just to find the active cycle
  */

  const handleCreateNewCycle = (data: INewCycleFormData) => {
    createNewCycle(data)
    reset()
  }

  const task = watch('task')
  const minutesAmount = watch('minutesAmount')
  const isSubmitDisabled = !task || !minutesAmount

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <CountDown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="submit">
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
