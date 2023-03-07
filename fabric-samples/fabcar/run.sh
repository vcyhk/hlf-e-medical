#!/bin/bash

echo -e "Launching the network"
./startFabric.sh javascript
cd javascript
node enrollAdmin.js
exit 0