// const crypto = require('crypto');
// const bitcoin = require('bitcoinjs-lib');
// const ecc = require('tiny-secp256k1');
// const {ECPairFactory, ECPairInterface} = require('ecpair');
// const axios = require('axios');

// const ECPair = ECPairFactory(ecc);
// const TESTNET = bitcoin.networks.testnet;

// // Preimage
// const preimage = 'Btrust Builders';
// const preImageHex = '427472757374204275696c64657273';

// function generate_redeem_Script(preimage) {
//     // Compute SHA256 hash
//     const hash = crypto.createHash('sha256').update(preimage).digest('hex');
//     console.log("hash", hash)
//     // Redeem script
//     const opSha256 = 'a8'; // OP_SHA256
//     const opEqual = '87'; // OP_EQUAL
//     const redeemScriptHex = opSha256 + hash + opEqual;
//     console.log(redeemScriptHex);

//     // Create the redeem script
//     const redeemScript = bitcoin.script.compile([
//     Buffer.from(opSha256, 'hex'),
//     Buffer.from(hash, 'hex'),
//     Buffer.from(opEqual, 'hex')
//     ]);

//     const p2sh = bitcoin.payments.p2sh({ redeem: { output: redeemScript, network: bitcoin.networks.testnet }, network: bitcoin.networks.testnet });
//     // let p2shAdd = bitcoin.payments.p2sh({ redeem: { output: redeemScriptBuffer, network: bitcoin.networks.testnet }, network: bitcoin.networks.testnet });
//     console.log(`P2SH Address: ${p2sh.address}`);
    
    
//     let privateKey = 'b1eee8a1a255de0b2a17e460069c987607b01f9d611d9d4041a978b1761711a9';
//     let publicKey = '0209ab8a2a63455be3249c38fe8e55b13377b6e65821f6f2a0f7c10e650c3c8a34';
//     let pub2 = Buffer.from(publicKey, 'hex');
//     let privateBuf = Buffer.from(privateKey, 'hex');
//     var keyPair = ECPair.fromPrivateKey(privateBuf, { network: TESTNET });
    
//     // Generate an address from the above wallet details.
//     // const keyPair = ECPair.makeRandom({ network: TESTNET });
//     let walletData = bitcoin.payments.p2pkh({pubkey: pub2, network: TESTNET,});
//     let Uaddress = walletData.address;
//     console.log(Uaddress);
    
//     // Build ttransaction to send tokens from our new address to the script address
//     const outputNumber = 1;
//     const txid = 'efb77db3048164e8197ef1793b6aa8481c9c853ffaa7c6deddcb8b027ac119c8';
//     const amount = 0.00010073;
    
//     const psbt = new bitcoin.Psbt({network: TESTNET});
//     const minerFee = 10000;
//     const destinationAddress = p2sh.address;
//     const outputAmount = amount*1e8 - minerFee;
//     const userBal = 0.00097204;
//     const expectedBalance = 0.00087130;
//     const fullRawTransactionHex = '02000000000101f1a1b97fdade729ca4c65bac71c470ea6291a433868b85637a10acbedc8f07eb0100000017160014bcaa1b697d0e87528471967096692059b28167b6fdffffff02095a47e9000000001976a91466f69a34f22c66012ee8fc8bc34cd9e943dd548a88acb47b0100000000001976a91486991edc4830f83a88b707d3f9077d60e8d19c9b88ac0247304402203c472d34fd17bcc0dff6cf18d57350bece9efec71675c6b171e3e376d96daa690220395f5e43e7e5a8494b5e345518e53f88e5ed14b630769814a1471ad5d26ba21a012103e91175c7c324cdbcb680bfdce878dac3c9ece96f4ee52c14e42ba1ad43f1dd128d522700'
    
//     psbt.addInput({hash: txid, index: outputNumber, nonWitnessUtxo: Buffer.from(fullRawTransactionHex, 'hex')});
//     console.log("check:", userBal*1e8 - outputAmount + 10000);
//     console.log("check output:", outputAmount);

//     psbt.addOutput({address: destinationAddress, value: outputAmount,});
//     psbt.addOutput({address: Uaddress, value:  expectedBalance*1e8});
//     psbt.signInput(0, keyPair);
//     console.log("Debug========================");
    
//     psbt.finalizeInput(0);
//     const rawTransaction = psbt.extractTransaction().toHex();

//     console.log('Transaction Hex:', rawTransaction);

//     broadcastTransaction(rawTransaction);
// }


// function spendFromScript(preImageHex) {
//     // const providedPreimageHash = crypto.createHash('sha256').update(preimage).digest('hex');

