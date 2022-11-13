import { useContext } from 'react'
import { CyclesContext } from '../../contexts/CyclesContext'
import { HistoryContainer, HistoryList, Status } from './styles'
import { formatDistanceToNow } from 'date-fns'

export const History = () => {
  const { cycles } = useContext(CyclesContext)

  return (
    <HistoryContainer>
      <h1>My history</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Duration</th>
              <th>Start</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {cycles.map((element) => {
              return (
                <tr key={element.id}>
                  <td>{element.task}</td>
                  <td>{element.minutesAmount} minutes</td>
                  <td>
                    {formatDistanceToNow(new Date(element.startDate), {
                      addSuffix: true,
                    })}
                  </td>

                  <td>
                    {element.finishedDate && (
                      <Status statusColor="green">Done</Status>
                    )}

                    {element.interruptedDate && (
                      <Status statusColor="red">Interrupted</Status>
                    )}

                    {!element.finishedDate && !element.interruptedDate && (
                      <Status statusColor="yellow">In progress</Status>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
