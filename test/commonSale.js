
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

contract('CommonSale', function(wallets) {

  const notOwner = wallets[1]
  
  const newAddr = wallets[2]
  
  before(async function() {
    //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock()
  })
  
  beforeEach(async function () {
    this.commonsale = await CommonSale.new()
  })	 
  
  describe('not owner reject tests', function () {

      it('setToken reject if not owner', async function () {
        await this.commonsale.setToken(newAddr, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setNextSale reject if not owner', async function () {
        await this.commonsale.setNextSale(newAddr, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setPrice reject if not owner', async function () {
        await this.commonsale.setPrice(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setPercentRate reject if not owner', async function () {
        await this.commonsale.setPercentRate(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setFoundersPercent reject if not owner', async function () {
        await this.commonsale.setFoundersPercent(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setBountyTokensCount reject if not owner', async function () {
        await this.commonsale.setBountyTokensCount(1, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setMultisigWallet reject if not owner', async function () {
        await this.commonsale.setMultisigWallet(newAddr, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setFoundersTokensWallet reject if not owner', async function () {
        await this.commonsale.setFoundersTokensWallet(newAddr, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('setBountyTokensWallet reject if not owner', async function () {
        await this.commonsale.setBountyTokensWallet(newAddr, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('mintBounty reject if not owner', async function () {
        await this.commonsale.mintBounty({from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('finishMinting reject if not owner', async function () {
        await this.commonsale.finishMinting({from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

      it('retrieveTokens reject if not owner', async function () {
        await this.commonsale.retrieveTokens(newAddr, {from: notOwner}).should.be.rejectedWith(EVMThrow)
      })

  })

})


