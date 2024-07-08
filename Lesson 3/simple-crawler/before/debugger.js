require('dotenv').config;
const os = require('os');
const path = require('path');
const { Connection, PublicKey } = require('@_koii/web3.js');

class Debugger {
  /*
  Create .env file with following variables or direclty input values to be used in live-debugging mode.
  */
  static taskID =
    process.env.TASK_ID || 'AK2P1L8NWGwWarbHeM7tX2mr4hJA7ZVXGSSSz5PWHBHv';
  static webpackedFilePath = process.env.WEBPACKED_FILE_PATH || 'dist/main.js';
  static keywords = [process.env.TEST_KEYWORD] || ['TEST'];
  static nodeDir = process.env.NODE_DIR || '';

  static async getConfig() {
    Debugger.nodeDir = await this.getNodeDirectory();

    let destinationPath =
      'executables/' + (await this.gettask_audit_program()) + '.js';
    let logPath = 'namespace/' + Debugger.taskID + '/task.log';

    console.log('Debugger.nodeDir', Debugger.nodeDir);

    return {
      webpackedFilePath: Debugger.webpackedFilePath,
      destinationPath: destinationPath,
      keywords: Debugger.keywords,
      logPath: logPath,
      nodeDir: Debugger.nodeDir,
      taskID: Debugger.taskID,
    };
  }

  static async getNodeDirectory() {
    if (Debugger.nodeDir) {
      return Debugger.nodeDir;
    }
    const homeDirectory = os.homedir();
    let nodeDirectory;

    switch (os.platform()) {
      case 'linux':
        nodeDirectory = path.join(
          homeDirectory,
          '.config',
          'KOII-Desktop-Node',
        );
        break;
      case 'darwin':
        nodeDirectory = path.join(
          homeDirectory,
          'Library',
          'Application Support',
          'KOII-Desktop-Node',
        );
        break;
      case 'win32':
        // For Windows, construct the path explicitly as specified
        nodeDirectory = path.join(
          homeDirectory,
          'AppData',
          'Roaming',
          'KOII-Desktop-Node',
        );
        break;
      default:
        nodeDirectory = path.join(
          homeDirectory,
          'AppData',
          'Roaming',
          'KOII-Desktop-Node',
        );
    }

    return nodeDirectory;
  }

  static async gettask_audit_program() {
    const connection = new Connection('https://testnet.koii.network');
    const taskId = Debugger.taskID;
    const accountInfo = await connection.getAccountInfo(new PublicKey(taskId));
    if (!accountInfo) {
      console.log(`${taskId} doesn't contain any distribution list data`);
      return null;
    }

    const data = JSON.parse(accountInfo.data.toString());
    console.log('data.task_audit_program', data.task_audit_program);
    return data.task_audit_program;
  }
}

module.exports = Debugger;
