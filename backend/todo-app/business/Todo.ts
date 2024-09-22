import { TodoItem } from '../models/TodoItem'
import { getUserId } from '../auth/utils'
import { CreateRequest } from '../requests/CreateRequest'
import { UpdateRequest } from '../requests/UpdateRequest'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess } from '../data/TodoAccess'
import * as crypto from 'crypto-randomuuid'

const access = new TodoAccess()

export async function getAllTodo(jwtToken: string): Promise<TodoItem[]> {
  const userId = getUserId(jwtToken)
  return access.getAllTodo(userId)
}

export function createTodo(
  createrequest: CreateRequest,
  jwtToken: string
): Promise<TodoItem> {
  const userId = getUserId(jwtToken)
  const todoId = crypto.randomUUID().toString()
  const s3BucketName = process.env.S3_BUCKET_NAME

  return access.createTodo({
    userId: userId,
    todoId: todoId,
    createdAt: new Date().getTime().toString(),
    imageUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
    done: false,
    ...createrequest
  })
}

export function updateTodo(
  updaterequest: UpdateRequest,
  jwtToken: string,
  todoId: string
): Promise<TodoUpdate> {
  const userId = getUserId(jwtToken)
  return access.updateTodo(updaterequest, todoId, userId)
}

export function deleteTodo(todoId: string, jwtToken: string): Promise<string> {
  const userId = getUserId(jwtToken)
  return access.delete(userId, todoId)
}

export const genereateUploadUrl = (todoId: string): Promise<string> =>
  access.generateUploadUrl(todoId)
