import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import { CreateRequest } from '../../requests/CreateRequest'
import { createTodo } from '../../business/Todo'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Processing Event ', event)
  const authorization = event.headers.Authorization
  const split = authorization?.split(' ')
  const jwtToken = split === undefined ? '' : split[1]

  const newTodo: CreateRequest = JSON.parse(event.body as string)
  const toDoItem = await createTodo(newTodo, jwtToken)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: toDoItem
    })
  }
}
