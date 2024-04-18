const { spawn } = require('cross-spawn');
const fs = require('fs');
const dotenv = require('dotenv');
const Tail = require('tail').Tail;


dotenv.config();
// TODO - add switch for operating system to get Node DIR
const nodeDIR = process.env.NODE_DIR;
const sourcePath = __dirname + "/" + process.env.WEBPACKED_FILE_PATH;
const desktopNodeExecutablePath = nodeDIR + process.env.DESTINATION_PATH; 
const desktopNodeLogPath = nodeDIR + process.env.LOG_PATH;  
const keyword = process.env.KEYWORD; 
// console.log(process.env)

/*
    This script is used to watch for file changes in the project and trigger a build and copy the webpacked file to the Desktop Node runtime folder.
    It also tails the logs for messages containing a keyword specified in the .env file.

    Example Usage:
    - Add the following to your package.json file:
        "scripts": {
            "prod-debug": "node prod-debug.js"
        }
    - Create a .env file in the root of the project with the following content: 
        WEBPACKED_FILE_PATH=dist/hello-world.js
        DESTINATION_PATH=/_some_CID_task_file_name_.js
        LOG_PATH=/logs/_some_Task_ID_.log
        KEYWORD=DEBUG
        NODE_DIR=/path/to/node/dir/
    - Run the script using the command: yarn prod-debug
    - Change a file in the project and see the script trigger a build and copy the file to the Desktop Node runtime folder
    - Check the logs from the desktop node that contain your keyword

*/

// Load environment variables from .env file
dotenv.config();

const startWatching = async () => {
    console.log('Watching for file changes...');
    // watch and trigger builds
    await build();
    // fs.watch('.', { recursive: true }, async (eventType, filename) => {
    //     if (filename && (filename.endsWith('.js') || filename.endsWith('.css'))) {
    //             await build();
    //     }
    // });
};

/* build and webpack the task */
const build = async () => {
    console.log('Building...');
    const child = await spawn('yarn', ['webpack:prod'], { stdio: 'inherit' });

    await child.on('close', (code) => {
        if (code !== 0) {
            console.error('Build failed');
        } else {
            console.log('Build successful');
            copyWebpackedFile();
        }
        return;
    });
};

/* copy the task to the Desktop Node runtime folder */
const copyWebpackedFile = async () => {
    if (!sourcePath || !desktopNodeExecutablePath) {
        console.error('Source path or destination path not specified in .env');
        return;
    }

    console.log(`Copying webpacked file from ${sourcePath} to ${desktopNodeExecutablePath}...`);

    fs.copyFile(sourcePath, desktopNodeExecutablePath, async (err) => {
        if (err) {
            console.error('Error copying file:', err);
        } else {
            console.log('File copied successfully');
            tailLogs();
        }
    });
};

/* tail logs */
const tailLogs = async () => {
    console.log('Watchings logs for messages containing ', keyword)
    let tail = new Tail(desktopNodeLogPath, "\n", {}, true);

    tail.on("line", function(data) {
        // console.log(data);
        if (data.includes(keyword)) {
            console.log(`PROD$ ${data}`);
        }
    });

    tail.on("error", function(error) {
    console.log('ERROR: ', error);
    });
};


startWatching();