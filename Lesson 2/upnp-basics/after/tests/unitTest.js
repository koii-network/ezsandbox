const { coreLogic } = require('../coreLogic');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeTasks() {
    // i is the round number
    for (let i = 0; i < 10; i++) {
        let delay = 6000;
        let round = i;
        await coreLogic.task(round);
        await coreLogic.submitTask(round);
        await coreLogic.auditTask(round);
        await sleep(delay);
    }
    console.log('All tasks executed. Test completed.')
    process.exit(0);
}

executeTasks();
