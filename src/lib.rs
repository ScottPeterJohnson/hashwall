use wasm_bindgen::prelude::*;
use sha2::{Sha256, Digest};


// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    Ok(())
}

#[wasm_bindgen]
pub fn hash(target : u32, difficulty : u32) -> Result<u32, JsValue> {
    let mut counter : u32 = 0;

    loop {
        let mut hasher = Sha256::default();
        hasher.input(&target.to_le_bytes());
        hasher.input(&counter.to_le_bytes());
        let hash = hasher.result();

        if verify(&hash, difficulty){
            return Ok(counter);
        }

        counter += 1;
    }
}

fn verify(hash : &[u8], difficulty : u32) -> bool {
    for d in 0..(difficulty/8) {
        let byte = hash[d as usize];
        if byte != 0 {
            return false;
        }
    }
    if difficulty % 8 != 0 {
        let last = hash[((difficulty)/8) as usize];
        if last.leading_zeros() < (difficulty % 8) as u32 {
            return false
        }
    }

    return true;
}