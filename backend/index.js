require('dotenv').config()
const express=require('express')
const cors=require('cors')
const { ethers } = require('ethers');
const db=require('./db')
const app=express()
const port=3000

app.use(express.json())
app.use(cors())

const monProvider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);
const ethProvider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const sepoliaProvider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
let currentEthPrice = 0;
let monSupply = 0;

//Create a signer (admin wallet) with your private key
const adminMonWallet = new ethers.Wallet(
  process.env.ADMIN_WALLET_PRIVATE_KEY,
  monProvider
); 

const fetchEthPrice = async () => {
  try{
    const res = await fetch(process.env.ETH_PRICE_FETCH_URL);
    const data = await res.json();
    if(data.ethereum.usd){
      currentEthPrice=data.ethereum.usd;
    }
    else{
      throw new Error("Failed to fetch ETH price");
    }
  }
  catch(err){
    console.error('Error fetching ETH price:', err);
  }
};

const fetchMonSupply = async () => {
  try {
    const monSupply = await monProvider.getBalance(adminMonWallet.address);
    const monSupplyFormatted = ethers.formatEther(monSupply);
    return { monSupply: parseInt(monSupplyFormatted) }
  } catch (err) {
    console.error(err);
    return { error: "Failed to fetch MON supply" }
  }
}

const updateMonSupply = async () => {
  const result = await fetchMonSupply();
  if(result.monSupply){
    monSupply = result.monSupply;
  }
}

setInterval(fetchEthPrice, 17000);
setInterval(updateMonSupply, 10000);
fetchEthPrice();
updateMonSupply();

app.get('/getEthPrice', async (req, res) => {
  if(currentEthPrice){
    res.status(200).json({ethPrice:currentEthPrice})
  }
  else{
    res.status(500).json({error:'Could not fetch ETH price'})
  }
});

app.post("/swap", async (req, res) => {
  let { txHash } = req.body;
  if (!txHash) return res.status(400).send("Missing txHash");

  try {
    //temp_data - currenlty putting sepoliaProvider for testing, change to ethProvider for production
    const tx = await ethProvider.getTransaction(txHash);
    if (!tx) return res.status(404).send("Transaction not found");

    if (tx.to.toLowerCase() !== process.env.ADMIN_WALLET_ADDRESS.toLowerCase()) {
      return res.status(400).send("Transaction not sent to bridge wallet");
    }

    const receipt = await tx.wait();
    if (receipt.status !== 1) return res.status(400).send("Transaction failed");

    const query=`
      SELECT * FROM transactions
      WHERE incoming_txn_hash=$1
      LIMIT 1
    `
    const result=await db.query(query, [txHash.toLowerCase()])
    if(result.rows.length>0){
      return res.status(400).send("Transaction already processed")
    }

    const query2=`
      INSERT INTO transactions (incoming_txn_hash, eth_price)
      VALUES ($1, $2)
    `
    const result2=await db.query(query2, [txHash.toLowerCase(), currentEthPrice])

    const ethAmount = ethers.formatEther(tx.value);
    const monAmount = (ethAmount * currentEthPrice * process.env.MON_EXCHANGE_RATE).toString();
    console.log('monAmount - ',monAmount);

    const monTx = await adminMonWallet.sendTransaction({
      to: tx.from,
      value: ethers.parseUnits(monAmount, 'ether'),
    });

    const query3=`
      UPDATE transactions
      SET outgoing_txn_hash=$1
      WHERE incoming_txn_hash=$2
    `
    const result3=db.query(query3, [monTx.hash.toLowerCase(), txHash.toLowerCase()])

    const monSentFormatted=Math.floor(monAmount * 100) / 100
    console.log(`Sent ${monSentFormatted} MON to ${monTx.to}: ${monTx.hash}`);

    res.status(200).json({
      status: "success",
      monadTxHash: monTx.hash,
      monAmount: monSentFormatted,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal error. Your transaction might be invalid.");
  }
});

app.get('/fetchLatestMonSupply', async (req, res) => {
  const result = await fetchMonSupply();
  if(result.monSupply){
    return res.status(200).json({monSupply:monSupply})
  }
  else{
    return res.status(500).json({error:'Could not fetch MON supply'})
  }
});

app.get('/fetchStoredMonSupply', async (req, res) => {
  if(monSupply || monSupply===0){
    return res.status(200).json({monSupply:monSupply})
  }
  else{
    return res.status(500).json({error:'Could not fetch MON supply'})
  }
});

app.get('/test11',async (req,res)=>{
  res.status(200).json('test11 - Server is running')
})

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`)
})
