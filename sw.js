"use strict";

const version = 1
self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivated);

main().catch(console.error)

async function main() {
    console.log(`Service worker (${version}) is starting ...`)
}

async function onInstall(evt) {
    console.log(`Service worker (${version}) is installing ...`)
    self.skipWaiting()
}

function onActivated(evt) {
    evt.waitUntil(handleActivation())
}

async function handleActivation() {
    await clients.claim()
    console.log(`Service worker (${version}) is activating ...`)

}