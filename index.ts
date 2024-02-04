import { DataSourceFile } from './src/data-source/data-source-file'
import { DtsGenerator } from './src/dts/generator'

const datasource = new DataSourceFile('./debug/src.proto')

try {
  const dts = new DtsGenerator(datasource)

  dts.generate()

} catch (e) {
  console.log(e)
}
