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
        })

        window.addEventListener("offline", function online() {
            isOnline = false
            offlineIcon.textContent = 'offline'
        })
    }

    async function initServiceWorker() {

        swRegistration = await navigator.serviceWorker.register('/sw.js', {
            updateViaCache: "none"
        })

        // only one service worker active in time
        // when there is a second one installed, it goes to waiting phase. waiting for the first one to finish

        sw = swRegistration.installing || swRegistration.waiting || swRegistration.active

        // when a new service worker come in
        
        navigator.serviceWorker.addEventListener("controllerchange", function onController() {
            sw = navigator.serviceWorker.controller
            
        })
            
    }

})()
