
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


const TestConfigurator = artifacts.require('TestConfigurator')

contract('Crowdsale', function ([_, investor, wallet, purchaser]) {


  before(async function() {
   //Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
   await advanceBlock()
  })


})
