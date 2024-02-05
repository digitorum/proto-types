import { DataSourceFile } from './src/data-source/data-source-file'
import { DtsFile } from './src/dts/file'
import { MutatorType } from './src/dts/enum/mutator-type'
import { Serialize } from './src/dts/serialize/serialize'

import camelCase from 'lodash.camelcase'
import path from 'node:path'

function getNamespaceName(src: string | string[]) {
  let chunks: string[] = []

  if (Array.isArray(src)) {
    chunks = src
  } else {
    chunks = src
      .replace(/^common./, '')
      .split('.')
  }

  return camelCase(
    chunks
      .filter((node) => node !== 'common')
      .join('_')
  ).replace(/^(.)(.*)$/, ($0, $1, $2) => {
    return `${$1.toUpperCase()}${$2}`
  })
}

Serialize.addMutationRule(MutatorType.VariableName, (value) => {
  return camelCase(value)
})

Serialize.addMutationRule(MutatorType.VariableType, (value) => {
  const map: Record<string, string> = {
    'google.protobuf.Timestamp': 'string',
    bool: 'boolean',
    bytes: 'string',
    int32: 'number',
    uint32: 'number'
  }

  if (map[value]) {
    return map[value]
  }

  if (value.match('.')) {
    const chunks = value
      .split('.')

    if (chunks.length > 1) {
      const type = chunks.pop()
      const ns = getNamespaceName(chunks)

      return `${ns}.${type}`
    }

  }

  return value
})

Serialize.addMutationRule(MutatorType.PackageNameToNamespace, (value) => {
  return getNamespaceName(value)
})

Serialize.addMutationRule(MutatorType.ImportFilePath, (value) => {
  return value
    .replace(/\//g, '_')
    .replace(/\.proto$/, '.d.ts')
})

try {
  const dts = new DtsFile({
    basePath: path.resolve(__dirname, './types/'),
    dataSource: new DataSourceFile('./proto/service/auth/external.proto')
  })

  dts.write('auth_external.d.ts')
} catch (e) {
  console.log(e)
}
