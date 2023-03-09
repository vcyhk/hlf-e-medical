const express = require('express')
const app = express()

const { Wallets, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

// CORS Origin
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json());

app.get('/medRecs', async (req, res) => {
  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get('admin');
    if (!identity) {
      res.json({status: false, error: {message: `An identity for the user "admin" does not exist in the wallet`}});
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'doctor_1', discovery: { enabled: true, asLocalhost: true } });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fabcar');
    const result = await contract.evaluateTransaction('queryAllRecords');
    res.json({status: true, medRecs: JSON.parse(result.toString())});
  } catch (err) {
    res.json({status: false, error: err});
  }
});

app.get('/medRecsKey:number', async (req, res) => {
  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get('admin');
    if (!identity) {
      res.json({status: false, error: {message: `An identity for the user "admin" does not exist in the wallet`}});
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'patient_1', discovery: { enabled: true, asLocalhost: true } });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fabcar');

    const result = await contract.evaluateTransaction('queryMedRec',req.params.number);
    res.json({status: true, medRec: JSON.parse(result.toString())});
  } catch (err) {
    res.json({status: false, error: err});
  }
});

app.post('/medRecs', async (req, res) => {
  try {
    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Set patient id
    const role = req.body.nRole
    const userName = req.body.name
    var userNum = 1;
    var check = true;
    var user_id = role + userNum;

    // Check to see if we've already enrolled the doctor.
    do{
        var userIdentity = await wallet.get(user_id);
        if (userIdentity) {
            ++userNum;
            var user_id = role + userNum;
            check = true;
        }else{
            var user_id = role + userNum;
            check = false;
        }
    }while(check == true)

    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        console.log('An identity for the admin user "admin" does not exist in the wallet');
        console.log('Run the enrollAdmin.js application before retrying');
        return;
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({
        affiliation: 'org1.department1',
        enrollmentID: user_id,
        role: 'client'
    }, adminUser);
    const enrollment = await ca.enroll({
        enrollmentID: user_id,
        enrollmentSecret: secret
    });
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
    };
    await wallet.put(user_id, x509Identity);

    if(role == 'patient_'){
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: user_id, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Generate the date
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var date = new Date().getDate();
        var hours = new Date().getHours();
        var min = new Date().getMinutes();
        var sec = new Date().getSeconds();
        const dt = (year + '/' + month + '/' + date + ' ' + hours + ':' + min + ':' + sec);
        const uNum = "MedID_" + userNum

        // Submit the specified transaction.
        await contract.submitTransaction("createMedRec", uNum, user_id, userName, dt, 'init');
        res.json({status: true, message: uNum})
        console.log('Transaction has been submitted');
    }else{
        console.log('Only Patient need to create a record')
    }
    
  } catch (err) {
    res.json({status: false, error: err});
  }
});

app.put('/permitDoc', async (req, res) => {

  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get('admin');
    if (!identity) {
      res.json({status: false, error: {message: `An identity for the user "admin" does not exist in the wallet`}});
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: req.body.patient, discovery: { enabled: true, asLocalhost: true } });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fabcar');
    
    await contract.submitTransaction('changePermit', req.body.medid, req.body.doctor);
    res.json({status: true, message: 'Transaction has been submitted.'})
  } catch (err) {
    res.json({status: false, error: err});
  }
});

app.put('/changeRecord', async (req, res) => {

    try {
      const walletPath = path.join(process.cwd(), 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      const identity = await wallet.get('admin');
      if (!identity) {
        res.json({status: false, error: {message: `An identity for the user "admin" does not exist in the wallet`}});
        return;
      }
      console.log(req.body.key + req.body.dt + req.body.info);
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: 'doctor_1', discovery: { enabled: true, asLocalhost: true } });
      const network = await gateway.getNetwork('mychannel');
      const contract = network.getContract('fabcar');
      
      await contract.submitTransaction('changeRecord', req.body.key, req.body.dt, req.body.info);
      res.json({status: true, message: 'Transaction has been submitted.'})
    } catch (err) {
      res.json({status: false, error: err});
    }
  });

app.listen(3001, () => {
  console.log('REST Server listening on port 3001');
});