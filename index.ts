import { DataSourceFile } from './src/data-source/data-source-file'
import { DtsFile } from './src/dts/file'
import { MutatorType } from './src/dts/enum/mutator-type'
import { Serialize } from './src/dts/serialize/serialize'

import camelCase from 'lodash.camelcase'

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

  return map[value] ?? value
})

Serialize.addMutationRule(MutatorType.PackageNameToNamespace, (value) => {
  return camelCase(
    value
      .replace(/^common./, '')
      .split('.')
      .join('_')
  ).replace(/^(.)(.*)$/, ($0, $1, $2) => {
    return `${$1.toUpperCase()}${$2}`
  })
})

try {
  const dts = new DtsFile(new DataSourceFile('./debug/src.proto'))

  dts.perform().then((data) => {
    console.log(data)
  })


} catch (e) {
  console.log(e)
}
