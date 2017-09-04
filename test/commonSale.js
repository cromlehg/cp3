
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

  var multisigWallet = wallets[3]

  var foundersTokensWallet = wallets[4]

  var bountyTokensWallet = wallets[5]

  var bountyTokensCount = 110

  var foundersTokensPercent = 25

  const price = new BigNumber(1000000000000)

  const value = ether(42)

  const m0Period = new BigNumber(1)
  const m1Period = new BigNumber(2)
  const m2Period = new BigNumber(3)
  const m3Period = new BigNumber(4)
  const m0Bonus = new BigNumber(10)
  const m1Bonus = new BigNumber(20)
  const m2Bonus = new BigNumber(30)
  const m3Bonus = new BigNumber(40)

  const start = new BigNumber(1613205200)
  const hardcap = new BigNumber(9000000000000000000);



  before(async function() {
   //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
   await advanceBlock()
  })


  beforeEach(async function () {
    this.token = await Token.new()
    this.crowdsale = await CommonSale.new()
    await this.crowdsale.setToken(this.token.address)
    await this.token.setSaleAgent(this.crowdsale.address)
  })	 


  describe('owner tests', function () {

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

    it('set hardcap should reject if not owner', async function () {
      await this.crowdsale.setHardcap(hardcap, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('set start should reject if not owner', async function () {
      await this.crowdsale.setHardcap(start, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('set price should reject if not owner', async function () {
      await this.crowdsale.setPrice(price, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('set multisigWallet should reject if not owner', async function () {
      await this.crowdsale.setMultisigWallet(multisigWallet, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('set founders tokens percent should reject if not owner', async function () {
      await this.crowdsale.setMultisigWallet(foundersTokensPercent, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('set bounty tokens count should reject if not owner', async function () {
      await this.crowdsale.setBountyTokensCount(bountyTokensCount, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('set bounty tokens wallet should reject if not owner', async function () {
      await this.crowdsale.setBountyTokensWallet(bountyTokensWallet, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('set founders tokens wallet should reject if not owner', async function () {
      await this.crowdsale.setFoundersTokensWallet(foundersTokensWallet, {from: notOwner}).should.be.rejectedWith(EVMThrow)
    })	 

    it('owner should changed', async function () {
      await this.token.transferOwnership(newOwner, {from: owner})
      newOwner.should.equal(await this.token.owner())
      await this.token.transferOwnership(owner, {from: newOwner})
      owner.should.equal(await this.token.owner())
    })	 

  })


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


  describe('accepting payments', function () {

    beforeEach(async function () {
      await this.crowdsale.setStart(start)
      await this.crowdsale.addMilestone(m0Period, m0Bonus)
      await this.crowdsale.addMilestone(m1Period, m1Bonus)
      await this.crowdsale.addMilestone(m2Period, m2Bonus)
      await this.crowdsale.setHardcap(hardcap)
      await this.crowdsale.setPrice(price)
    })	 

    it('should set hardcap correct', async function () {
      hardcap.should.be.bignumber.equal(await this.crowdsale.hardCap())
    })

    it('should start time correct', async function () {
      start.should.be.bignumber.equal(await this.crowdsale.start())
    })

    it('should reject payments before start', async function () {
      await this.crowdsale.send(value).should.be.rejectedWith(EVMThrow)
    })

    it('should accept payments after start', async function () {
      await increaseTimeTo(start.add(10))
/*      console.log(await this.crowdsale.currentMilestone())
      console.log(await this.crowdsale.start())
      console.log(await this.crowdsale.hardCap())
      console.log(await this.crowdsale.lastSaleDate())*/
      await this.crowdsale.send(value).should.be.fulfilled
    })

    it('should reject payments after end', async function () {
      await increaseTimeTo(await this.crowdsale.lastSaleDate())
      await this.crowdsale.send(value).should.be.rejectedWith(EVMThrow)
    })

  })

 
})
