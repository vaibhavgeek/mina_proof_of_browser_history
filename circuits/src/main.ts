import { MatchMeBetter } from './matchbetter.js';
import {
  isReady,
  Mina,
  shutdown,
  PrivateKey,
  AccountUpdate,
  Field,
  Struct
} from 'snarkyjs';

class History extends Struct({
    history: [Field, Field],
  }) {}

class TopHistory extends Struct({
    top: [History, History,History,History,History,History,History,History,History,History]
  }){}

(async function main() {
  await isReady;

  console.log('SnarkyJS loaded');

  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  const deployerAccount = Local.testAccounts[0].privateKey;
  //console.log("deployer account", deployerAccount);
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();
  //console.log("zk App Address", zkAppAddress);
  const contract = new MatchMeBetter(zkAppAddress);
  let history = new History({history: [new Field(1000000), new Field(20)]});
  let topHistory = new TopHistory({top: [history,history]});
  let domain = new Field(1000000);
  let counter = new Field(2);
  console.log("Contract", contract);
  const deployTxn = await Mina.transaction(deployerAccount, () => {
         AccountUpdate.fundNewAccount(deployerAccount);
         contract.deploy({ zkappKey: zkAppPrivateKey });
         contract.initState(counter,domain);
         contract.sign(zkAppPrivateKey);
       });
   console.log("deply transaction", deployTxn);
   await deployTxn.send();

   const txn1 = await Mina.transaction(deployerAccount, () => {
         contract.setTopHistory(topHistory);
         contract.sign(zkAppPrivateKey);
       });
    await txn1.send();
  
    const txn2 = await Mina.transaction(deployerAccount, () => {
      contract.checkCredit();
      contract.sign(zkAppPrivateKey);
    });
  await txn2.send();
  
   // get inital history state
  console.log('Shutting down')
  await shutdown();
})();
