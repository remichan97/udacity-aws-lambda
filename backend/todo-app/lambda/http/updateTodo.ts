import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import { UpdateRequest } from '../../requests/UpdateRequest'
import { updateTodo } from '../../business/Todo'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  console.log('Processing Event ', event)
  const authorization = event.headers.Authorization
  const split = authorization?.split(' ')
  const jwtToken = split === undefined ? '' : split[1]

  const todoId = event.pathParameters?.todoId as string
  const updatedTodo: UpdateRequest = JSON.parse(event.body as string)

  const toDoItem = await updateTodo(updatedTodo, todoId, jwtToken)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: toDoItem
    })
  }
}
