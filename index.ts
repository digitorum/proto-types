import type { SerializeContext } from './src/dts/serialize/serialize'

import { DataSourceFile } from './src/data-source/data-source-file'
import { DtsFile } from './src/dts/file'
import { MutatorType } from './src/dts/enum/mutator-type'
import { Serialize } from './src/dts/serialize/serialize'

import camelCase from 'lodash.camelcase'
import path from 'node:path'

function getNamespaceName(src: string, context: SerializeContext) {

  const commonRe = /^common\./

  let chunks: string[] = (
      commonRe.test(src)
        ? src // передан абсолютный путь
        : `${context.package}.${src}` // передан относительный путь
    )
    .replace(commonRe, '')
    .split('.')

  return camelCase(
    chunks
      .filter((node) => node !== 'common')
      .join('_')
  ).replace(/^(.)(.*)$/, ($0, $1, $2) => {
    return `${$1.toUpperCase()}${$2}`
  })
}

export function getTargetFilePath(value: string) {
  return value
    .replace(/^\.\//, '')
    .replace(/\//g, '_')
    .replace(/\.proto$/, '.d.ts')
}

Serialize.addMutationRule(MutatorType.VariableName, (value) => {
  return camelCase(value)
})

Serialize.addMutationRule(MutatorType.VariableType, (value, context) => {
  const map: Record<string, string> = {
    'google.protobuf.Any': 'any',
    'google.protobuf.Empty': 'any',
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
    const chunks = value.split('.')

    if (chunks.length > 1) {
      const type = chunks.pop()
      const ns = getNamespaceName(chunks.join('.'), context)

      return `${ns}.${type}`
    }

  }

  return value
})

Serialize.addMutationRule(MutatorType.PackageNameToNamespace, (value, context) => {
  return getNamespaceName(value, context)
})

Serialize.addMutationRule(MutatorType.ImportFilePath, (value) => {
  return getTargetFilePath(value)
})

const file = 'proto/service/protocol/external.proto'

try {
  const dts = new DtsFile({
    basePath: path.resolve(__dirname, './types/'),
    dataSource: new DataSourceFile(file)
  })

  dts.write(getTargetFilePath(file))
} catch (e) {
  console.log(e)
}
