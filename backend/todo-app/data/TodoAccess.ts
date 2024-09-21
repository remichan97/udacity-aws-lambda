import * as AWS from 'aws-sdk'
import * as XRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Types } from 'aws-sdk/clients/s3'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {
  constructor(
    xray = XRay.captureAWS(AWS),
    private readonly docClient: DocumentClient = new xray.DynamoDB.DocumentClient(),
    private readonly s3Client: Types = new xray.S3({ signatureVersion: 'v4' }),
    private readonly todoTable = process.env.TODO_TABLE as string,
    private readonly s3BucketName = process.env.S3_BUCKET_NAME as string
  ) {}

  async getAllTodo(userId: string): Promise<TodoItem[]> {
    const params = {
      TableName: this.todoTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        userId: userId
      }
    }
    const result = await this.docClient.query(params).promise()
    return result.Items as TodoItem[]
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    const params = {
      TableName: this.todoTable,
      Item: todoItem
    }

    const result = await this.docClient.put(params).promise()
    if (result.$response.error) {
      throw new Error(result.$response.error.message)
    }
    return todoItem as TodoItem
  }

  async updateTodo(
    todoUpdate: TodoUpdate,
    todoId: string,
    userId: string
  ): Promise<TodoUpdate> {
    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set #a = :a, #b = :b, #c = :c',
      ExpressionAttributeNames: {
        '#a': 'name',
        '#b': 'dueDate',
        '#c': 'done'
      },
      ExpressionAttributeValues: {
        ':a': todoUpdate['name'],
        ':b': todoUpdate['dueDate'],
        ':c': todoUpdate['done']
      },
      ReturnValues: 'ALL_NEW'
    }
    const result = await this.docClient.update(params).promise()
    return result.Attributes as TodoUpdate
  }

  async delete(todoId: string, userId: string): Promise<string> {
    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }
    const result = await this.docClient.delete(params).promise()

    if (result.$response.error) {
      throw new Error(result.$response.error.message)
    }
    return ''
  }

  async generateUploadUrl(todoId: string): Promise<string> {
    return this.s3Client.getSignedUrl('putObject', {
      Bucket: this.s3BucketName,
      Key: todoId,
      Expires: 1000
    })
  }
}
