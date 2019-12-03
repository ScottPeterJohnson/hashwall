interface BaseOptions {
    target : number
    repetitions : number
    difficulty : number
}

interface FullOptions extends BaseOptions {
    onProgress? : (current : number, total : number)=>void;
    onDone : (results: Array<number>) => void;
}

interface Call {
    callId : number,
    options : BaseOptions
}

interface DoneResponse {
    callId : number
    type: 'done'
    results: number[]
}

interface ProgressResponse {
    callId : number
    type: 'progress',
    current : number,
    total : number
}

type CallResponse = DoneResponse | ProgressResponse;