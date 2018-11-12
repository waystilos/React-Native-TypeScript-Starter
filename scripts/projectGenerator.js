#!/usr/bin/env node

const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs');
const fse = require('fs-extra');
const child_process = require('child_process');
const { promisify } = require('util');

const exec = promisify(child_process.exec);
const readdir = promisify(fs.readdir);
const CURRENT_DIRECTORY = process.cwd();

async function copyDirectory(filePath) {
  const response = await readdir(filePath);

  const QUESTIONS = [
    {
      name: 'project-choice',
      type: 'list',
      message: 'What project template would you like to generate?',
      choices: response
    },
    {
      name: 'project-name',
      type: 'input',
      message: 'Project name:',
      validate: function(input) {
        if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
        else
          return 'Project name may only include letters, numbers, underscores and hashes.';
      }
    }
  ];

  const answers = await inquirer.prompt(QUESTIONS);
  const projectChoice = answers['project-choice'];
  const projectName = answers['project-name'];
  const templatePath = `${filePath}/${projectChoice}`;

  createDirectoryContents(templatePath, projectName);
}

function main() {
  copyDirectory(`${__dirname}/../templates`);
}

async function createDirectoryContents(templatePath, newProjectPath) {
  try {
    const spinner = ora('Generating project, hold up...').start();
    await exec(`react-native init ${newProjectPath}`, (error, stdout) => {
      fse.copy(templatePath, `${CURRENT_DIRECTORY}/${newProjectPath}/`);
      spinner.succeed('All done');
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

main();
