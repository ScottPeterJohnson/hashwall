// @ts-ignore
const wasm = import("../pkg/index.js").catch(console.error);

self.addEventListener('message', (event)=>{
    const data = event.data as Call;
    const options = data.options;
    wasm.then((module)=>{
        const results = [];
        let target = options.target;
        for(let i=0;i<options.repetitions;i++){
            const result : number = (module as any).hash(options.target, options.difficulty);
            results.push(result);
            target = result;
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
        } as DoneResponse)
    });
});
