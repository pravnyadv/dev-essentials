'use client'
import { useState } from 'react'
import Quiz from '../shared/Quiz.jsx'
import Stepper from '../shared/Stepper.jsx'
import Diagram from './Diagram.jsx'

// Scene for one data-driven step: diagram, the working under it, and an optional quiz.
function DataStage({ step, picked, onPick }) {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Diagram d={step.scene} />
      <p className="flex min-h-6 items-center text-center text-sm font-medium">{step.calc}</p>
      {step.quiz && <Quiz quiz={step.quiz} picked={picked} onPick={onPick} />}
    </div>
  )
}

// Steps through a pattern. `stage(i)` replaces the data-driven Diagram with a custom interactive scene.
export default function Walkthrough({ steps, stage }) {
  const [picks, setPicks] = useState({})
  return <Stepper steps={steps} stage={stage ?? (k => <DataStage step={steps[k]} picked={picks[k]} onPick={n => setPicks(p => ({ ...p, [k]: n }))} />)} />
}
