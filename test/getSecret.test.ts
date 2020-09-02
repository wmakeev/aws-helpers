/* eslint node/no-unpublished-import:0 */

import test from 'blue-tape'

import { getSecret, getSecretEnv, getAuth } from '../src/getSecret'

test('getSecret', async t => {
  const secret = await getSecret('TEST_PARAM_SECRET')

  t.equals(secret, 'login\npassword')
})

test('getSecretEnv', async t => {
  const res = await getSecretEnv<{ LOGIN: string; PASSWORD: string }>(
    'TEST_PARAM_ENV_SECRET'
  )

  t.equals(res!.LOGIN, 'login')
  t.equals(res!.PASSWORD, 'password')
})

test('getAuth', async t => {
  const [LOGIN, PASSWORD] = await getAuth('TEST_PARAM_SECRET')

  t.equals(LOGIN, 'login')
  t.equals(PASSWORD, 'password')
})
