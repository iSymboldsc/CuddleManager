#!/usr/bin/env node


import { Command } from "commander";
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';


const program = new Command();
const ModDirectories = path.join(process.env.appdata, "CuddleManager");

// Configuration for Commander
program
  .name("cuddle")
  .description("Just a lighweight and simple mod manager, because I was tired of Vortex.")
  .version("1.0.0");

// Select Command

program
  .command("select [directory]")
  .description("Changes what directory Subnautica is using for mods.")
  .action((directory) => {
    if (directory == null) {
      // If the folder doesn't exist, create it
      if (!fs.existsSync(ModDirectories)) {
        fs.mkdirSync(ModDirectories, { recursive: true }); // recursive true just in case
        console.log("Created the mod directories folder.");
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
program.parse();
  