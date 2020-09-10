/*
    TyronZIL-js: Decentralized identity client for the Zilliqa blockchain platform
    Copyright (C) 2020 Julio Cesar Cabrapan Duarte

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
*/

import * as fs from 'fs';
import LogColors from './log-colors';
import * as readline from 'readline-sync';
import { NetworkNamespace } from '../lib/decentralized-identity/tyronZIL-schemes/did-scheme';
import { PublicKeyPurpose } from '../lib/decentralized-identity/sidetree-protocol/models/verification-method-models';
import ServiceEndpointModel from '@decentralized-identity/sidetree/dist/lib/core/versions/latest/models/ServiceEndpointModel';
import SidetreeError from '@decentralized-identity/sidetree/dist/lib/common/SidetreeError';

export default class Util {

    /** Generates the keys' input */
    public static async InputKeys(): Promise<PublicKeyInput[]> {
        console.log(LogColors.brightGreen(`Cryptographic keys for your Decentralized Identifier: `))
        const amount = readline.question(LogColors.green(`How many keys would you like to add? - `) + LogColors.lightBlue(`Your answer: `));
        if(!Number(amount)){
            throw new SidetreeError("WrongAmount", "It must be a number > 0");
        }
        const KEYS = [];
        for(let i=0, t= Number(amount); i<t; ++i) {
            const id = readline.question(LogColors.green(`Next, write down your key ID - `) + LogColors.lightBlue(`Your answer: `));
            if (id === "") {
                throw new SidetreeError("InvalidID", `To register a key you must provide its ID`);
            }
            const purpose = readline.question(LogColors.green(`What is the key purpose: general(1), authentication(2) or both(3)?`) + ` [1/2/3] - Defaults to both - ` + LogColors.lightBlue(`Your answer: `));
            let PURPOSE;
            switch (Number(purpose)) {
                case 1:
                    PURPOSE = [PublicKeyPurpose.General];
                    break;
                case 2:
                    PURPOSE = [PublicKeyPurpose.Auth];
                    break;
                default:
                    PURPOSE = [PublicKeyPurpose.General, PublicKeyPurpose.Auth];
                    break;
            }
            const KEY: PublicKeyInput = {
                id: id,
                purpose: PURPOSE
            }
            KEYS.push(KEY);
        }
        return KEYS;
    }

    /***            ****            ***/

    /** Generates the services' input */
    public static async InputService(): Promise<ServiceEndpointModel[]> {
        console.log(LogColors.brightGreen(`Service endpoints for your Decentralized Identifier:`));
        const SERVICE = [];
        const amount = readline.question(LogColors.green(`How many service endpoints would you like to add? - `) + LogColors.lightBlue(`Your answer: `));
        if(!Number(amount) && Number(amount) !== 0){
            throw new SidetreeError("WrongAmount", "It must be a number");
        }
        for(let i=0, t= Number(amount); i<t; ++i) {
            const id = readline.question(LogColors.green(`Write down your service ID - `) + LogColors.lightBlue(`Your answer: `));
            const type = readline.question(LogColors.green(`Write down your service type - `) + ` - Defaults to 'website' - ` + LogColors.lightBlue(`Your answer: `));
            const endpoint = readline.question(LogColors.green(`Write down your service URL - `) + ` - [yourwebsite.com] - ` + LogColors.lightBlue(`Your answer: `));
            if (id === "" || endpoint === "") {
                throw new SidetreeError("Invalid parameter", "To register a service-endpoint you must provide its ID, type and URL");
            }
            let TYPE;
            if(type !== "") {
                TYPE = type;
            } else {
                TYPE = "website"
            }
            const SERVICE_ENDPOINT: ServiceEndpointModel = {
                id: id,
                type: TYPE,
                endpoint: "https://" + endpoint
            }
            SERVICE.push(SERVICE_ENDPOINT);
        }
        return SERVICE;
    }

    /** Saves the private keys */
    public static async savePrivateKeys(did: string, keys: PrivateKeys): Promise<void> {
        const KEY_FILE_NAME = `DID_PRIVATE_KEYS_${did}.json`;
        fs.writeFileSync(KEY_FILE_NAME, JSON.stringify(keys, null, 2));
        console.info(LogColors.yellow(`Private keys saved as: ${LogColors.brightYellow(KEY_FILE_NAME)}`));
    }
}

export interface CliInputModel {
    network: NetworkNamespace;
    publicKeyInput: PublicKeyInput[];
    service: ServiceEndpointModel[];
}
  
export interface PublicKeyInput {
    id: string;
    purpose: PublicKeyPurpose[];
}

export interface PrivateKeys {
    privateKeys?: string[],        //encoded strings
    updatePrivateKey?: string,
    recoveryPrivateKey?: string,
}