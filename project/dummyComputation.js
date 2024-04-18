const dummyComputation = () => {
    let dataStore = [];
    let startTime = Date.now();
    let memoryFilled = false;

    const hash = (input) => {
        let hash = 0, i, chr;
        if (input.length === 0) return hash;
        for (i = 0; i < input.length; i++) {
            chr = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    const computeIntensiveTask = () => {
        let result = 0;
        for (let i = 0; i < 1000; i++) {
            result += Math.sqrt(i);
        }
        return hash(result.toString());
    };

    const fillMemory = () => {
        try {
            for (let i = 0; memoryFilled === false; i++) {
                if (process.memoryUsage().rss > (1.5 * 1024 * 1024 * 1024)) {
                    console.log("Approaching 1.5GB memory usage, stopping allocations.");
                    memoryFilled = true; // Mark as memory filled
                    break; // Stop the loop if memory usage exceeds ~1.5GB
                }

                const smallBuffer = Buffer.alloc(1024, 'a'); // 1KB
                dataStore.push(smallBuffer);
                if (i % 100 === 0) {
                    computeIntensiveTask(); // Keep the CPU busy!!!
                }
            }
        } catch (e) {
            console.log('Memory filling stopped:', e);
        }
    };

    // Make sure continuous CPU work
    const continuousCPULoad = () => {
        const endTime = startTime + 1200000; // 20 minutes
        const compute = () => {
            if (Date.now() < endTime) {
                computeIntensiveTask();
                setImmediate(compute); // Schedule the next computation
            } else {
                console.log('20 minutes reached, stopping CPU work.');
            }
        };
        compute(); // Start continuous computation
    };

    fillMemory();
    console.log('Memory filled or limit reached. Continuing with CPU tasks.');
    continuousCPULoad(); // Initiate continuous CPU work until 10 minutes are up
};

module.exports = dummyComputation;  // Export the dummyComputation function


