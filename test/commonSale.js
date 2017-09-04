
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
    this.crowdsale = await CommonSale.new()
    await this.crowdsale.setToken(this.token.address)
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

  it('finish minting should reject if not owner', async function () {
    await this.token.finishMinting({from: notOwner}).should.be.rejectedWith(EVMThrow)
  })	 

  it('owner should changed', async function () {
    await this.token.transferOwnership(newOwner, {from: owner})
    newOwner.should.equal(await this.token.owner())
    await this.token.transferOwnership(owner, {from: newOwner})
    owner.should.equal(await this.token.owner())
  })	 


  const m0Period = new BigNumber(1)
  const m1Period = new BigNumber(2)
  const m2Period = new BigNumber(3)
  const m3Period = new BigNumber(4)
  const m0Bonus = new BigNumber(10)
  const m1Bonus = new BigNumber(20)
  const m2Bonus = new BigNumber(30)
  const m3Bonus = new BigNumber(40)

  it('common sale should add/insert/remove/clear/change milestone', async function () {
    await this.crowdsale.addMilestone(m0Period, m0Bonus, {from: owner})
    const m0 = await this.crowdsale.milestones(0)
    m0[0].should.be.bignumber.equal(m0Period)
    m0[1].should.be.bignumber.equal(m0Bonus)
    const count0 = await this.crowdsale.milestonesCount()
    count0.should.be.bignumber.equal(1)
    m0Period.should.be.bignumber.equal(await this.crowdsale.totalPeriod())
    await this.crowdsale.addMilestone(m1Period, m1Bonus, {from: owner})
    const m1 = await this.crowdsale.milestones(1)
    m1[0].should.be.bignumber.equal(m1Period)
    m1[1].should.be.bignumber.equal(m1Bonus)
    const count1 = await this.crowdsale.milestonesCount()
    count1.should.be.bignumber.equal(2)
    m0Period.add(m1Period).should.be.bignumber.equal(await this.crowdsale.totalPeriod())
    await this.crowdsale.addMilestone(m3Period, m3Bonus, {from: owner})
    const m3 = await this.crowdsale.milestones(2)
    m3[0].should.be.bignumber.equal(m3Period)
    m3[1].should.be.bignumber.equal(m3Bonus)
    const count2 = await this.crowdsale.milestonesCount()
    count2.should.be.bignumber.equal(3)
    m0Period.add(m1Period).add(m3Period).should.be.bignumber.equal(await this.crowdsale.totalPeriod())
    await this.crowdsale.insertMilestone(m1Period, m2Period, m2Bonus, {from: owner})
    const m2 = await this.crowdsale.milestones(3)
    m2[0].should.be.bignumber.equal(m2Period)
    m2[1].should.be.bignumber.equal(m2Bonus)
    const count3 = await this.crowdsale.milestonesCount()
    count3.should.be.bignumber.equal(4)
    m0Period.add(m1Period).add(m2Period).add(m3Period).should.be.bignumber.equal(await this.crowdsale.totalPeriod())
    // TODO: change it
    // TODO: remove it
    // clear all
  })	 
 
})
