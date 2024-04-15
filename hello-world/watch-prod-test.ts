const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const keyword = process.env.KEYWORD; // Get keyword from .env

const watchFiles = () => {
    const targetFilePath = process.env.TARGET_FILE_PATH; // Get target file path from .env

    if (!targetFilePath) {
        console.error('Target file path not specified in .env');
        return;
    }

    console.log(`Watching file ${targetFilePath} for lines containing keyword "${keyword}"...`);

    fs.watchFile(targetFilePath, (curr, prev) => {
        // Check if file content has changed
        if (curr.size > prev.size || curr.mtime > prev.mtime) {
            readTargetFile(targetFilePath);
        }
    });
};

const readTargetFile = (filePath) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    let buffer = '';

    stream.on('data', (data) => {
        buffer += data;
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Save incomplete line for next iteration

        lines.forEach((line) => {
            if (line.includes(keyword)) {
                console.log(`Found line with keyword "${keyword}": ${line}`);
            }
        });
    });

    stream.on('end', () => {
        // Handle any remaining buffer content after end of file
        if (buffer.length > 0) {
            if (buffer.includes(keyword)) {
                console.log(`Found line with keyword "${keyword}": ${buffer}`);
            }
        }
    });

    stream.on('error', (err) => {
        console.error('Error reading file:', err);
    });
};

// Start watching the target file
watchFiles();