//     // Combine the preimage and hash to create the unlocking script
//     const unlockingScript = bitcoin.script.compile([
//         Buffer.from(preImageHex, 'hex') // Push the provided preimage onto the stack
//     ]);
//     console.log('Unlocking Script:', unlockingScript.toString('hex'));

//     // // Test redeem script
//     // const hash = crypto.createHash('sha256').update(preImageHex).digest('hex');
//     // const opSha256 = 'a8'; // OP_SHA256
//     // const opEqual = '87'; // OP_EQUAL
//     // const redeemScript = bitcoin.script.compile([
//     //     Buffer.from(opSha256, 'hex'),
//     //     Buffer.from(hash, 'hex'),
//     //     Buffer.from(opEqual, 'hex')
//     //     ]);
    
//     const outputNumber = 0;
//     const txid = '987e9909ec4966c27c8f8cc28bce8bd756073b1f8a184b05cd01e52173d8998e';
//     const amount = 0.00000073;
//     const psbt = new bitcoin.Psbt({network: TESTNET});
//     const minerFee = 10;
//     const destinationAddress = 'msneGm84ok5YykyDa9BKv7FfUxSV2wmrgM';
//     const outputAmount = amount*1e8 - minerFee;
//     const userBal = 0.00070073;
//     const fullRawTransactionHex = "0200000001c819c17a028bcbdddec6a7fa3f859c1c48a86a3b79f17e19e8648104b37db7ef010000006b483045022100f31f16d06394b0f719c0961ac6b81c65ccdfa490362ed05c4688ba420f62bf8f02202dccdb3b8c5f2309078dab7aaca3348ecefb572d6e8909e8499d68bd77feb4c901210209ab8a2a63455be3249c38fe8e55b13377b6e65821f6f2a0f7c10e650c3c8a34ffffffff02490000000000000017a91432fcf8bdd74a30a5e16345739e8116cae1770391875a540100000000001976a91486991edc4830f83a88b707d3f9077d60e8d19c9b88ac00000000";
    
//     // // Add the input from the previous transaction
//     // psbt.addInput({
//     //     hash: txid,
//     //     index: outputNumber,
//     //     sequence: null,
//     //     redeemScript: redeemScript,
//     //     nonWitnessUtxo: Buffer.from(fullRawTransactionHex, 'hex'),
//     //     unlockingScript: unlockingScript,
//     //     witnessUtxo: {
//     //         script: redeemScript,
//     //         value: amount*1e8 // Provide the value of the previous UTXO in satoshis
//     //     }
//     // });
    
//     // psbt.addOutput({
//     //     address: destinationAddress,
//     //     value: outputAmount
//     // });

    
//     let privateKey = 'b1eee8a1a255de0b2a17e460069c987607b01f9d611d9d4041a978b1761711a9';
//     let privateBuf = Buffer.from(privateKey, 'hex');
//     var keyPair = ECPair.fromPrivateKey(privateBuf, { network: TESTNET });
    
//     // psbt.signInput(0, keyPair);
//     // // console.log("Debug========================");

//     // psbt.finalizeInput(0);

//     // const rawTransaction = psbt.extractTransaction().toHex();

//     // console.log('Transaction Hex:', rawTransaction);






//     // Define the redeem script
// const redeemScript = Buffer.from(preImageHex, 'hex');


// // Create a new transaction builder
// const txb = new bitcoin.Psbt({network: TESTNET});;

// // Add the input
// txb.addInput({hash: txid, index: outputNumber, sequence: null, redeemScript: redeemScript});

// // Add the output
// txb.addOutput({address: destinationAddress, value: outputAmount});

// // Sign the transaction
// txb.signInput(0, keyPair, redeemScript);

// // Build the transaction
// const tx = txb.build();

// // Get the raw transaction hex
// const rawTxHex = tx.toHex();

// console.log(`Raw Transaction Hex: ${rawTxHex}`);





//     broadcastTransaction(rawTransaction);
// }


// async function broadcastTransaction(signedTransactionHex) {
//     const esploraUrl = 'https://blockstream.info/testnet/api/tx';

//     // Broadcast the transaction
//     axios.post(esploraUrl, signedTransactionHex)
//       .then(response => {
//         console.log('Transaction Broadcasted Successfully!');
//         console.log('Transaction ID:', response.data);
//       })
//       .catch(error => {
//         console.error('Error Broadcasting Transaction:', error);
//       });
// }

// // generate_redeem_Script(preImageHex);
// spendFromScript(preImageHex);