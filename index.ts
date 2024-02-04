import { DataSourceFile } from './src/data-source/data-source-file'
import { DtsGenerator } from './src/dts/generator'
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

try {
  const dts = new DtsGenerator(new DataSourceFile('./debug/protocol.proto'))

  dts.generate()

} catch (e) {
  console.log(e)
}
