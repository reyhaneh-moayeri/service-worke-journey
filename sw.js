"use strict";

const version = 2

let isOnline = true
let isLoggedIn = false

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivated);
self.addEventListener("message", onMessage);

main().catch(console.error)

async function main() {
    console.log(`Service worker (${version}) is starting ...`)
    await sendMessage({requestStatusUpdate : true})
}


async function sendMessage(msg) {
    var allClients = await clients.matchAll({ includeUncontrolled: true })
    return Promise.all(
        allClients.map(function clientMsg(client) {
            let channel = new MessageChannel()
            channel.port1.onmessage = onMessage
            return client.postMessage(msg , [channel.port2])
        })
    )

}

function onMessage({ data }) {
	if ("statusUpdate" in data) {
		({ isOnline, isLoggedIn } = data.statusUpdate);
		console.log(`Service Worker (v${version}) status update... isOnline:${isOnline}, isLoggedIn:${isLoggedIn}`);
	}
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

//service workers don't have access to the local storage. they do have index db and can store stuff in index db