import hashwall, {stop} from "../hashwall";
// @ts-ignore
import {sha256} from "js-sha256";
// @ts-ignore
import * as hexToBinary from "hex-to-binary";

let locked = true;
let inProgress = false;

const startButton = document.getElementById("start")!!;
const difficulty = document.getElementById("difficulty")!! as HTMLInputElement;
const repetitions = document.getElementById("repetitions")!! as HTMLInputElement;
const progress = document.getElementById("progress")!!;
const progressSlider = document.getElementById("progressSlider")!! as HTMLInputElement;
const progressText = document.getElementById("progressText")!! as HTMLDivElement;
const lockedDiv = document.getElementById("locked")!!;
const unlockedDiv = document.getElementById("unlocked")!!;

function showOnlyIf(element : HTMLElement, show : Boolean){
    if(show){
        element.style.removeProperty("display");
    } else {
        element.style.setProperty("display", "none");
    }
}

function updateUi(){
    showOnlyIf(progress, inProgress);
    showOnlyIf(lockedDiv, locked);
    showOnlyIf(unlockedDiv, !locked);
}

updateUi();

function updateProgress(current : number, total : number){
    const percent = Math.trunc((current / total) * 100);
    progressSlider.value = ""+percent;
    progressText.innerText = `${current} out of ${total} (${percent}%)`;
}

let calculationInProgress : CallId | null = null;

startButton.addEventListener("click", ()=>{
    if(calculationInProgress != null){
        stop(calculationInProgress);
    }
    locked = true;
    inProgress = true;
    updateUi();

    const baseOptions = {
        target: Math.floor(Math.random() * 2147483647),
        repetitions: Number.parseInt(repetitions.value),
        difficulty: Number.parseInt(difficulty.value)
    };

    updateProgress(0, baseOptions.repetitions);

    calculationInProgress = hashwall({
        //The server should generate a target, repetition count, and difficulty and relay them to the client, who
        //passes them to hashwall here.
        ...baseOptions,
        onDone(results){
            locked = false;
            inProgress = false;
            updateUi();

            //The server should be passed just the results, NOT allowing clients to specify the options (those should be
            //remembered). It can then verify that the client did the work.
            verifyResults(baseOptions, results);
        },
        onProgress(current, total){
            updateProgress(current, total);
        }
    });
});

//Example server verification in JS
function verifyResults(baseOptions : BaseOptions, results : number[]){
    let current = baseOptions.target;
    if(results.length != baseOptions.repetitions){
        throw Error()
    }

    const buffer = new ArrayBuffer(8);
    const arr = new DataView(buffer);

    for(let repetition = 0; repetition < baseOptions.repetitions; repetition++){
        const hash = sha256.create();
        arr.setInt32(0, current, true);
        arr.setInt32(4, results[repetition], true);

        hash.update(buffer);
        //Languages with better manipulation of binary should probably use that, instead of translating between strings.
        const check = hexToBinary(hash.hex());
        for(let d = 0; d < baseOptions.difficulty; d++){
            if(check[d] != "0"){
                throw Error("Does not match");
            }
        }
        current = results[repetition];
    }
    console.log("Passed!");
}