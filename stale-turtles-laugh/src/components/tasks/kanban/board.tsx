import { DndContext } from '@dnd-kit/core'
import React from 'react'

export const KanbanBoardContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <div 
    style={{

    }}
    >
        <div 
        style={{

        }}
        >
            {children}
        </div>
    </div>
  )
}

export const KanbanBoard = ({ children }: React.PropsWithChildren) => {
    return (
        <DndContext>
            {children}
        </DndContext>
    )
}