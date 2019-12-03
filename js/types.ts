interface BaseOptions {
    target : number
    repetitions : number
    difficulty : number
}

interface FullOptions extends BaseOptions {
    onProgress? : (current : number, total : number)=>void;
    onDone : (results: Array<number>) => void;
}

interface StartCall {
    callId : CallId,
    type: 'start',
    options : BaseOptions
}

interface StopCall {
    callId : CallId,
    type: 'stop'
}

type Call = StartCall | StopCall;

interface DoneResponse {
    callId : CallId
    type: 'done'
    results: number[]
}

interface ProgressResponse {
    callId : CallId
    type: 'progress',
    current : number,
    total : number
}

type CallResponse = DoneResponse | ProgressResponse;
type CallId = number;