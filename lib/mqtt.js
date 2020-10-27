'user strict'

const mqtt = require('mqtt');
const log = require('./log');

const doorId = process.env.GARAGE_DOORID;
const topicBase = "home/garage/";
const url = process.env.MQTT_URL;
const opts = { username: process.env.MQTT_USERNAME, password: process.env.MQTT_PASSWORD };

// Create a client connection
var client = mqtt.connect(url, opts);

var data = { state: "unknown" };

var callback = null;

client.on('connect', function() { // When connected
    log.info('MQTT: Successfully connected');
    // subscribe to topic
    client.subscribe(topicBase+doorId, {qos:1});
});

client.on('close', function() {
   log.warn('MQTT: Connection closed');
});

// when a message arrives, do something with it
client.on('message', function(topic, message, packet) {

    log.info("MQTT message: " + topic + " " + message);

    data.state = message.toString();

    if( callback !== null ) {
        callback(data);
    }

});

module.exports = {
    operate: function() {
        client.publish(topicBase+'operate', doorId);
    },
    setCallback: function(c) {
        callback = c;
    },
    getData: ()=>{
        return data;
    }
};
