const wasm = import("../pkg/index.js").catch(console.error);

const inProgress : Set<number> = new Set();

self.addEventListener('message', (event)=>{
    const data = event.data as Call;
    if(data.type == 'start'){
        calculate(data);
    } else if(data.type == 'stop'){
        inProgress.delete(data.callId);
    }
});

async function calculate(data : StartCall){
    inProgress.add(data.callId);
    const options = data.options;
    let module = await wasm;
    const results = [];
    let target = options.target;
    for(let i=0;i<options.repetitions;i++){
        const result : string = (module as any).hash(target, options.difficulty);
        const [counter, nextTarget] = result.split("|");
        results.push(counter);

        target = nextTarget;

        await new Promise(resolve => setTimeout(resolve, 0)); //Allows an interrupt
        if(!inProgress.has(data.callId)){
            return;
        }

        (postMessage as any)({
            callId: data.callId,
            type: 'progress',
            current: i,
            total: options.repetitions
        } as ProgressResponse)
    }
    (postMessage as any)({
        callId: data.callId,
        type: 'done',
        results: results
    } as DoneResponse);
    inProgress.delete(data.callId);
}