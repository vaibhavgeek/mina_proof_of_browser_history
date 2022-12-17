import {
  Field,
  SmartContract,
  DeployArgs,
  Permissions,
  state, 
  State,
  method, 
  Circuit,
  Bool,
  Struct,
  isReady
} from 'snarkyjs';

await isReady;


class History extends Struct({
  history: [Field, Field],
}) {}

class TopHistory extends Struct({
  top: [History, History]
}){}

export class MatchMeBetter extends SmartContract {
  @state(Field) counter = State<Field>();
  @state(Field) domain = State<Field>();    
  @state(TopHistory) history = State<TopHistory>();
 
  
  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }
  @method initState(counter: Field, domain: Field) {
          this.counter.set(counter);
          this.domain.set(domain);
      }
  @method setTopHistory(his: TopHistory){
    this.history.set(his);
  }
  @method checkCredit() {
      this.counter.assertEquals(this.counter.get());
      this.history.assertEquals(this.history.get());
      this.domain.assertEquals(this.domain.get());
      let domain = this.domain.get();
      let topBrowsingHistory = this.history.get();
      let x = Bool(false);
       for (let i = 0; i < 2; i++) {
           const domainRotate = topBrowsingHistory.top[i].history[0];
           x = Circuit.if(domainRotate.equals(domain) , topBrowsingHistory.top[i].history[1].gte(this.counter.get())  , Bool(false));  
       }
      x.assertEquals(Bool(true));
    }
}