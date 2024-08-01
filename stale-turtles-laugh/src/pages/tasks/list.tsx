import { KanbanBoardContainer, KanbanBoard } from '@/components/tasks/kanban/board'
import KanbanColumn from '@/components/tasks/kanban/column'
import KanbanItem from '@/components/tasks/kanban/item'


const List = () => {
  return (
    <>
        <KanbanBoardContainer>
            <KanbanBoard>
                <KanbanColumn>
                  <KanbanItem>
                    This is my first to-do
                  </KanbanItem>
                </KanbanColumn>
                <KanbanColumn>

                </KanbanColumn>
            </KanbanBoard>
        </KanbanBoardContainer>
    </>
  )
}

export default List