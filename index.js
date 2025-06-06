#!/usr/bin/env node


import { Command } from "commander";
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import axios from 'axios';


const program = new Command();
const ModDirectories = path.join(process.env.appdata, "CuddleManager");
const orange = chalk.hex('#FF8800');


// Configuration for Commander
program
  .name("cuddle")
  .description("Just a lighweight and simple mod manager, because I was tired of Vortex.")
  .version("1.0.0");

program
  .command('setup')
  .description("Required to use CuddleManager.")
  .option('-s, --silent', "Makes setup not log anything.")
  .action((options) => {
    if (!fs.existsSync('./config.json')) {
    fs.writeFileSync('./config.json', '');
    if (!options.silent) console.log(chalk.green("Config.json created."))
  } else {
    if (!options.silent) console.log(orange("config.json already exists."))
  }

    if (!fs.existsSync(ModDirectories)) {
    fs.mkdirSync(ModDirectories);
    if (!options.silent) console.log(chalk.green("CuddleManager created in AppData."))
  } else {
    if (!options.silent) console.log(orange("CuddleManager folder already exists."))
  }
  })
// Select Command

program
  .command("select [directory]")
  .description("Changes what directory Subnautica is using for mods.")
  .action((directory) => {
    if (directory == null) {
      // If the folder doesn't exist, create it
      if (!fs.existsSync(ModDirectories)) {
        console.log(chalk.red("You have to run `cuddle setup`."))
      } else {
        // Folder exists, read the directories inside it
        const allEntries = fs.readdirSync(ModDirectories, { withFileTypes: true });
        const directories = allEntries.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
  
        if (directories.length === 0) {
          console.log("No directories found inside ModDirectories.\nYou can create a new directory by running cuddle create <dirname>.");
        } else {
          console.log("Directories inside ModDirectories:");
          directories.forEach(dir => console.log("- " + dir));
        }
      }
    } else {
      const SelectedDirectory = path.join(ModDirectories, directory);
      if (fs.existsSync(SelectedDirectory)) {
        console.log(chalk.blue("Selected directory: `{directory}`"))
      }
    }
  });

// Create command

program
  .command("create <dirname>")
  .description("Creates a new mod directory.")
  .action((dirname) => {
    const newDir = path.join(ModDirectories, dirname);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir);
      console.log(`Created new directory: ${newDir}`);
    } else {
      console.log(`Directory already exists: ${newDir}`);
    }
  });


// Delete command

program
  .command("delete <dirname>")
  .description("Deletes a mod directory.")
  .action((dirname) => {
    const dirToDelete = path.join(ModDirectories, dirname);
    if (fs.existsSync(dirToDelete)) {
      fs.rmSync(dirToDelete, { recursive: true });
      console.log(`Deleted directory: ${dirToDelete}`);
    } else {
      console.log(`Directory does not exist: ${dirToDelete}`);
    }
  });

program
  .command("api <key>")
  .option("-f, --force", "Force replace to the API key.")
  .description("Needed to use the mod search/download.")
  .action((key, options) => {
    if (!fs.readFileSync("./config.json") || options.force) {
      fs.writeFileSync('./config.json', JSON.stringify(key, null, 2));
      console.log(chalk.green("API key saved."))
    } else {
      console.log(chalk.yellow("API key already saved. Do --force to replace."))
    }
  })


program.parse();
  