# HyperledgerFabric E-Medical System

This repository contains some files from fabric-samples(fabcar) and hyperledger caliper. For more information, please see [hyperledger/fabric-samples](https://github.com/hyperledger/fabric-samples) and [hyperledger caliper](https://hyperledger.github.io/caliper/v0.4.2/getting-started/).

hlf-e-medical is a migration from an ethereum blockchain based e-medical system. It contains the main function of the original system.

## Prerequisite
Make sure you have the following environment setup:
* Ubuntu on VirtualBox
* Docker and Docker-Compose
* Golang
* node
* npm

## Blockchain Network (Hyperledger Fabric)
1. Clone fabric-samples
```
git clone https://github.com/hyperledger/fabric-samples
```

2. Clone the hlf-e-medical 
```
git clone https://github.com/vcyhk/hlf-e-medical.git
```

3. Copy and clone the original fabcar chaincode and the script to new files.  
`fabcar.js`  
`run.sh`  

4. Bring up the test network
```
cd fabric-samples/fabcar
./startFabric.sh javascript
```

For detailed information about setting up the hyperledger fabric network see [Hyperledger Fabric Docs](https://hyperledger-fabric.readthedocs.io/en/latest/)

## API Server

This API Serve used to interact with chaincode

1. Copy the `app.js` to

## E-medical system
1. enrollAdmin

   You need to enroll a admin before running the following function 

2. registerPatient

   This function used to create an idendity and initialize the record to the patient
   
3. registerDoctor

   This function used to create an idendity to the doctor
   
4. registerNurse

   This function used to create an idendity to the nurse
   
5. permitDoc

   Paitent can use this function to authorize the doctor to check or update their medical record
   
6. permitNur

   Paitent can use this function to authorize the nurese to check their medical record
   
7. query

   This function used to check the patient medical record
   
8. update

   Doctor can use this function to update patient's medical record
   
## Benchmarking (Hyperledger Caliper)
...
