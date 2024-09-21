import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import { genereateUploadUrl } from '../../business/Todo'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Processing Event ', event)
  const todoId = event.pathParameters?.todoId as string

  const URL = await genereateUploadUrl(todoId)

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: URL
    })
  }
}
