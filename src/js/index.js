"use strict";

(function Blog() {
    let offlineIcon;
    let isOnline = ("onLine" in navigator) ? navigator.onLine : true;
    let isLoggedIn = false;
    let sw;
    let swRegistration;
    let usingSW = ("seviceWorker" in navigator)

    if (usingSW) {
       initServiceWorker().catch(console.error);
    }

    document.addEventListener("DOMContentLoaded", ready, false)

    function ready() {
        offlineIcon = document.getElementById("Connectivity-status")
        offlineIcon.textContent = isOnline ? "online" : "offline"


        window.addEventListener("online", function online() {
            isOnline = true
            offlineIcon.textContent = 'online'
                sendStatusUpdate()
        })

        window.addEventListener("offline", function online() {
            isOnline = false
            offlineIcon.textContent = 'offline'
                sendStatusUpdate()
        })
    }

    async function initServiceWorker() {

        swRegistration = await navigator.serviceWorker.register('/sw.js', {
            updateViaCache: "none"
        })

        // only one service worker active in time
        // when there is a second one installed, it goes to waiting phase. waiting for the first one to finish

        sw = swRegistration.installing || swRegistration.waiting || swRegistration.active
        sendStatusUpdate(sw)

        // when a new service worker come in
        
        navigator.serviceWorker.addEventListener("controllerchange", function onController() {
            sw = navigator.serviceWorker.controller
            sendStatusUpdate(sw)
            
        })

        navigator.serviceWorker.addEventListener("message", onSWMessage)
            
    }

    function onSWMessage(evt) {
        let { data } = evt
        console.log(data)
        if (data.requestStatusUpdate) {
            console.log("received status update from serviceworker")
            // who do we wanna send status update? there will be multiple cases that we wanna communicate with
            // like the service worker will communicate with multiple pages so it end up using something called
            // message channel to make this connections. so it ends up creating some unique set of ports that
            //those communication may happen
            sendStatusUpdate(evt.ports && evt.ports[0])     
        }
        
    }

    function sendStatusUpdate(target) {
        sendswMessage({ statusUpdate: { isOnline, isLoggedIn } }, target );
    }

    async function sendswMessage(msg , target) {
        if (target) {
            target.postMessage(msg)
        } else if (sw) {
            sw.postMessage(msg)
        } else {
            navigator.serviceWorker.controller.postMessage(msg)
        }
    }

})()