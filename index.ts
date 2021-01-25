import { createDataFileContent } from './generators'
import * as fs from 'fs'

const targetFilename = './output/comp.json'

const compData = createDataFileContent(2000)

fs.writeFileSync(targetFilename, JSON.stringify(compData, null, ' '), 'utf8')
