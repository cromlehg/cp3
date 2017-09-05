
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

const StagedCrowdsale = artifacts.require('StagedCrowdsale')

contract('StagedCrowdsale', function(wallets) {

  const notOwner = wallets[1]
  
  const newAddr = wallets[2]
  
  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock()
  })
  
  beforeEach(async function () {
    this.stagedCrowdsale = await StagedCrowdsale.new()
  })	 
  
  describe('not owner reject tests', function () {

      it('setStart reject if not owner', async function () {
        await this.stagedCrowdsale.setStart(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setHardcap reject if not owner', async function () {
        await this.stagedCrowdsale.setHardcap(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('addMilestone reject if not owner', async function () {
        await this.stagedCrowdsale.addMilestone(1, 1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('removeMilestones reject if not owner', async function () {
        await this.stagedCrowdsale.removeMilestones(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('changeMilestone reject if not owner', async function () {
        await this.stagedCrowdsale.changeMilestone(1, 1, 1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('insertMilestone reject if not owner', async function () {
        await this.stagedCrowdsale.insertMilestone(1, 1, 1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('clearMilestones reject if not owner', async function () {
        await this.stagedCrowdsale.clearMilestones({from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

  })

})
