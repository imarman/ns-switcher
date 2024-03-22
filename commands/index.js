import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { addSource, delSource, readSourceConfig } from '../sourceConfig.js';

const sourceList = readSourceConfig();

export function commandList() {
	console.log('当前支持的源列表:');
	sourceList.forEach(source => {
		console.log(`✅ ${source.name}(${source.desc}) -> ${source.url}`);
	});
}

export function commandUse(sourceName) {
	if (sourceName) {
		changeNpmSource(sourceName);
		return;
	}
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'source',
				message: '请选择想要切换到的源:',
				choices: sourceList,
			},
		])
		.then(answers => changeNpmSource(answers.source));
}

export function commandHelp() {
	console.log(`使用方式: 
	切换源: nss use <name>
	查看源列表: nss -l
	删除源: nss del <name>
	新增源信息: nss set
	`);
}

const getSourceObj = name => sourceList.filter(s => s.name === name)[0];

function changeNpmSource(name) {
	const selectedSource = getSourceObj(name);
	if (!selectedSource) {
		console.error(
			`未找到名为 '${name}' 的源，请检查名称是否正确。\n支持的源有：${sourceList
				.map(item => item.name)
				.join(',')}`
		);
		process.exit(1);
	}

	const sourceUrl = selectedSource.url;
	try {
		execSync(`npm config set registry ${sourceUrl}`, { stdio: 'inherit' });
		console.log(`NPM 源已更改为: ${name} (${sourceUrl})`);
	} catch (error) {
		console.error(`更改NPM源失败: ${error.message}`);
	}
}

export function commandSet() {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'name',
				message: '请输入源名称:',
				validate: value => {
					return !value ? '❗请输入源名称' : true;
				},
			},
			{
				type: 'input',
				name: 'desc',
				message: '请输入源描述:',
			},
			{
				type: 'input',
				name: 'url',
				message: '请输入源地址:',
				validate: value => {
					return !value ? '❗请输入源地址' : true;
				},
			},
		])
		.then(answers => {
			addSource(answers);
		});
}

export function commandDel(sourceName) {
	if (sourceName) {
		delSource(sourceName);
		return;
	}
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'source',
				message: '请选择想要删除的源:',
				choices: sourceList,
			},
		])
		.then(answers => delSource(answers.source));
}
