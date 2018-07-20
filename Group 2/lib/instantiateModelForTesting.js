/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Initialize some test assets and participants useful for running a demo.
 * @param {org.acme.shipping.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
function instantiateModelForTesting(setupDemo) {
    
        var factory = getFactory();
        var NS = 'org.acme.shipping';
    
        // create the Sellers
        var Sellers = factory.newResource(NS, 'Sellers', 'farmer@email.com');
        Sellers.address = "USA";
        Sellers.accountBalance = 0;
    
        // create the Buyers
        var Buyers = factory.newResource(NS, 'Buyers', 'supermarket@email.com');
        Buyers.address = "UK";
        Buyers.accountBalance = 0;
    
        // create the shipper
        var shipper = factory.newResource(NS, 'Shipper', 'shipper@email.com');
        shipper.address = "Panama";
        shipper.accountBalance = 0;
    
        // create the Temperature sensor
        var temperatureSensor = factory.newResource(NS, 'TemperatureSensor', 'SENSOR_TEMP001');
        
        // create the GPS sensor
        var gpsSensor = factory.newResource(NS, 'GpsSensor', 'SENSOR_GPS001');
        
        // create the contract
        var contract = factory.newResource(NS, 'Contract', 'CON_001');
        contract.Sellers = factory.newRelationship(NS, 'Sellers', 'farmer@email.com');
        contract.Buyers = factory.newRelationship(NS, 'Buyers', 'supermarket@email.com');
        contract.shipper = factory.newRelationship(NS, 'Shipper', 'shipper@email.com');
        var tomorrow = setupDemo.timestamp;
        tomorrow.setDate(tomorrow.getDate() + 1);
        contract.arrivalDateTime = tomorrow; // the shipment has to arrive tomorrow
        contract.unitPrice = 0.5; // pay 50 cents per unit
        contract.minTemperature = 2; // min temperature for the cargo
        contract.maxTemperature = 10; // max temperature for the cargo
        contract.minPenaltyFactor = 0.2; // we reduce the price by 20 cents for every degree below the min temp
        contract.maxPenaltyFactor = 0.1; // we reduce the price by 10 cents for every degree above the max temp
    
        // create the shipment
        var shipment = factory.newResource(NS, 'Shipment', 'SHIP_001');
        shipment.type = 'LAPTOPS';
        shipment.status = 'IN_TRANSIT';
        shipment.unitCount = 5000;
        shipment.contract = factory.newRelationship(NS, 'Contract', 'CON_001');
        return getParticipantRegistry(NS + '.Sellers')
            .then(function (SellersRegistry) {
                // add the Sellers
                return SellersRegistry.addAll([Sellers]);
            })
            .then(function() {
                return getParticipantRegistry(NS + '.Buyers');
            })
            .then(function(BuyersRegistry) {
                // add the Buyerss
                return BuyersRegistry.addAll([Buyers]);
            })
            .then(function() {
                return getParticipantRegistry(NS + '.Shipper');
            })
            .then(function(shipperRegistry) {
                // add the shippers
                return shipperRegistry.addAll([shipper]);
            })
            .then(function() {
                return getParticipantRegistry(NS + '.TemperatureSensor');
            })
            .then(function(temperatureSensorRegistry) {
                // add the temperature sensors
                return temperatureSensorRegistry.addAll([temperatureSensor]);
            })
            .then(function() {
                return getParticipantRegistry(NS + '.GpsSensor');
            })
            .then(function(gpsSensorRegistry) {
                // add the GPS sensors
                return gpsSensorRegistry.addAll([gpsSensor]);
            })
            .then(function() {
                return getAssetRegistry(NS + '.Contract');
            })
            .then(function(contractRegistry) {
                // add the contracts
                return contractRegistry.addAll([contract]);
            })
            .then(function() {
                return getAssetRegistry(NS + '.Shipment');
            })
            .then(function(shipmentRegistry) {
                // add the shipments
                return shipmentRegistry.addAll([shipment]);
            });
    }
