pragma solidity ^0.4.13;

contract TestConfigurator is Ownable {

  address public owner = 0xA6F5138CD040Ba04ec03c2763871402aE6cd6B45;
  address public multisigWalletPreSale = 0x11a8121AfBBd83a88CF97a84A86Da6E6Fb640b9d;
  address public multisigWalletMainSale = 0x2213Ced2655c3454438162c81933865ed6289696;
  address public bountyTokensPreSaleWallet = 0x89E42DeDcDFE4E86222ec9C64A38F13e899Ba8Ce;
  address public foundersTokensPreSaleWallet = 0xB10c7598b9DfaB99cD646BA385560912dE95F590; 
  address public bountyTokensMainSaleWallet = 0x26450331453f4fE67E3557b54336062f133c716C;
  address public foundersTokensMainSaleWallet = 0x8D6dC4Df99e18f07F1be6833a59c0Cd48C5c1329; 
  uint public bountyTokensPreSaleCount = 110;
  uint public foundersTokensPreSalePercent = 25; 
  uint public bountyTokensMainSaleCount = 125;
  uint public foundersTokensMainSalePercent = 15; 
  uint public preSaleStart = 1504170000;
  uint public mainSaleStart = 1504602000;
  uint public period = 1;
  uint public periodLast = period*2;
  uint public preSalePrice = 1000000000000;
  uint public mainSalePrice = 2000000000000;
  uint public preSaleHardCap = 9000000000000000000;
  uint public mainSaleHardCap = 10000000000000000000;

  MintableToken public token;

  CommonSale public preSale;
  
  CommonSale public mainSale;

  function deploy() onlyOwner {
      
    token = new XRRTestToken();

    preSale = new CommonSale();
  
    mainSale = new CommonSale();

    preSale.setToken(token);

    mainSale.setToken(token);
      
    preSale.addMilestone(period, 100);
    preSale.addMilestone(period, 50);
    preSale.addMilestone(periodLast + 1, 40);
    preSale.setMultisigWallet(multisigWalletPreSale);
    preSale.setBountyTokensWallet(bountyTokensPreSaleWallet);
    preSale.setFoundersTokensWallet(foundersTokensPreSaleWallet);
    preSale.setBountyTokensCount(bountyTokensPreSaleCount);
    preSale.setFoundersPercent(foundersTokensPreSalePercent);
    preSale.setStart(preSaleStart);
    preSale.setPrice(preSalePrice);
    preSale.setHardcap(preSaleHardCap);

    mainSale.setMultisigWallet(multisigWalletMainSale);
    mainSale.setBountyTokensWallet(bountyTokensMainSaleWallet);
    mainSale.setFoundersTokensWallet(foundersTokensMainSaleWallet);
    mainSale.setBountyTokensCount(bountyTokensMainSaleCount);
    mainSale.setFoundersPercent(foundersTokensMainSalePercent);
    mainSale.addMilestone(period, 20);
    mainSale.addMilestone(period, 10);
    mainSale.addMilestone(periodLast, 0);
    mainSale.setStart(mainSaleStart);
    mainSale.setPrice(mainSalePrice);
    mainSale.setHardcap(mainSaleHardCap);
 
    preSale.setNextSale(mainSale);

    token.setSaleAgent(preSale);  

    preSale.transferOwnership(owner);
    mainSale.transferOwnership(owner);
    token.transferOwnership(owner);

  }


}

