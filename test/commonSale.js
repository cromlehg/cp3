
import ether from './helpers/ether'
import {advanceBlock} from './helpers/advanceToBlock'
import {increaseTimeTo, duration} from './helpers/increaseTime'
import latestTime from './helpers/latestTime'
import EVMThrow from './helpers/EVMThrow'

const BigNumber = web3.BigNumber

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()


const CommonSale = artifacts.require('CommonSale')
const Token = artifacts.require('XRRTestToken')

//web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

contract('CommonSale', function(wallets) {

  var owner = wallets[0]

  var notOwner = wallets[1]

  var newOwner = wallets[2]

  before(async function() {
   //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
   await advanceBlock()
  })


  beforeEach(async function () {
    this.token = await Token.new()
    this.crowdsale = await CommonSale.new(Token(this.token))
  })	 

  it('should be token owner', async function () {
    owner.should.equal(await this.token.owner())
  })	 

  it('should be crowdsale owner', async function () {
    owner.should.equal(await this.crowdsale.owner())
  })	 

  it('token should reject transfer ownership if not owner', async function () {
    await this.crowdsale.transferOwnership(newOwner, {from: notOwner}).should.be.rejectedWith(EVMThrow)
  })	 

  it('crowdsale should reject transfer ownership if not owner', async function () {
    await this.token.transferOwnership(newOwner, {from: notOwner}).should.be.rejectedWith(EVMThrow)
  })	 

})
