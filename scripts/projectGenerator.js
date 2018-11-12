#!/usr/bin/env node

const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs');
const fse = require('fs-extra');
const { promisify } = require('util');

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

  fs.mkdirSync(`${CURRENT_DIRECTORY}/${projectName}`);
  createDirectoryContents(templatePath, projectName);
}

copyDirectory(`${__dirname}/../templates`);

async function createDirectoryContents(templatePath, newProjectPath) {
  try {
    const spinner = ora('Generating project, hold up...').start();
    await fse.copy(templatePath, newProjectPath);
    spinner.succeed('All done');
  } catch (error) {
    console.error(error);
  }
}
