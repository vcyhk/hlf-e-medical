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

3. Copy and clone the original fabcar chaincode and the script to new files  
`fabcar.js`  
`run.sh`  

4. Bring up the test network and enroll the admin  
```
/fabric-samples
cd fabcar
./run.sh
```

For detailed information about setting up the hyperledger fabric network see [Hyperledger Fabric Docs](https://hyperledger-fabric.readthedocs.io/en/latest/)

## API Server

This API Server used to interact with chaincode

1. Copy the `app.js` into `hlf-e-medical/fabric-samples/fabcar/javascript/`
2. Running the code to start the server
```
/fabric-samples
cd fabcar/javascript
node app.js
```

## E-medical system
1. Move the e-medical folder into `fabric-samples` 

2. Run Go program to connect the MongoDB (Used to store basic login data of the users)
```
/fabric-samples
cd e-medical
go run main.go
```

3. Run the following command to install the packages and start the webapp.
```
/fabric-samples/e-medical
cd webapp
npm install
npm start
```

## Benchmarking (Hyperledger Caliper)
For benchmarking, we use Caliper API to simulate the workload and function of hlf-e-medical system  
...

