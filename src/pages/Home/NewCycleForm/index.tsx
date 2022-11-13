import { FormContainer, MinutesAmountInput, TaskInput } from './styles'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useContext } from 'react'
import { CyclesContext } from '..'

//
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Please inform your task.'),
  minutesAmount: zod
    .number()
    .min(5, 'Your task must be at least 5 minutes longer.')
    .max(60, 'Your task must be 60 minutes maximum.'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema> // Inherits the types from the Zod's formSchema
//

export const NewCycleForm = () => {
  const { activeCycle } = useContext(CyclesContext)

  const { register } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  return (
    <FormContainer>
      <label htmlFor="">I will focus on</label>
      <TaskInput
        id="task"
        list="task-suggestions"
        placeholder="Name your task"
        {...register('task')}
        disabled={!!activeCycle}
      />
      <datalist id="task-suggestions">
        <option value="Project 1"></option>
        <option value="Project 2"></option>
        <option value="Project 3"></option>
      </datalist>

      <label htmlFor="">for</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        min={5}
        max={60}
        {...register('minutesAmount', { valueAsNumber: true })}
        disabled={!!activeCycle}
      />
      <span>minutes.</span>
    </FormContainer>
  )
}
