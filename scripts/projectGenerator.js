#!/usr/bin/env node

const fse = require('fs-extra');
const path = require('path');
const current_directory = process.cwd();

const inquirer = require('inquirer');

const CHOICES = fse.readdirSync(`/${__dirname}/../templates`);

const QUESTIONS = [
  {
    name: 'project-choice',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES
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

inquirer.prompt(QUESTIONS).then(answers => {
  const projectChoice = answers['project-choice'];
  const projectName = answers['project-name'];
  const templatePath = `./templates/${projectChoice}`;
  fse.mkdirSync(`${current_directory}/${projectName}`);
  createDirectoryContents(templatePath, projectName);
});

const createDirectoryContents = async (templatePath, newProjectPath) => {
  fse.copy(templatePath, `${current_directory}/${newProjectPath}`, err => {
    if (err) return console.error(err);
    console.log('success!');
  });
};
