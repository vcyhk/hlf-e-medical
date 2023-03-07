/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) { //Initializd Ledger
        console.info('============= START : Initialize Ledger ===========');
        const medRecs = [
            {
                patientID: 'patient_0',
                patientName: 'Chan Tai Man',
                docPermit: ["00000"],
                nurPermit: ["00000"],
                record: [
                    {dateTime: '2023/01/01 00:00:00', info: 'init'},
                ],
            }
        ];

        for (let i = 0; i < medRecs.length; i++) {
            medRecs[i].docType = 'medRec';
            await ctx.stub.putState('MedID_' + i, Buffer.from(JSON.stringify(medRecs[i])));
            console.info('Added <--> ', medRecs[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async createMedRec(ctx, key, patientID, patientName, dt, rec) { //Create a record
        console.info('============= START : Create medRec ===========');

        const medRec = {
            patientID,
            patientName,
            docPermit:["00000"],
            nurPermit: ["00000"],
            record:[{dateTime: dt, info: rec}],
        };

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(medRec)));
        console.info('============= END : Create medRec ===========');
    }

    async queryMedRec(ctx, key) { //Query a record
        const medAsBytes = await ctx.stub.getState(key); // get the medRec from chaincode state
        if (!medAsBytes || medAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }
        console.log(medAsBytes.toString());
        return medAsBytes.toString();
    }

    async queryAllRecords(ctx) { //Query all record
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changePermit(ctx, key, newPermit) { //Change the doctor permit
        const medAsBytes = await ctx.stub.getState(key); 
        if (!medAsBytes || medAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }
        const temp = JSON.parse(medAsBytes.toString());
        const add = newPermit
        await (temp.docPermit).push(add)

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(temp)));
    }

    async changeNurPermit(ctx, key, newPermit) { //Change the doctor permit
        const medAsBytes = await ctx.stub.getState(key); 
        if (!medAsBytes || medAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }
        const temp = JSON.parse(medAsBytes.toString());
        const add = newPermit
        await (temp.nurPermit).push(add)

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(temp)));
    }

    async changeRecord(ctx, key, newDate, newInfo) { //Change the medical record
        const medAsBytes = await ctx.stub.getState(key); 
        if (!medAsBytes || medAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }
        const temp = JSON.parse(medAsBytes.toString());
        const add = {dateTime: newDate, info: newInfo}
        await (temp.record).push(add)

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(temp)));
    }



}

module.exports = FabCar;
