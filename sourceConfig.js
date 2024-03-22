import fs from 'node:fs';
import os from 'node:os';

const filePath = os.homedir() + '/.ns-switcher';

export function readSourceConfig() {
	if (!fs.existsSync(filePath)) {
		writeData(initSources);
		return initSources;
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
	initSources.push(source);
	writeData(initSources);
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


const initSources = [
	{
		name: 'npm',
		url: 'https://registry.npmjs.org/',
		desc: '官方源',
	},
	{
		name: 'taobao',
		url: 'https://registry.npmmirror.com/',
		desc: '淘宝',
	},
	{
		name: 'tuna',
		url: 'https://mirrors.tuna.tsinghua.edu.cn/',
		desc: '清华',
	},
];
