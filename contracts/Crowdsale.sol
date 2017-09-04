pragma solidity ^0.4.16;

/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/179
 */
contract ERC20Basic {
  uint256 public totalSupply;
  function balanceOf(address who) constant returns (uint256);
  function transfer(address to, uint256 value) returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {
  function allowance(address owner, address spender) constant returns (uint256);
  function transferFrom(address from, address to, uint256 value) returns (bool);
  function approve(address spender, uint256 value) returns (bool);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
    
  function mul(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal constant returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal constant returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
  
}

/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances. 
 */
contract BasicToken is ERC20Basic {
    
  using SafeMath for uint256;

  mapping(address => uint256) balances;

  /**
  * @dev transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) returns (bool) {
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    Transfer(msg.sender, _to, _value);
    return true;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param _owner The address to query the the balance of. 
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address _owner) constant returns (uint256 balance) {
    return balances[_owner];
  }

}

/**
 * @title Standard ERC20 token
 *
 * @dev Implementation of the basic standard token.
 * @dev https://github.com/ethereum/EIPs/issues/20
 * @dev Based on code by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 */
contract StandardToken is ERC20, BasicToken {

  mapping (address => mapping (address => uint256)) allowed;

  /**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amout of tokens to be transfered
   */
  function transferFrom(address _from, address _to, uint256 _value) returns (bool) {
    var _allowance = allowed[_from][msg.sender];

    // Check is not needed because sub(_allowance, _value) will already throw if this condition is not met
    // require (_value <= _allowance);

    balances[_to] = balances[_to].add(_value);
    balances[_from] = balances[_from].sub(_value);
    allowed[_from][msg.sender] = _allowance.sub(_value);
    Transfer(_from, _to, _value);
    return true;
  }

  /**
   * @dev Aprove the passed address to spend the specified amount of tokens on behalf of msg.sender.
   * @param _spender The address which will spend the funds.
   * @param _value The amount of tokens to be spent.
   */
  function approve(address _spender, uint256 _value) returns (bool) {

    // To change the approve amount you first have to reduce the addresses`
    //  allowance to zero by calling `approve(_spender, 0)` if it is not
    //  already 0 to mitigate the race condition described here:
    //  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    require((_value == 0) || (allowed[msg.sender][_spender] == 0));

    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param _owner address The address which owns the funds.
   * @param _spender address The address which will spend the funds.
   * @return A uint256 specifing the amount of tokens still available for the spender.
   */
  function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
    return allowed[_owner][_spender];
  }

}

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    
  address public owner;

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) onlyOwner {
    require(newOwner != address(0));      
    owner = newOwner;
  }

}

/**
 * @title Mintable token
 * @dev Simple ERC20 Token example, with mintable token creation
 * @dev Issue: * https://github.com/OpenZeppelin/zeppelin-solidity/issues/120
 * Based on code by TokenMarketNet: https://github.com/TokenMarketNet/ico/blob/master/contracts/MintableToken.sol
 */

contract MintableToken is StandardToken, Ownable {
    
  event Mint(address indexed to, uint256 amount);
  
  event MintFinished();

  bool public finishMinting = false;

  address public saleAgent;

  function setSaleAgent(address newSaleAgnet) {
    require(msg.sender == saleAgent || msg.sender == owner);
    saleAgent = newSaleAgnet;
  }

  /**
   * @dev Function to mint tokens
   * @param _to The address that will recieve the minted tokens.
   * @param _amount The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */
  function mint(address _to, uint256 _amount) returns (bool) {
    require(msg.sender == saleAgent && !finishMinting);
    totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    Mint(_to, _amount);
    return true;
  }

  /**
   * @dev Function to stop minting new tokens.
   * @return True if the operation was successful.
   */
  function finishMinting() returns (bool) {
    require(msg.sender == saleAgent || msg.sender == owner && !finishMinting);
    finishMinting = true;
    MintFinished();
    return true;
  }
  
}

/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is Ownable {
    
  event Pause();
  
  event Unpause();

  bool public paused = false;

  /**
   * @dev modifier to allow actions only when the contract IS paused
   */
  modifier whenNotPaused() {
    require(!paused);
    _;
  }

  /**
   * @dev modifier to allow actions only when the contract IS NOT paused
   */
  modifier whenPaused() {
    require(paused);
    _;
  }

  /**
   * @dev called by the owner to pause, triggers stopped state
   */
  function pause() onlyOwner whenNotPaused {
    paused = true;
    Pause();
  }

  /**
   * @dev called by the owner to unpause, returns to normal state
   */
  function unpause() onlyOwner whenPaused {
    paused = false;
    Unpause();
  }
  
}

contract XRRTestToken is MintableToken {	
    
  string public constant name = "XRRT";
   
  string public constant symbol = "XRRT Test token";
    
  uint32 public constant decimals = 18;
    
}


contract StagedCrowdsale is Pausable {

  using SafeMath for uint;

  struct Milestone {
    uint period;
    uint bonus;
  }

  uint public start;

  uint public totalPeriod;

  uint public invested;

  uint public hardCap;
 
  Milestone[] public milestones;

  function milestonesCount() constant returns(uint) {
    return milestones.length;
  }

  function setStart(uint newStart) onlyOwner {
    start = newStart;
  }

  function setHardcap(uint newHardcap) onlyOwner {
    hardCap = newHardcap;
  }

  function addMilestone(uint period, uint bonus) onlyOwner {
    require(period > 0);
    milestones.push(Milestone(period, bonus));
    totalPeriod = totalPeriod.add(period);
  }

  function removeMilestones(uint8 number) onlyOwner {
    require(number < milestones.length);
    Milestone storage milestone = milestones[number];
    totalPeriod = totalPeriod.sub(milestone.period);

    delete milestones[number];

    for (uint i = number; i < milestones.length - 1; i++) {
      milestones[i] = milestones[i+1];
    }

    milestones.length--;
  }

  function changeMilestone(uint8 number, uint period, uint bonus) onlyOwner {
    require(number < milestones.length);
    Milestone storage milestone = milestones[number];

    totalPeriod = totalPeriod.sub(milestone.period);    

    milestone.period = period;
    milestone.bonus = bonus;

    totalPeriod = totalPeriod.add(period);    
  }

  function insertMilestone(uint8 numberAfter, uint period, uint bonus) onlyOwner {
    require(numberAfter < milestones.length);

    totalPeriod = totalPeriod.add(period);

    milestones.length++;

    for (uint i = milestones.length - 2; i > numberAfter; i--) {
      milestones[i + 1] = milestones[i];
    }

    milestones[numberAfter + 1] = Milestone(period, bonus);
  }

  function clearMilestones() onlyOwner {
    require(milestones.length > 0);
    for (uint i = 0; i < milestones.length; i++) {
      delete milestones[i];
    }
    milestones.length -= milestones.length;
    totalPeriod = 0;
  }

  modifier saleIsOn() {
    require(milestones.length > 0 && now >= start && now < lastSaleDate());
    _;
  }
  
  modifier isUnderHardCap() {
    require(invested <= hardCap);
    _;
  }
  
  function lastSaleDate() constant returns(uint) {
    require(milestones.length > 0);
    return start + totalPeriod * 1 days;
  }

  function currentMilestone() saleIsOn constant returns(uint) {
    uint previousDate = start;
    for(uint i=0; i < milestones.length; i++) {
      if(now >= previousDate && now < previousDate + milestones[i].period * 1 days) {
        return i;
      }
      previousDate = previousDate.add(milestones[i].period * 1 days);
    }
    revert();
  }

}

// FIX for freezed alien tokens, price and etc
contract CommonSale is StagedCrowdsale {

  address public multisigWallet;
  
  address public foundersTokensWallet;
  
  address public bountyTokensWallet;

  uint public foundersPercent;
  
  uint public bountyTokensCount;
 
  uint public price;

  uint public percentRate = 100;

  bool public bountyMinted = false;
  
  CommonSale public nextSale;
  
  MintableToken public token;

  function setToken(address newToken) onlyOwner {
    token = MintableToken(newToken);
  }

  function setNextSale(address newNextSale) onlyOwner {
    nextSale = CommonSale(newNextSale);
  }

  function setPrice(uint newPrice) onlyOwner {
    price = newPrice;
  }

  function setPercentRate(uint newPercentRate) onlyOwner {
    percentRate = newPercentRate;
  }

  function setFoundersPercent(uint newFoundersPercent) onlyOwner {
    foundersPercent = newFoundersPercent;
  }
  
  function setBountyTokensCount(uint newBountyTokensCount) onlyOwner {
    bountyTokensCount = newBountyTokensCount;
  }
  
  function setMultisigWallet(address newMultisigWallet) onlyOwner {
    multisigWallet = newMultisigWallet;
  }

  function setFoundersTokensWallet(address newFoundersTokensWallet) onlyOwner {
    foundersTokensWallet = newFoundersTokensWallet;
  }

  function setBountyTokensWallet(address newBountyTokensWallet) onlyOwner {
    bountyTokensWallet = newBountyTokensWallet;
  }

  function createTokens() whenNotPaused isUnderHardCap saleIsOn payable {
    require(msg.value > 0);
    uint milestoneIndex = currentMilestone();
    Milestone storage milestone = milestones[milestoneIndex];
    multisigWallet.transfer(msg.value);
    invested = invested.add(msg.value);
    uint tokens = msg.value.div(price).mul(1 ether);
    uint bonusTokens = tokens.div(percentRate).mul(milestone.bonus);
    uint tokensWithBonus = tokens.add(bonusTokens);
    token.mint(msg.sender, tokensWithBonus);
    uint foundersTokens = tokens.div(percentRate).mul(foundersPercent);
    token.mint(foundersTokensWallet, foundersTokens);
  }

  function mintBounty() public whenNotPaused onlyOwner {
    require(!bountyMinted);
    token.mint(bountyTokensWallet, bountyTokensCount * 1 ether);
    bountyMinted = true;
  }

  function finishMinting() public whenNotPaused onlyOwner {
    if(nextSale == address(0)) {
      token.finishMinting();
    } else {
      token.setSaleAgent(nextSale);
    }
  }

  function() external payable {
    createTokens();
  }

  function retrieveTokens(address anotherToken) public onlyOwner {
    ERC20 alienToken = ERC20(anotherToken);
    alienToken.transfer(multisigWallet, token.balanceOf(this));
  }

}
/*
contract TestPreSale is CommonSale {
    
  function deploy() onlyOwner {
    MintableToken token = new XRRTestToken();
    address multisigWalletPreSale = 0x11a8121AfBBd83a88CF97a84A86Da6E6Fb640b9d;
    address foundersTokensPreSaleWallet = 0xB10c7598b9DfaB99cD646BA385560912dE95F590; 
    address bountyTokensPreSaleWallet = 0x89E42DeDcDFE4E86222ec9C64A38F13e899Ba8Ce;
    uint preSalePrice = 1000000000000;
    uint preSaleHardCap = 9000000000000000000;
    uint preSaleStart = 1504170000;
    uint bountyTokensPreSaleCount = 110;
    uint foundersTokensPreSalePercent = 25; 
    uint period = 1;
    uint periodLast = period*2;

    addMilestone(period, 100);
    addMilestone(period, 50);
    addMilestone(periodLast, 40);
    setMultisigWallet(multisigWalletPreSale);
    setBountyTokensWallet(bountyTokensPreSaleWallet);
    setFoundersTokensWallet(foundersTokensPreSaleWallet);
    setBountyTokensCount(bountyTokensPreSaleCount);
    setFoundersPercent(foundersTokensPreSalePercent);
    setStart(preSaleStart);
    setPrice(preSalePrice);
    setHardcap(preSaleHardCap);
    
    token.setSaleAgent(this);  
    setToken(token);
  }
    
}


*/



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
