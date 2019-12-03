export default function hashwall(options : FullOptions) : CallId {
    ensureInitialized();
    const id = callId++;
    callbacks[id] = options;
    worker!!.postMessage({
        type: 'start',
        options: {
            target: options.target,
            repetitions: options.repetitions,
            difficulty: options.difficulty
        } as BaseOptions,
        callId: id
    } as StartCall);
    return id;
}

export function stop(callId : CallId){
    if(worker != null){
        worker!!.postMessage({
            type: 'stop',
            callId: callId
        } as StopCall);
        delete callbacks[callId];
    }
}



let callId = 0;
let worker : Worker|null = null;
const callbacks : {[id : number] : FullOptions} = {};

function ensureInitialized(){
    if(worker == null){
        worker = new Worker('./rust.worker.ts', { name: 'rustworker', type: 'module' });
        worker.addEventListener('message', (event)=>{
            const data = event.data as CallResponse;
            const opts = callbacks[data.callId];
            if(opts){
                switch(data.type){
                    case "done":
                        opts.onDone(data.results);
                        delete callbacks[data.callId];
                        break;
                    case "progress":
                        opts.onProgress && opts.onProgress(data.current, data.total);
                        break;
                }
            }
        });
    }
}