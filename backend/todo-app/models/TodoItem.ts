/**
 * A model for a Todo listing
 */

export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  imageUrl?: string
}
