
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

contract('CommonSale', function () {

  before(async function() {
   //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
   await advanceBlock()
  })


  beforeEach(async function () {
    this.token = await Token.new()
    this.crowdsale = await Crowdsale.new(await this.crowdsale.token())
  })	 

  it('should be token owner', async function () {
    const owner = await this.token.owner()
    owner.should.equal(this.crowdsale.address)
  })	 

})
