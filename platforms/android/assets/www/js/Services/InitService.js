/*jslint browser: true*/
/*global console, Framework7, MyApp, $document*/

MyApp.angular.factory('InitService', 
		[
		 '$document', 
		 function (
				 $document) {
			 'use strict';

			 var pub = {},
			 eventListeners = {
					 'ready' : []
			 };

			 pub.addEventListener = function (eventName, listener) {
				 eventListeners[eventName].push(listener);
			 };

			 function onReady() {
				 var fw7 = MyApp.fw7;
				 fw7.views.push(fw7.app.addView('.view-main', fw7.options));
				 //Override default back button behavior
				 document.addEventListener('backbutton', onBackKeyDown, false);
				 function onBackKeyDown(e) {
					 e.preventDefault();
					 navigator.app.exitApp();
				 }

				 checkOnline().then(function(){
					 var browser = cordova.InAppBrowser.open(
							 'http://lamaisondeli.com',
							 '_self',
					 'location=no,zoom=no,hidden=yes,toolbar=no,clearcache=no,clearsessioncache=no');
					 browser.addEventListener("loadstop", function(){
						 browser.show();
						 fw7.app.hidePreloader();
					 });

					 browser.addEventListener("exit", function () {
						 browser.close();
						 navigator.app.exitApp();
					 });

				 }).fail(function(){
					 MyApp.fw7.views[0].router.loadPage('html/offline.html');
					 fw7.app.hidePreloader();
				 })
			 }

			 function checkOnline() {
				 var d = $.Deferred();
				 document
				 .addEventListener(
						 "deviceready",
						 function() {
							 var networkState = navigator.connection.type;
							 setTimeout(
									 function() {
										 networkState = navigator.connection.type;
										 var states = {};
										 states[Connection.UNKNOWN] = 'Unknown connection';
										 states[Connection.ETHERNET] = 'Ethernet connection';
										 states[Connection.WIFI] = 'WiFi connection';
										 states[Connection.CELL_2G] = 'Cell 2G connection';
										 states[Connection.CELL_3G] = 'Cell 3G connection';
										 states[Connection.CELL_4G] = 'Cell 4G connection';
										 states[Connection.CELL] = 'Cell generic connection';
										 states[Connection.NONE] = 'No network connection';
										 if ((states[networkState] == 'No network connection')
												 || (states[networkState] == 'Unknown connection')) {
											 d.reject();
										 } else {
											 d.resolve();
										 }
									 }, 1000);

						 }, false);

				 return d;
			 }

			 // Init
			 (function () {
				 $document.ready(function () {

					 if (document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1) {
						 // Cordova
						 console.log("Using Cordova/PhoneGap setting");
						 document.addEventListener("deviceready", onReady, false);
					 } else {
						 // Web browser
						 console.log("Using web browser setting");
						 onReady();
					 }

				 });
			 }());

			 return pub;

		 }]);