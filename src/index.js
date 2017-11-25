/**
 * @param {function}
 * @param {}
 */
function interval(func, intervalLength, options = {}) {    

    const defaults = {
        iterations: Infinity,
        stopOnError: true
    }
    const settings = Object.assign(defaults, options)

    return new Promise((rootPromiseResolve, rootPromiseReject) => {

        const callFunction = currentIteration => {
            
            let stopRequested = false
            const stop = () => {
                stopRequested = true
            }
        
            const callNext = () => {
                // If we've hit the desired number of iterations, or stop was called, resolve the root promise and return
                if (currentIteration === settings.iterations || stopRequested) {
                    rootPromiseResolve()
                    return
                }
        
                // Otherwise, call the next iteration
                callFunction(currentIteration + 1)
            }
        
            const calculatedIntervalLength = (typeof intervalLength === 'function') ? intervalLength(currentIteration + 1) : intervalLength
        
            // Call the user function after the desired interval length. After, call the next iteration (and/or handle error)
            setTimeout(() => {
                func(currentIteration, stop).then(callNext).catch(err => {
                    if (!settings.stopOnError) {
                        callNext()
                        return
                    }
        
                    rootPromiseReject(err)
                })
            }, calculatedIntervalLength)
        }

        callFunction(1)        
    })
}

module.exports = interval
