export default function hashwall(options : FullOptions){
    ensureInitialized();
    const id = callId++;
    callbacks[id] = options;
    worker!!.postMessage({
        options: {
            target: options.target,
            repetitions: options.repetitions,
            difficulty: options.difficulty
        } as BaseOptions,
        callId: id
    } as Call);
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
            switch(data.type){
                case "done":
                    opts.onDone(data.results);
                    delete callbacks[data.callId];
                    break;
                case "progress":
                    opts.onProgress && opts.onProgress(data.current, data.total);
                    break;
            }
        });
    }
}