
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
    this.stagedcrowdsale = await StagedCrowdsale.new()
  })	 
  
  describe('not owner reject tests', function () {

      it('setStart reject if not owner', async function () {
        await this.stagedcrowdsale.setStart(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setHardcap reject if not owner', async function () {
        await this.stagedcrowdsale.setHardcap(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('addMilestone reject if not owner', async function () {
        await this.stagedcrowdsale.addMilestone(1, 1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('removeMilestones reject if not owner', async function () {
        await this.stagedcrowdsale.removeMilestones(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('changeMilestone reject if not owner', async function () {
        await this.stagedcrowdsale.changeMilestone(1, 1, 1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('insertMilestone reject if not owner', async function () {
        await this.stagedcrowdsale.insertMilestone(1, 1, 1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('clearMilestones reject if not owner', async function () {
        await this.stagedcrowdsale.clearMilestones({from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

  })

})


