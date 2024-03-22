import fs from 'node:fs';
import os from 'node:os';
import { sourceList } from './sources.js';

const filePath = os.homedir() + '/.ns-switcher';

export function readSourceConfig() {
	if (!fs.existsSync(filePath)) {
		writeData(sourceList);
		return sourceList;
	}

	const cachedList = fs.readFileSync(filePath);
	return JSON.parse(cachedList);
}

export function addSource(source) {
	const list = readSourceConfig();
	for (let s of list) {
		if (s.name === source.name) {
			console.error('源已存在');
			return;
		}
	}
	sourceList.push(source);
	writeData(sourceList);
}

export function delSource(sourceName) {
	const list = readSourceConfig();
	const index = list.findIndex(s => s.name === sourceName);
	if (index === -1) {
		console.error('❗源不存在');
		return;
	}
	list.splice(index, 1);
	writeData(list);
}

function writeData(data) {
	fs.writeFileSync(filePath, JSON.stringify(data));
}
