#!/usr/bin/env node


import { Command } from "commander";

import path from 'path';
import fs from 'fs';


const program = new Command();
const ModDirectories = path.join(process.env.appdata, "CuddleManager");


program
  .name("CuddleManager")
  .description("Just a lighweight and simple mod manager, because I was tired of Vortex.")
  .version("1.0.0");
program
  .command("cd [directory]")
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
          console.log("No directories found inside ModDirectories.");
        } else {
          console.log("Directories inside ModDirectories:");
          directories.forEach(dir => console.log("- " + dir));
        }
      }
    } else {
      console.log(`${directory}`); // or your logic for changing directory
    }
  });
  