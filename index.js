#!/usr/bin/env node

import {
	commandHelp,
	commandList,
	commandUse,
	commandSet,
	commandDel,
} from './commands/index.js';
import { readSourceConfig } from './sourceConfig.js';

const sourceList = readSourceConfig();

// 简单的命令行参数解析逻辑
const args = process.argv.slice(2);
if (args.length === 2) {
	const sourceName = args[1];
	if (args[0] === 'use') {
		commandUse(sourceName);
	} else if (args[0] === 'del' || args[0] === '-d') {
		commandDel(sourceName);
	} else {
		exitNotice();
	}
} else if (args.length === 1) {
	if (args[0] === 'list' || args[0] === '-l') {
		commandList();
	} else if (args[0] === 'use') {
		commandUse();
	} else if (args[0] === 'del') {
		commandDel();
	} else if (args[0] === 'help' || args[0] === '-h') {
		commandHelp();
	} else if (args[0] === 'add') {
		commandSet();
	} else {
		exitNotice();
	}
} else {
	exitNotice();
}

function exitNotice() {
	console.log('👉使用方式: nss use <源名称>');
	console.log(`❗支持的源有：${sourceList.map(item => item.name).join(',')}`);
	process.exit(1);
}
