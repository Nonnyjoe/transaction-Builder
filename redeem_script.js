const crypto = require('crypto');
const bitcoin = require('bitcoinjs-lib');
const ecc = require('tiny-secp256k1');
const {ECPairFactory, ECPairInterface} = require('ecpair');
const axios = require('axios');

const ECPair = ECPairFactory(ecc);
const TESTNET = bitcoin.networks.testnet;

// Preimage
const preimage = 'Btrust Builders';
const preImageHex = '427472757374204275696c64657273';

function generate_redeem_Script(preimage) {
    // Compute SHA256 hash
    const hash = crypto.createHash('sha256').update(preimage).digest('hex');
    console.log("hash", hash)
    // Redeem script
    const opSha256 = 'a8'; // OP_SHA256
    const opEqual = '87'; // OP_EQUAL
    const redeemScriptHex = opSha256 + hash + opEqual;
    console.log(redeemScriptHex);

    // Create the redeem script
    const redeemScript = bitcoin.script.compile([
    Buffer.from(opSha256, 'hex'),
    Buffer.from(hash, 'hex'),
    Buffer.from(opEqual, 'hex')
    ]);

    const p2sh = bitcoin.payments.p2sh({ redeem: { output: redeemScript, network: bitcoin.networks.testnet }, network: bitcoin.networks.testnet });
    // let p2shAdd = bitcoin.payments.p2sh({ redeem: { output: redeemScriptBuffer, network: bitcoin.networks.testnet }, network: bitcoin.networks.testnet });
    console.log(`P2SH Address: ${p2sh.address}`);


    let privateKey = 'f3aa7c12a261510e20aea92c22842cc4daee282c1db40303486256f477bfc9de';
    let publicKey = '02705c3aebbad8802720507e9fdff82d75827239021af780097c226e2e1130b3de';
    let pub2 = Buffer.from(publicKey, 'hex')
    let privateBuf = Buffer.from(privateKey, 'hex');
    var keyPair = ECPair.fromPrivateKey(privateBuf, { network: TESTNET });

    // Generate an address from the above wallet details.
    // const keyPair = ECPair.makeRandom({ network: TESTNET });
    let walletData = bitcoin.payments.p2pkh({pubkey: pub2, network: TESTNET,});
    let Uaddress = walletData.address;
    console.log(Uaddress);

    // Build ttransaction to send tokens from our new address to the script address
    const outputNumber = 0;
    const txid = '067165e054372055f7259e86c56e1043052b17719618b8c8bb20e205435f1cc5';
    const amount = 0.00010073;

    const psbt = new bitcoin.Psbt({network: TESTNET});
    const minerFee = 10000;
    const destinationAddress = p2sh.address;
    const outputAmount = amount*1e8 - minerFee;
    const userBal = 0.00070073 ;
    const fullRawTransactionHex = '020000000001014628046f93d2fb28981af174c69c2e8c2eb25bda4f1611edb39841e57a5c1f120000000000fdffffff02b9110100000000001976a914988e8d724c47e8366efdce50a00ca372279fe41988ac71692a2e000000001976a91443ddd8c2b9d65057e8cb0f4a631c55a75cad6c0288ac02473044022043abaf3cb2281956a1cf0e1118b42f70641a28de1dfef0cf62e85e6fe26623c802203f907ff734403798da5e8e623b69fa3472dcb74354f3cefc8e7c6877cc4b6f05012103fb3f6f95e330f5743a95254454bd5a22bd7ecfedd3bc1cf87cc1b78506684beb6a522700'

    psbt.addInput({hash: txid, index: outputNumber, nonWitnessUtxo: Buffer.from(fullRawTransactionHex, 'hex')});
    psbt.addOutput({address: destinationAddress, value: outputAmount});
    psbt.addOutput({address: Uaddress, value:  userBal*1e8 - outputAmount});
    psbt.signInput(outputNumber, keyPair);
    psbt.finalizeInput(0);
    const rawTransaction = psbt.extractTransaction().toHex();

    console.log('Transaction Hex:', rawTransaction);

    broadcastTransaction(rawTransaction);
}


function spendFromScript(preImageHex) {
    const providedPreimageHash = crypto.createHash('sha256').update(preimage).digest('hex');

    // Combine the preimage and hash to create the unlocking script
    const unlockingScript = bitcoin.script.compile([
        Buffer.from(preImageHex, 'hex') // Push the provided preimage onto the stack
    ]);
    
    console.log('Unlocking Script:', unlockingScript.toString('hex'));
    
    const outputNumber = 0;
    const txid = '067165e054372055f7259e86c56e1043052b17719618b8c8bb20e205435f1cc5';
    const amount = 0.00010073;
    const psbt = new bitcoin.Psbt({network: TESTNET});
    const minerFee = 10000;
    const destinationAddress = 'muRbmwCkWAsXSjs78idn6CYxsdKGgcAq2X';
    const outputAmount = amount*1e8 - minerFee;
    const userBal = 0.00070073 ;
    
    // Add the input from the previous transaction
    psbt.addInput({
        hash: txid,
        index: outputNumber,
        witnessUtxo: {
            script: Buffer.from(providedPreimageHash, 'hex'),
            value: amount // Provide the value of the previous UTXO in satoshis
        }
    });
    
    psbt.addOutput({
        address: destinationAddress,
        value: outputAmount
    });
    
    let privateKey = 'f3aa7c12a261510e20aea92c22842cc4daee282c1db40303486256f477bfc9de';
    let privateBuf = Buffer.from(privateKey, 'hex');
    var keyPair = ECPair.fromPrivateKey(privateBuf, { network: TESTNET });
    
    console.log("Debug========================");
    psbt.signInput(0, keyPair);

    psbt.finalizeInput(0);

    const rawTransaction = psbt.extractTransaction().toHex();

    console.log('Transaction Hex:', rawTransaction);

    broadcastTransaction(rawTransaction);
}


async function broadcastTransaction(signedTransactionHex) {
    const esploraUrl = 'https://blockstream.info/testnet/api/tx';

    // Broadcast the transaction
    axios.post(esploraUrl, signedTransactionHex)
      .then(response => {
        console.log('Transaction Broadcasted Successfully!');
        console.log('Transaction ID:', response.data);
      })
      .catch(error => {
        console.error('Error Broadcasting Transaction:', error);
      });
}

// generate_redeem_Script(preImageHex);
spendFromScript(preImageHex);