import * as React from 'react'
import { Paper } from 'eri'
import { keysToIgnore } from '../Job'

interface IProps {
  job: {
    description: string
    numberOfDays: number | null
    hourlyRate: number | null
    hoursPerWeek: string | null
    id: string
    location: string
    pricingStructure: string | null
    remote: boolean | null
    title: string
    type: string
  }
  onClick(): void
}

export default function JobListItem({ job, ...rest }: IProps) {
  return (
    <Paper {...rest}>
      <h3>{job.title}</h3>
      <ul>
        {Object.entries(job)
          .filter(([key, val]) => {
            if (keysToIgnore.includes(key)) return false
            return val !== null
          })
          .map(([key, val]) => (
            <li key={key}>
              {key}: {val}
            </li>
          ))}
      </ul>
    </Paper>
  )
}
