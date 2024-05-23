//import {fs} from "fs/promises";

const directory  = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share");  
console.log(directory);
