import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { deleteTodo } from '../../business/Todo'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Processing Event ', event)
  const authorization = event.headers.Authorization
  const split = authorization?.split(' ')
  const jwtToken = split === undefined ? '' : split[1]

  const todoId = event.pathParameters?.todoId as string

  const deleteData = await deleteTodo(todoId, jwtToken)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: deleteData
  }
}
