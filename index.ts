import {createDataFileContent} from './generators';
import * as fs from 'fs';

const targetFilename = './output/comp-small.json';

const compData = createDataFileContent(100);

fs.writeFileSync(targetFilename, JSON.stringify(compData, null, ' '), 'utf8');
