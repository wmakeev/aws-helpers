import { SSM } from 'aws-sdk'
import { parse } from 'envfile'
import memoize from 'lodash.memoize'

const ssm = new SSM()

const DEBUG = Boolean(process.env.DEBUG)

export const getSecret = memoize(async (secretName: string) => {
  const params = {
    Name: secretName,
    WithDecryption: true
  }

  const startTime = Date.now()

  const result = await ssm.getParameter(params).promise()

  if (DEBUG) {
    console.log(
      `${secretName} SSM parameter received with ${Date.now() - startTime}ms`
    )
  }

  const secretValue = result.Parameter?.Value ?? null

  return secretValue
})

export const getSecretEnv = memoize(
  async <T extends object = Record<string, string>>(
    secretName: string
  ): Promise<T | null> => {
    const secretText = await getSecret(secretName)

    if (secretText === null) return null

    const secretEnv = parse<Record<string, string>>(secretText)

    return secretEnv as T
  }
)

export const getAuth = memoize(async (secretName: string) => {
  const secret = await getSecret(secretName)
  return secret?.split('\n') ?? []
})
