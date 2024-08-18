export interface ToDoListing {
	userId: string
	todoId: string
	createdAt: string
	name: string
	dueDate: string
	done: boolean
	imageUrl?: string
}