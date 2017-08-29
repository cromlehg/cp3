var Crowdsale = artifacts.require("Crowdsale");
var FidcomToken = artifacts.require("FidcomToken");
var BigNumber = require('bignumber.js');

contract('Crowdsale', function(accounts) {
 
  //============= first owner, function calls from not owner ====================//


  var newPeriod1 = 7;
  var newHardcap1 = 850000000000000000000;
  var newPrice1 = 1700000000000000;

  var newPeriod2 = 7;
  var newHardcap2 = 2550000000000000000000;
  var newPrice2 = 2550000000000000;

  var newPeriod3 = 7;
  var newHardcap3 = 8160000000000000000000;
  var newPrice3 = 2720000000000000;

  var newPeriod4 = 21;
  var newHardcap4 = 49300000000000000000000;
  var newPrice4 = 3400000000000000;

  var newPeriod5 = 41;
  var newHardcap5 = 59300000000000000000000;
  var newPrice5 = 7400000000000000;

  var newPeriod5c = 413;
  var newHardcap5c = 59300000000000000000012;
  var newPrice5c = 7400000000009999;


  it("first owner: should not change ownership", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.transferOwnership(accounts[2], {from: accounts[1]});
    }).then(function() {
      return meta.owner.call();
    }).then(function(owner) {
      assert.notEqual(accounts[0], owner, "Owner changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.owner.call().then(function(owner) {
          assert.notEqual(accounts[2], owner, "Owner changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("first owner: should not change start date", function() {
    var meta;
    var newStart = 1502463457;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setStart(newStart, {from: accounts[1]});
    }).then(function() {
      return meta.start.call();
    }).then(function(start) {
      assert.notEqual(newStart, start, "Start date changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.start.call().then(function(start) {
          assert.notEqual(newStart, start, "Start date changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("first owner: should not paused", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.pause({from: accounts[1]});
    }).then(function() {
      return meta.paused.call();
    }).then(function(paused) {
      assert.notEqual(true, paused, "paused");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.paused.call().then(function(paused) {
          assert.notEqual(true, paused, "paused");
        });
      } else {
        throw e;
      }
    });
  });

  it("first owner: should paused", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.pause({from: accounts[0]});
    }).then(function() {
      return meta.paused.call();
    }).then(function(paused) {
      assert.equal(true, paused, "not paused");
    });
  });

  it("first owner: should not paused when paused", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.pause({from: accounts[0]});
    }).then(function() {
      assert.equal(true, false, "paused when paused");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return assert.equal(true, true, "paused when paused");
      } else {
        throw e;
      }
    });
  });

  it("first owner: should not unpaused", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.unpause({from: accounts[1]});
    }).then(function() {
      return meta.paused.call();
    }).then(function(paused) {
      assert.equal(true, paused, "paused");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.paused.call().then(function(paused) {
          assert.equal(true, paused, "paused");
        });
      } else {
        throw e;
      }
    });
  });

  it("first owner: should unpaused", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.unpause({from: accounts[0]});
    }).then(function() {
      return meta.paused.call();
    }).then(function(paused) {
      assert.equal(false, paused, "not unpaused");
    });
  });

  it("first owner: should not unpaused when unpaused", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.unpause({from: accounts[0]});
    }).then(function() {
      assert.equal(true, false, "unpaused when unpaused");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return assert.equal(true, true, "unpaused when unpaused");
      } else {
        throw e;
      }
    });
  });

  it("first owner: should not change multisig wallet", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setMultisigWallet(accounts[2], {from: accounts[1]});
    }).then(function() {
      return meta.multisigWallet.call();
    }).then(function(wallet) {
      assert.notEqual(accounts[2], wallet, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.multisigWallet.call().then(function(wallet) {
          assert.notEqual(accounts[2], wallet, "changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("first owner: should not change bounty wallet", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setBountyTokensWallet(accounts[2], {from: accounts[1]});
    }).then(function() {
      return meta.bountyTokensWallet.call();
    }).then(function(wallet) {
      assert.notEqual(accounts[2], wallet, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.bountyTokensWallet.call().then(function(wallet) {
          assert.notEqual(accounts[2], wallet, "changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("first owner: should not change founders wallet", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setFoundersTokensWallet(accounts[2], {from: accounts[1]});
    }).then(function() {
      return meta.foundersTokensWallet.call();
    }).then(function(wallet) {
      assert.notEqual(accounts[2], wallet, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.foundersTokensWallet.call().then(function(wallet) {
          assert.notEqual(accounts[2], wallet, "changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("first owner: should not change founders percent", function() {
    var meta;
    var newFoundersPercent = 30;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setFoundersPercent(newFoundersPercent, {from: accounts[1]});
    }).then(function() {
      return meta.foundersPercent.call();
    }).then(function(foundersPercent) {
      assert.notEqual(newFoundersPercent, foundersPercent, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.foundersPercent.call().then(function(foundersPercent) {
          assert.notEqual(newFoundersPercent, foundersPercent, "changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("first owner: should not change bounty percent", function() {
    var meta;
    var newBountyPercent = 30;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setBountyPercent(newBountyPercent, {from: accounts[1]});
    }).then(function() {
      return meta.bountyPercent.call();
    }).then(function(bountyPercent) {
      assert.notEqual(newBountyPercent, bountyPercent, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.bountyPercent.call().then(function(bountyPercent) {
          assert.notEqual(newBountyPercent, bountyPercent, "changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("first owner: should not add stage", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.addStage(1, 12, 10, {from: accounts[1]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.notEqual(0, stagesCount, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.stagesCount().then(function(stagesCount) {
          assert.equal(0, stagesCount, "changed");
        });
      } else {
        throw e;
      }
    });
  });


  it("first owner: should add stage 1", function() {
    var meta;
    var newPeriod = newPeriod1;
    var newHardcap = newHardcap1;
    var newPrice = newPrice1;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.addStage(newPeriod, newHardcap, newPrice, {from: accounts[0]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(1, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod, "stage period wrong");
      assert.equal(stages[1], newHardcap, "stage hardcap wrong");
      assert.equal(stages[2], newPrice, "stage price wrong");
      assert.equal(stages[3], 0, "stage invested wrong");
      assert.equal(stages[4], 0, "stage closed wrong");
    });
  });

  it("first owner: should not remove stage", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.removeStage(0, {from: accounts[1]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.notEqual(1, stagesCount, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.stagesCount().then(function(stagesCount) {
          assert.equal(1, stagesCount, "changed");
        });
      } else {
        throw e;
      }
    });
  });


  it("first owner: should not change stage", function() {
    var meta;
    var newPeriod = newPeriod5c;
    var newHardcap = newHardcap5c;
    var newPrice = newPrice5c;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.changeStage(0, newPeriod, newHardcap, newPrice, {from: accounts[1]});
    }).then(function() {
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.stages(0).then(function(stages) {
         assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
         assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
         assert.equal(stages[2], newPrice1, "stage 1 price wrong");
         assert.equal(stages[3], 0, "stage 1 invested wrong");
         assert.equal(stages[4], 0, "stage 1 closed wrong");
     });
      } else {
        throw e;
      }
    });
  });

  it("first owner: should add stage 2", function() {
    var meta;
    var newPeriod = newPeriod2;
    var newHardcap = newHardcap2;
    var newPrice = newPrice2;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.addStage(newPeriod, newHardcap, newPrice, {from: accounts[0]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(2, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod1 + newPeriod2, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap1 + newHardcap2, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
      return meta.stages(1);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod2, "stage 2 period wrong");
      assert.equal(stages[1], newHardcap2, "stage 2 hardcap wrong");
      assert.equal(stages[2], newPrice2, "stage 2 price wrong");
      assert.equal(stages[3], 0, "stage 2 invested wrong");
      assert.equal(stages[4], 0, "stage 2 closed wrong");
    });
  });

  it("first owner: should add stage 4", function() {
    var meta;
    var newPeriod = newPeriod4;
    var newHardcap = newHardcap4;
    var newPrice = newPrice4;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.addStage(newPeriod, newHardcap, newPrice, {from: accounts[0]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(3, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod1 + newPeriod2 + newPeriod4, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap1 + newHardcap2 + newHardcap4, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
      return meta.stages(1);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod2, "stage 2 period wrong");
      assert.equal(stages[1], newHardcap2, "stage 2 hardcap wrong");
      assert.equal(stages[2], newPrice2, "stage 2 price wrong");
      assert.equal(stages[3], 0, "stage 2 invested wrong");
      assert.equal(stages[4], 0, "stage 2 closed wrong");
      return meta.stages(2);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod4, "stage 4 period wrong");
      assert.equal(stages[1], newHardcap4, "stage 4 hardcap wrong");
      assert.equal(stages[2], newPrice4, "stage 4 price wrong");
      assert.equal(stages[3], 0, "stage 4 invested wrong");
      assert.equal(stages[4], 0, "stage 4 closed wrong");
    });
  });

  it("first owner: should not insert stage", function() {
    var meta;
    var newPeriod = newPeriod3;
    var newHardcap = newHardcap3;
    var newPrice = newPrice3;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.insertStage(1, newPeriod, newHardcap, newPrice, {from: accounts[1]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.notEqual(3, stagesCount, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.stagesCount().then(function(stagesCount) {
          assert.equal(3, stagesCount, "changed");
        });
      } else {
        throw e;
      }
    });
  });


  it("first owner: should insert stage 3", function() {
    var meta;
    var newPeriod = newPeriod3;
    var newHardcap = newHardcap3;
    var newPrice = newPrice3;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.insertStage(1, newPeriod, newHardcap, newPrice, {from: accounts[0]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(4, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod1 + newPeriod2 + newPeriod3 + newPeriod4, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap1 + newHardcap2 + newHardcap3 + newHardcap4, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
      return meta.stages(1);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod2, "stage 2 period wrong");
      assert.equal(stages[1], newHardcap2, "stage 2 hardcap wrong");
      assert.equal(stages[2], newPrice2, "stage 2 price wrong");
      assert.equal(stages[3], 0, "stage 2 invested wrong");
      assert.equal(stages[4], 0, "stage 2 closed wrong");
      return meta.stages(2);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod3, "stage 3 period wrong");
      assert.equal(stages[1], newHardcap3, "stage 3 hardcap wrong");
      assert.equal(stages[2], newPrice3, "stage 3 price wrong");
      assert.equal(stages[3], 0, "stage 3 invested wrong");
      assert.equal(stages[4], 0, "stage 3 closed wrong");
      return meta.stages(3);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod4, "stage 4 period wrong");
      assert.equal(stages[1], newHardcap4, "stage 4 hardcap wrong");
      assert.equal(stages[2], newPrice4, "stage 4 price wrong");
      assert.equal(stages[3], 0, "stage 4 invested wrong");
      assert.equal(stages[4], 0, "stage 4 closed wrong");
    });
  });

  it("first owner: should insert stage 5 in not right place", function() {
    var meta;
    var newPeriod = newPeriod5;
    var newHardcap = newHardcap5;
    var newPrice = newPrice5;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.insertStage(2, newPeriod, newHardcap, newPrice, {from: accounts[0]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(5, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod1 + newPeriod2 + newPeriod3 + newPeriod4 + newPeriod5, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap1 + newHardcap2 + newHardcap3 + newHardcap4 + newHardcap5, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
      return meta.stages(1);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod2, "stage 2 period wrong");
      assert.equal(stages[1], newHardcap2, "stage 2 hardcap wrong");
      assert.equal(stages[2], newPrice2, "stage 2 price wrong");
      assert.equal(stages[3], 0, "stage 2 invested wrong");
      assert.equal(stages[4], 0, "stage 2 closed wrong");
      return meta.stages(2);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod3, "stage 3 period wrong");
      assert.equal(stages[1], newHardcap3, "stage 3 hardcap wrong");
      assert.equal(stages[2], newPrice3, "stage 3 price wrong");
      assert.equal(stages[3], 0, "stage 3 invested wrong");
      assert.equal(stages[4], 0, "stage 3 closed wrong");
      return meta.stages(3);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod5, "stage 5 period wrong");
      assert.equal(stages[1], newHardcap5, "stage 5 hardcap wrong");
      assert.equal(stages[2], newPrice5, "stage 5 price wrong");
      assert.equal(stages[3], 0, "stage 5 invested wrong");
      assert.equal(stages[4], 0, "stage 5 closed wrong");
      return meta.stages(4);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod4, "stage 4 period wrong");
      assert.equal(stages[1], newHardcap4, "stage 4 hardcap wrong");
      assert.equal(stages[2], newPrice4, "stage 4 price wrong");
      assert.equal(stages[3], 0, "stage 4 invested wrong");
      assert.equal(stages[4], 0, "stage 4 closed wrong");
    });
  });

  it("first owner: should changes stage 5 in not right place", function() {
    var meta;
    var newPeriod = newPeriod5c;
    var newHardcap = newHardcap5c;
    var newPrice = newPrice5c;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.changeStage(3, newPeriod, newHardcap, newPrice, {from: accounts[0]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(5, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod1 + newPeriod2 + newPeriod3 + newPeriod4 + newPeriod5c, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap1 + newHardcap2 + newHardcap3 + newHardcap4 + newHardcap5c, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
      return meta.stages(1);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod2, "stage 2 period wrong");
      assert.equal(stages[1], newHardcap2, "stage 2 hardcap wrong");
      assert.equal(stages[2], newPrice2, "stage 2 price wrong");
      assert.equal(stages[3], 0, "stage 2 invested wrong");
      assert.equal(stages[4], 0, "stage 2 closed wrong");
      return meta.stages(2);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod3, "stage 3 period wrong");
      assert.equal(stages[1], newHardcap3, "stage 3 hardcap wrong");
      assert.equal(stages[2], newPrice3, "stage 3 price wrong");
      assert.equal(stages[3], 0, "stage 3 invested wrong");
      assert.equal(stages[4], 0, "stage 3 closed wrong");
      return meta.stages(3);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod5c, "stage 5c period wrong");
      assert.equal(stages[1], newHardcap5c, "stage 5c hardcap wrong");
      assert.equal(stages[2], newPrice5c, "stage 5c price wrong");
      assert.equal(stages[3], 0, "stage 5c invested wrong");
      assert.equal(stages[4], 0, "stage 5c closed wrong");
      return meta.stages(4);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod4, "stage 4 period wrong");
      assert.equal(stages[1], newHardcap4, "stage 4 hardcap wrong");
      assert.equal(stages[2], newPrice4, "stage 4 price wrong");
      assert.equal(stages[3], 0, "stage 4 invested wrong");
      assert.equal(stages[4], 0, "stage 4 closed wrong");
    });
  });

  it("first owner: remove stage 5 from not right place", function() {
    var meta;
    var newPeriod = newPeriod5;
    var newHardcap = newHardcap5;
    var newPrice = newPrice5;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.removeStage(3, {from: accounts[0]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(4, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod1 + newPeriod2 + newPeriod3 + newPeriod4, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap1 + newHardcap2 + newHardcap3 + newHardcap4, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
      return meta.stages(1);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod2, "stage 2 period wrong");
      assert.equal(stages[1], newHardcap2, "stage 2 hardcap wrong");
      assert.equal(stages[2], newPrice2, "stage 2 price wrong");
      assert.equal(stages[3], 0, "stage 2 invested wrong");
      assert.equal(stages[4], 0, "stage 2 closed wrong");
      return meta.stages(2);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod3, "stage 3 period wrong");
      assert.equal(stages[1], newHardcap3, "stage 3 hardcap wrong");
      assert.equal(stages[2], newPrice3, "stage 3 price wrong");
      assert.equal(stages[3], 0, "stage 3 invested wrong");
      assert.equal(stages[4], 0, "stage 3 closed wrong");
      return meta.stages(3);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod4, "stage 4 period wrong");
      assert.equal(stages[1], newHardcap4, "stage 4 hardcap wrong");
      assert.equal(stages[2], newPrice4, "stage 4 price wrong");
      assert.equal(stages[3], 0, "stage 4 invested wrong");
      assert.equal(stages[4], 0, "stage 4 closed wrong");
    });
  });

  // TODO: should check total values - and another not tests too
  it("first owner: should not clear stages", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.clearStages({from: accounts[1]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.notEqual(4, stagesCount, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.stagesCount().then(function(stagesCount) {
          assert.equal(4, stagesCount, "changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("first owner: should clear stages", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.clearStages({from: accounts[0]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(0, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(0, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(0, totalHardCap, "total hardcap not changed");
    });
  });

  // inverse of ownership from 0 to 1 and run all access tests again

  it("first owner: should change ownership", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.transferOwnership(accounts[1], {from: accounts[0]});
    }).then(function() {
      return meta.owner.call();
    }).then(function(owner) {
      assert.equal(owner, accounts[1], "Owner not changed");
    });
  });

  it("second owner: should not change ownership", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.transferOwnership(accounts[2], {from: accounts[0]});
    }).then(function() {
      return meta.owner.call();
    }).then(function(owner) {
      assert.notEqual(accounts[0], owner, "Owner changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.owner.call().then(function(owner) {
          assert.notEqual(accounts[2], owner, "Owner changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("second owner: should not change start date", function() {
    var meta;
    var newStart = 1502463457;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setStart(newStart, {from: accounts[0]});
    }).then(function() {
      return meta.start.call();
    }).then(function(start) {
      assert.notEqual(newStart, start, "Start date changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.start.call().then(function(start) {
          assert.notEqual(newStart, start, "Start date changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("second owner: should not paused", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.pause({from: accounts[0]});
    }).then(function() {
      return meta.paused.call();
    }).then(function(paused) {
      assert.notEqual(true, paused, "paused");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.paused.call().then(function(paused) {
          assert.notEqual(true, paused, "paused");
        });
      } else {
        throw e;
      }
    });
  });

  it("second owner: should paused", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.pause({from: accounts[1]});
    }).then(function() {
      return meta.paused.call();
    }).then(function(paused) {
      assert.equal(true, paused, "not paused");
    });
  });

  it("second owner: should not paused when paused", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.pause({from: accounts[1]});
    }).then(function() {
      assert.equal(true, false, "paused when paused");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return assert.equal(true, true, "paused when paused");
      } else {
        throw e;
      }
    });
  });

  it("second owner: should not unpaused", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.unpause({from: accounts[0]});
    }).then(function() {
      return meta.paused.call();
    }).then(function(paused) {
      assert.equal(true, paused, "paused");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.paused.call().then(function(paused) {
          assert.equal(true, paused, "paused");
        });
      } else {
        throw e;
      }
    });
  });

  it("second owner: should unpaused", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.unpause({from: accounts[1]});
    }).then(function() {
      return meta.paused.call();
    }).then(function(paused) {
      assert.equal(false, paused, "not unpaused");
    });
  });

  it("second owner: should not unpaused when unpaused", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.unpause({from: accounts[1]});
    }).then(function() {
      assert.equal(true, false, "unpaused when unpaused");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return assert.equal(true, true, "unpaused when unpaused");
      } else {
        throw e;
      }
    });
  });

  it("second owner: should not change multisig wallet", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setMultisigWallet(accounts[2], {from: accounts[0]});
    }).then(function() {
      return meta.multisigWallet.call();
    }).then(function(wallet) {
      assert.notEqual(accounts[2], wallet, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.multisigWallet.call().then(function(wallet) {
          assert.notEqual(accounts[2], wallet, "changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("second owner: should not change bounty wallet", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setBountyTokensWallet(accounts[2], {from: accounts[0]});
    }).then(function() {
      return meta.bountyTokensWallet.call();
    }).then(function(wallet) {
      assert.notEqual(accounts[2], wallet, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.bountyTokensWallet.call().then(function(wallet) {
          assert.notEqual(accounts[2], wallet, "changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("second owner: should not change founders wallet", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setFoundersTokensWallet(accounts[2], {from: accounts[0]});
    }).then(function() {
      return meta.foundersTokensWallet.call();
    }).then(function(wallet) {
      assert.notEqual(accounts[2], wallet, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.foundersTokensWallet.call().then(function(wallet) {
          assert.notEqual(accounts[2], wallet, "changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("second owner: should not change founders percent", function() {
    var meta;
    var newFoundersPercent = 30;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setFoundersPercent(newFoundersPercent, {from: accounts[0]});
    }).then(function() {
      return meta.foundersPercent.call();
    }).then(function(foundersPercent) {
      assert.notEqual(newFoundersPercent, foundersPercent, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.foundersPercent.call().then(function(foundersPercent) {
          assert.notEqual(newFoundersPercent, foundersPercent, "changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("second owner: should not change bounty percent", function() {
    var meta;
    var newBountyPercent = 30;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setBountyPercent(newBountyPercent, {from: accounts[0]});
    }).then(function() {
      return meta.bountyPercent.call();
    }).then(function(bountyPercent) {
      assert.notEqual(newBountyPercent, bountyPercent, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.bountyPercent.call().then(function(bountyPercent) {
          assert.notEqual(newBountyPercent, bountyPercent, "changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("second owner: should not add stage", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.addStage(1, 12, 10, {from: accounts[0]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.notEqual(0, stagesCount, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.stagesCount().then(function(stagesCount) {
          assert.equal(0, stagesCount, "changed");
        });
      } else {
        throw e;
      }
    });
  });


  it("second owner: should add stage 1", function() {
    var meta;
    var newPeriod = newPeriod1;
    var newHardcap = newHardcap1;
    var newPrice = newPrice1;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.addStage(newPeriod, newHardcap, newPrice, {from: accounts[1]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(1, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod, "stage period wrong");
      assert.equal(stages[1], newHardcap, "stage hardcap wrong");
      assert.equal(stages[2], newPrice, "stage price wrong");
      assert.equal(stages[3], 0, "stage invested wrong");
      assert.equal(stages[4], 0, "stage closed wrong");
    });
  });

  it("second owner: should not remove stage", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.removeStage(0, {from: accounts[0]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.notEqual(1, stagesCount, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.stagesCount().then(function(stagesCount) {
          assert.equal(1, stagesCount, "changed");
        });
      } else {
        throw e;
      }
    });
  });


  it("second owner: should not change stage", function() {
    var meta;
    var newPeriod = newPeriod5c;
    var newHardcap = newHardcap5c;
    var newPrice = newPrice5c;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.changeStage(0, newPeriod, newHardcap, newPrice, {from: accounts[0]});
    }).then(function() {
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.stages(0).then(function(stages) {
         assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
         assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
         assert.equal(stages[2], newPrice1, "stage 1 price wrong");
         assert.equal(stages[3], 0, "stage 1 invested wrong");
         assert.equal(stages[4], 0, "stage 1 closed wrong");
     });
      } else {
        throw e;
      }
    });
  });

  it("second owner: should add stage 2", function() {
    var meta;
    var newPeriod = newPeriod2;
    var newHardcap = newHardcap2;
    var newPrice = newPrice2;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.addStage(newPeriod, newHardcap, newPrice, {from: accounts[1]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(2, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod1 + newPeriod2, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap1 + newHardcap2, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
      return meta.stages(1);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod2, "stage 2 period wrong");
      assert.equal(stages[1], newHardcap2, "stage 2 hardcap wrong");
      assert.equal(stages[2], newPrice2, "stage 2 price wrong");
      assert.equal(stages[3], 0, "stage 2 invested wrong");
      assert.equal(stages[4], 0, "stage 2 closed wrong");
    });
  });

  it("second owner: should add stage 4", function() {
    var meta;
    var newPeriod = newPeriod4;
    var newHardcap = newHardcap4;
    var newPrice = newPrice4;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.addStage(newPeriod, newHardcap, newPrice, {from: accounts[1]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(3, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod1 + newPeriod2 + newPeriod4, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap1 + newHardcap2 + newHardcap4, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
      return meta.stages(1);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod2, "stage 2 period wrong");
      assert.equal(stages[1], newHardcap2, "stage 2 hardcap wrong");
      assert.equal(stages[2], newPrice2, "stage 2 price wrong");
      assert.equal(stages[3], 0, "stage 2 invested wrong");
      assert.equal(stages[4], 0, "stage 2 closed wrong");
      return meta.stages(2);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod4, "stage 4 period wrong");
      assert.equal(stages[1], newHardcap4, "stage 4 hardcap wrong");
      assert.equal(stages[2], newPrice4, "stage 4 price wrong");
      assert.equal(stages[3], 0, "stage 4 invested wrong");
      assert.equal(stages[4], 0, "stage 4 closed wrong");
    });
  });

  it("second owner: should not insert stage", function() {
    var meta;
    var newPeriod = newPeriod3;
    var newHardcap = newHardcap3;
    var newPrice = newPrice3;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.insertStage(1, newPeriod, newHardcap, newPrice, {from: accounts[0]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.notEqual(3, stagesCount, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.stagesCount().then(function(stagesCount) {
          assert.equal(3, stagesCount, "changed");
        });
      } else {
        throw e;
      }
    });
  });


  it("second owner: should insert stage 3", function() {
    var meta;
    var newPeriod = newPeriod3;
    var newHardcap = newHardcap3;
    var newPrice = newPrice3;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.insertStage(1, newPeriod, newHardcap, newPrice, {from: accounts[1]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(4, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod1 + newPeriod2 + newPeriod3 + newPeriod4, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap1 + newHardcap2 + newHardcap3 + newHardcap4, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
      return meta.stages(1);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod2, "stage 2 period wrong");
      assert.equal(stages[1], newHardcap2, "stage 2 hardcap wrong");
      assert.equal(stages[2], newPrice2, "stage 2 price wrong");
      assert.equal(stages[3], 0, "stage 2 invested wrong");
      assert.equal(stages[4], 0, "stage 2 closed wrong");
      return meta.stages(2);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod3, "stage 3 period wrong");
      assert.equal(stages[1], newHardcap3, "stage 3 hardcap wrong");
      assert.equal(stages[2], newPrice3, "stage 3 price wrong");
      assert.equal(stages[3], 0, "stage 3 invested wrong");
      assert.equal(stages[4], 0, "stage 3 closed wrong");
      return meta.stages(3);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod4, "stage 4 period wrong");
      assert.equal(stages[1], newHardcap4, "stage 4 hardcap wrong");
      assert.equal(stages[2], newPrice4, "stage 4 price wrong");
      assert.equal(stages[3], 0, "stage 4 invested wrong");
      assert.equal(stages[4], 0, "stage 4 closed wrong");
    });
  });

  it("second owner: should insert stage 5 in not right place", function() {
    var meta;
    var newPeriod = newPeriod5;
    var newHardcap = newHardcap5;
    var newPrice = newPrice5;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.insertStage(2, newPeriod, newHardcap, newPrice, {from: accounts[1]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(5, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod1 + newPeriod2 + newPeriod3 + newPeriod4 + newPeriod5, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap1 + newHardcap2 + newHardcap3 + newHardcap4 + newHardcap5, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
      return meta.stages(1);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod2, "stage 2 period wrong");
      assert.equal(stages[1], newHardcap2, "stage 2 hardcap wrong");
      assert.equal(stages[2], newPrice2, "stage 2 price wrong");
      assert.equal(stages[3], 0, "stage 2 invested wrong");
      assert.equal(stages[4], 0, "stage 2 closed wrong");
      return meta.stages(2);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod3, "stage 3 period wrong");
      assert.equal(stages[1], newHardcap3, "stage 3 hardcap wrong");
      assert.equal(stages[2], newPrice3, "stage 3 price wrong");
      assert.equal(stages[3], 0, "stage 3 invested wrong");
      assert.equal(stages[4], 0, "stage 3 closed wrong");
      return meta.stages(3);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod5, "stage 5 period wrong");
      assert.equal(stages[1], newHardcap5, "stage 5 hardcap wrong");
      assert.equal(stages[2], newPrice5, "stage 5 price wrong");
      assert.equal(stages[3], 0, "stage 5 invested wrong");
      assert.equal(stages[4], 0, "stage 5 closed wrong");
      return meta.stages(4);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod4, "stage 4 period wrong");
      assert.equal(stages[1], newHardcap4, "stage 4 hardcap wrong");
      assert.equal(stages[2], newPrice4, "stage 4 price wrong");
      assert.equal(stages[3], 0, "stage 4 invested wrong");
      assert.equal(stages[4], 0, "stage 4 closed wrong");
    });
  });

  it("second owner: should changes stage 5 in not right place", function() {
    var meta;
    var newPeriod = newPeriod5c;
    var newHardcap = newHardcap5c;
    var newPrice = newPrice5c;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.changeStage(3, newPeriod, newHardcap, newPrice, {from: accounts[1]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(5, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod1 + newPeriod2 + newPeriod3 + newPeriod4 + newPeriod5c, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap1 + newHardcap2 + newHardcap3 + newHardcap4 + newHardcap5c, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
      return meta.stages(1);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod2, "stage 2 period wrong");
      assert.equal(stages[1], newHardcap2, "stage 2 hardcap wrong");
      assert.equal(stages[2], newPrice2, "stage 2 price wrong");
      assert.equal(stages[3], 0, "stage 2 invested wrong");
      assert.equal(stages[4], 0, "stage 2 closed wrong");
      return meta.stages(2);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod3, "stage 3 period wrong");
      assert.equal(stages[1], newHardcap3, "stage 3 hardcap wrong");
      assert.equal(stages[2], newPrice3, "stage 3 price wrong");
      assert.equal(stages[3], 0, "stage 3 invested wrong");
      assert.equal(stages[4], 0, "stage 3 closed wrong");
      return meta.stages(3);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod5c, "stage 5c period wrong");
      assert.equal(stages[1], newHardcap5c, "stage 5c hardcap wrong");
      assert.equal(stages[2], newPrice5c, "stage 5c price wrong");
      assert.equal(stages[3], 0, "stage 5c invested wrong");
      assert.equal(stages[4], 0, "stage 5c closed wrong");
      return meta.stages(4);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod4, "stage 4 period wrong");
      assert.equal(stages[1], newHardcap4, "stage 4 hardcap wrong");
      assert.equal(stages[2], newPrice4, "stage 4 price wrong");
      assert.equal(stages[3], 0, "stage 4 invested wrong");
      assert.equal(stages[4], 0, "stage 4 closed wrong");
    });
  });

  it("second owner: remove stage 5 from not right place", function() {
    var meta;
    var newPeriod = newPeriod5;
    var newHardcap = newHardcap5;
    var newPrice = newPrice5;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.removeStage(3, {from: accounts[1]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(4, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(newPeriod1 + newPeriod2 + newPeriod3 + newPeriod4, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap1 + newHardcap2 + newHardcap3 + newHardcap4, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
      return meta.stages(1);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod2, "stage 2 period wrong");
      assert.equal(stages[1], newHardcap2, "stage 2 hardcap wrong");
      assert.equal(stages[2], newPrice2, "stage 2 price wrong");
      assert.equal(stages[3], 0, "stage 2 invested wrong");
      assert.equal(stages[4], 0, "stage 2 closed wrong");
      return meta.stages(2);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod3, "stage 3 period wrong");
      assert.equal(stages[1], newHardcap3, "stage 3 hardcap wrong");
      assert.equal(stages[2], newPrice3, "stage 3 price wrong");
      assert.equal(stages[3], 0, "stage 3 invested wrong");
      assert.equal(stages[4], 0, "stage 3 closed wrong");
      return meta.stages(3);
    }).then(function(stages) {
      assert.equal(stages[0], newPeriod4, "stage 4 period wrong");
      assert.equal(stages[1], newHardcap4, "stage 4 hardcap wrong");
      assert.equal(stages[2], newPrice4, "stage 4 price wrong");
      assert.equal(stages[3], 0, "stage 4 invested wrong");
      assert.equal(stages[4], 0, "stage 4 closed wrong");
    });
  });

  // TODO: should check total values - and another not tests too
  it("second owner: should not clear stages", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.clearStages({from: accounts[0]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.notEqual(4, stagesCount, "changed");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.stagesCount().then(function(stagesCount) {
          assert.equal(4, stagesCount, "changed");
        });
      } else {
        throw e;
      }
    });
  });

  it("second owner: should clear stages", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.clearStages({from: accounts[1]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(0, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(0, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(0, totalHardCap, "total hardcap not changed");
    });
  });

  it("second owner: should change ownership", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.transferOwnership(accounts[0], {from: accounts[1]});
    }).then(function() {
      return meta.owner.call();
    }).then(function(owner) {
      assert.equal(owner, accounts[0], "Owner not changed");
    });
  });


//
// State now cleared - now pass control to second account,
// and configure to minimodel and test it.
//
//  1. Owner wallet = 1
//  2. multisigWallet = 0
//  3. founders wallet = 2
//  4. bounty wallet = 3
//  5. founders percent - 4.5% - in 1000 part - 45
//  6. bounty percent - 0.5% - in 1000 part - 5
//
//  7. investor 1 wallet = 4
//  8. investor 2 wallet = 5
//  9. investor 3 wallet = 6
// 10. investor 4 wallet = 7
// 11. investor 5 wallet = 8
//
  it("ICO 1: should change ownership", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.transferOwnership(accounts[1], {from: accounts[0]});
    }).then(function() {
      return meta.owner.call();
    }).then(function(owner) {
      assert.equal(owner, accounts[1], "Owner not changed");
    });
  });

  // setup all wallets
  it("ICO 1: should set wallet for investments", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setMultisigWallet(accounts[0], {from: accounts[1]});
    }).then(function() {
      return meta.multisigWallet.call();
    }).then(function(wallet) {
      assert.equal(accounts[0], wallet, "not changed");
    });
  });

  it("ICO 1: should set wallet for founders tokens", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setFoundersTokensWallet(accounts[2], {from: accounts[1]});
    }).then(function() {
      return meta.foundersTokensWallet.call();
    }).then(function(wallet) {
      assert.equal(accounts[2], wallet, "not changed");
    });
  });

  it("ICO 1: should set wallet for bounty tokens", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setBountyTokensWallet(accounts[3], {from: accounts[1]});
    }).then(function() {
      return meta.bountyTokensWallet.call();
    }).then(function(wallet) {
      assert.equal(accounts[3], wallet, "not changed");
    });
  });

  // setup percents for founders and bounty tokens
  it("ICO 1: should set founders tokens percent", function() {
    var meta;
    var newFoudnersPercent = 45;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setFoundersPercent(newFoudnersPercent, {from: accounts[1]});
    }).then(function() {
      return meta.foundersPercent.call();
    }).then(function(foundersPercent) {
      assert.equal(newFoudnersPercent, foundersPercent, "not changed");
    });
  });

  it("ICO 1: should set bounty percent", function() {
    var meta;
    var newBountyPercent = 5;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setBountyPercent(newBountyPercent, {from: accounts[1]});
    }).then(function() {
      return meta.bountyPercent.call();
    }).then(function(bountyPercent) {
      assert.equal(newBountyPercent, bountyPercent, "not changed");
    });
  });

  //
  // setup miniICO model:
  // stages
  //
  // 1) addStage(1,   850 000000000000000000, 1700000000000000);
  // 2) addStage(1,  2550 000000000000000000, 2550000000000000);
  // 3) addStage(1,  8160 000000000000000000, 2720000000000000);
  // 4) addStage(1, 49300 000000000000000000, 3400000000000000);
  // 
  //


  var modelPeriod1 = 1;
  var modelPeriod2 = 1;
  var modelPeriod3 = 1;
  var modelPeriod4 = 1;

  it("ICO 1: should setup stages", function() {
    var meta;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.addStage(modelPeriod1, newHardcap1, newPrice1, {from: accounts[1]});
    }).then(function() {
      return meta.addStage(modelPeriod2, newHardcap2, newPrice2, {from: accounts[1]});
    }).then(function() {
      return meta.addStage(modelPeriod3, newHardcap3, newPrice3, {from: accounts[1]});
    }).then(function() {
      return meta.addStage(modelPeriod4, newHardcap4, newPrice4, {from: accounts[1]});
    }).then(function() {
      return meta.stagesCount();
    }).then(function(stagesCount) {
      assert.equal(4, stagesCount, "stages count not changed");
      return meta.totalPeriod.call();
    }).then(function(totalPeriod) {
      assert.equal(modelPeriod1 + modelPeriod2 + modelPeriod3 + modelPeriod4, totalPeriod, "total period not changed");
      return meta.totalHardCap.call();
    }).then(function(totalHardCap) {
      assert.equal(newHardcap1 + newHardcap2 + newHardcap3 + newHardcap4, totalHardCap, "total hardcap not changed");
      return meta.stages(0);
    }).then(function(stages) {
      assert.equal(stages[0], modelPeriod1, "stage 1 period wrong");
      assert.equal(stages[1], newHardcap1, "stage 1 hardcap wrong");
      assert.equal(stages[2], newPrice1, "stage 1 price wrong");
      assert.equal(stages[3], 0, "stage 1 invested wrong");
      assert.equal(stages[4], 0, "stage 1 closed wrong");
      return meta.stages(1);
    }).then(function(stages) {
      assert.equal(stages[0], modelPeriod2, "stage 2 period wrong");
      assert.equal(stages[1], newHardcap2, "stage 2 hardcap wrong");
      assert.equal(stages[2], newPrice2, "stage 2 price wrong");
      assert.equal(stages[3], 0, "stage 2 invested wrong");
      assert.equal(stages[4], 0, "stage 2 closed wrong");
      return meta.stages(2);
    }).then(function(stages) {
      assert.equal(stages[0], modelPeriod3, "stage 3 period wrong");
      assert.equal(stages[1], newHardcap3, "stage 3 hardcap wrong");
      assert.equal(stages[2], newPrice3, "stage 3 price wrong");
      assert.equal(stages[3], 0, "stage 3 invested wrong");
      assert.equal(stages[4], 0, "stage 3 closed wrong");
      return meta.stages(3);
    }).then(function(stages) {
      assert.equal(stages[0], modelPeriod4, "stage 4 period wrong");
      assert.equal(stages[1], newHardcap4, "stage 4 hardcap wrong");
      assert.equal(stages[2], newPrice4, "stage 4 price wrong");
      assert.equal(stages[3], 0, "stage 4 invested wrong");
      assert.equal(stages[4], 0, "stage 4 closed wrong");
    });
  });

  it("ICO 1 - ICO not started: should not invest before start date", function() {
    var meta;
    var startDate = Math.floor(Date.now()/1000) + 60*60;
    var invested = web3.toWei(15, 'ether');
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setStart(startDate, {from: accounts[1]});
    }).then(function() {
      return meta.start.call();
    }).then(function(start) {
      assert.equal(startDate, start, "invest date not changed");
      return web3.eth.sendTransaction({ from: accounts[4], to: meta.address, value: invested, gas: 180000 })
    }).then(function() {
      return meta.totalInvested.call();
    }).then(function(totalInvested) {
      assert.equal(0, totalInvested, "invested");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.totalInvested.call().then(function(totalInvested) {
          assert.equal(0, totalInvested, "invested");
        });
      } else {
        throw e;
      }
    });
  });

  it("ICO 1 - ICO finished: should not invest after ICO finnished", function() {
    var meta;
    var startDate = Math.floor(Date.now()/1000) - 100*24*60*60;
    var invested = web3.toWei(15, 'ether');
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setStart(startDate, {from: accounts[1]});
    }).then(function() {
      return meta.start.call();
    }).then(function(start) {
      assert.equal(startDate, start, "invest date not changed");
      return web3.eth.sendTransaction({ from: accounts[4], to: meta.address, value: invested, gas: 180000 })
    }).then(function() {
      return meta.totalInvested.call();
    }).then(function(totalInvested) {
      assert.equal(0, totalInvested, "invested");
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        return meta.totalInvested.call().then(function(totalInvested) {
          assert.equal(0, totalInvested, "invested");
        });
      } else {
        throw e;
      }
    });
  });


  it("ICO 1 - ICO started minute ago: should invest returns success", function() {
    var etherMul = new BigNumber(1000000000000000000);
    var meta;
    var metaToken;
    var transferredFDC = 1;
    var transferredFDCInWei = new BigNumber(web3.toWei(transferredFDC, 'ether'));;
    var catched = false;
    var startDate = Math.floor(Date.now()/1000) - 60;
    var investedInEth = 15;
    var investedInWei = new BigNumber(web3.toWei(investedInEth, 'ether'));
    var investedPass1StageInEth = 851;
    var investedPass1StageInWei = new BigNumber(web3.toWei(investedPass1StageInEth, 'ether'));
    var investedPass2StageInEth = 2551;
    var investedPass2StageInWei = new BigNumber(web3.toWei(investedPass2StageInEth, 'ether'));
    var investedPass3StageInEth = 8161;
    var investedPass3StageInWei = new BigNumber(web3.toWei(investedPass3StageInEth, 'ether'));
    var investedPass4StageInEth = 49301;
    var investedPass4StageInWei = new BigNumber(web3.toWei(investedPass4StageInEth, 'ether'));

    var investedAfter_1_2_3_in_Ether = investedInEth + investedPass1StageInEth + investedPass2StageInEth;
    var investedAfter_1_2_3_in_Wgei = new BigNumber(web3.toWei(investedAfter_1_2_3_in_Ether, 'ether'));

    var investedAfter_1_2_3_4_in_Ether = investedInEth + investedPass1StageInEth + investedPass2StageInEth + investedPass3StageInEth;
    var investedAfter_1_2_3_4_in_Wgei = new BigNumber(web3.toWei(investedAfter_1_2_3_4_in_Ether, 'ether'));

    var investedAfter_1_2_3_4_5_in_Ether = investedInEth + investedPass1StageInEth + investedPass2StageInEth + investedPass3StageInEth + investedPass4StageInEth;
    var investedAfter_1_2_3_4_5_in_Wgei = new BigNumber(web3.toWei(investedAfter_1_2_3_4_5_in_Ether, 'ether'));

    var lastDate = startDate + (modelPeriod1 + modelPeriod2 + modelPeriod3 + modelPeriod4)*24*60*60;
    var firstInvestorTokensFDC = investedInWei.dividedToIntegerBy(new BigNumber(newPrice1));
    var firstInvestorTokensFDCInWei = firstInvestorTokensFDC.mul(etherMul);
    var investedPass1StageTokensFDC = investedPass1StageInWei.dividedToIntegerBy(new BigNumber(newPrice1));
    var investedPass1StageTokensFDCInWei = investedPass1StageTokensFDC.mul(etherMul);
    var investedPass2StageTokensFDC = investedPass2StageInWei.dividedToIntegerBy(new BigNumber(newPrice2));
    var investedPass2StageTokensFDCInWei = investedPass2StageTokensFDC.mul(etherMul);
    var investedPass3StageTokensFDC = investedPass3StageInWei.dividedToIntegerBy(new BigNumber(newPrice3));
    var investedPass3StageTokensFDCInWei = investedPass3StageTokensFDC.mul(etherMul);
    var investedPass4StageTokensFDC = investedPass4StageInWei.dividedToIntegerBy(new BigNumber(newPrice4));
    var investedPass4StageTokensFDCInWei = investedPass4StageTokensFDC.mul(etherMul);
    var lastDateAfterSecondInvestor;
    var lastDateAfterThridInvestor;
    var lastDateAfter4Investor;
    var lastDateAfter5Investor;
    var mBalanceMultisigFDC;
    var mBalanceFoundersFDC;
    var mBalanceBountyFDC;
    var mBalanceInvestorsFDC;
    //var hardcap = newHardcap1 + newHardcap2 + newHardcap3 + newHardcap4;
    return Crowdsale.deployed().then(function(instance) {
      meta = instance;
      return meta.setStart(startDate, {from: accounts[1]});
    }).then(function() {
      return meta.token.call();
    }).then(function(token) {
      metaToken = FidcomToken.at(token);
      return meta.start.call();
    }).then(function(start) {
      assert.equal(startDate, start, "invest date not changed");
      return meta.lastSaleDate.call();
    }).then(function(lastSaleDate) {
      assert.equal(lastDate, lastSaleDate, "invest last sale date");
      return meta.currentStage.call();
    }).then(function(stageIndex) {
      assert.equal(0, stageIndex, "current stage wrong");
      return web3.eth.sendTransaction({ from: accounts[4], to: meta.address, value: investedInWei, gas: 180000 })
    }).then(function() {
      return meta.totalInvested.call();
    }).then(function(totalInvested) {
      assert.equal(investedInWei.toString(), totalInvested.toString(), "not invested");
      return metaToken.totalSupply.call();
    }).then(function(totalSupply) {
      var parsedInvested = web3.toWei(totalSupply, 'ether');
      assert.equal(firstInvestorTokensFDCInWei.toString(), totalSupply.toString(), "not mint right count of tokens");
    // test to pass first stage //
      lastDateAfterSecondInvestor = Math.floor(Date.now()/1000) + (modelPeriod2 + modelPeriod3 + modelPeriod4)*24*60*60;
      return web3.eth.sendTransaction({ from: accounts[5], to: meta.address, value: investedPass1StageInWei, gas: 180000 })
    }).then(function() {
      return meta.totalInvested.call();
    }).then(function(totalInvested) {
      assert.equal(investedInWei.add(investedPass1StageInWei).toString(), totalInvested.toString(), "not invested pass stage 1");
      return metaToken.totalSupply.call();
    }).then(function(totalSupply) {
      assert.equal(firstInvestorTokensFDCInWei.add(investedPass1StageTokensFDCInWei).toString(), totalSupply.toString(), "not mint right count of tokens  pass stage 1");
      return meta.currentStage.call();
    }).then(function(stageIndex) {
      assert.equal(1, stageIndex, "current stage wrong after second investor");
      return meta.lastSaleDate.call();
    }).then(function(lastSaleDate) {
      var fixedDate = parseInt(lastSaleDate);
      if(fixedDate > lastDateAfterSecondInvestor) {
	fixedDate--;
      }
      assert.equal(lastDateAfterSecondInvestor, fixedDate, "invest last sale date after second investor");
    // test to pass second stage //
      lastDateAfterThridInvestor = Math.floor(Date.now()/1000) + (modelPeriod3 + modelPeriod4)*24*60*60;
      return web3.eth.sendTransaction({ from: accounts[6], to: meta.address, value: investedPass2StageInWei, gas: 180000 })
    }).then(function() {
      return meta.totalInvested.call();
    }).then(function(totalInvested) {
      assert.equal(investedAfter_1_2_3_in_Wgei.toString(), totalInvested.toString(), "not invested pass stage 2");
      return metaToken.totalSupply.call();
    }).then(function(totalSupply) {
      assert.equal(firstInvestorTokensFDCInWei.add(investedPass1StageTokensFDCInWei).add(investedPass2StageTokensFDCInWei).toString(), totalSupply.toString(), "not mint right count of tokens  pass stage 2");
      return meta.currentStage.call();
    }).then(function(stageIndex) {
      assert.equal(2, stageIndex, "current stage wrong after thrid investor");
      return meta.lastSaleDate.call();
    }).then(function(lastSaleDate) {
      var fixedDate = parseInt(lastSaleDate);
      if(fixedDate > lastDateAfterThridInvestor) {
	fixedDate--;
      }
      assert.equal(lastDateAfterThridInvestor, fixedDate, "invest last sale date after thrid investor");
    // test to pass 3 stage //
      lastDateAfter4Investor = Math.floor(Date.now()/1000) + (modelPeriod4)*24*60*60;
      return web3.eth.sendTransaction({ from: accounts[7], to: meta.address, value: investedPass3StageInWei, gas: 180000 })
    }).then(function() {
      return meta.totalInvested.call();
    }).then(function(totalInvested) {
      assert.equal(investedAfter_1_2_3_4_in_Wgei.toString(), totalInvested.toString(), "not invested pass stage 3");
      return metaToken.totalSupply.call();
    }).then(function(totalSupply) {
      assert.equal(firstInvestorTokensFDCInWei.add(investedPass1StageTokensFDCInWei).add(investedPass2StageTokensFDCInWei).add(investedPass3StageTokensFDCInWei).toString(), totalSupply.toString(), "not mint right count of tokens  pass stage 3");
      return meta.currentStage.call();
    }).then(function(stageIndex) {
      assert.equal(3, stageIndex, "current stage wrong after 4 investor");
      return meta.lastSaleDate.call();
    }).then(function(lastSaleDate) {
      var fixedDate = parseInt(lastSaleDate);
      if(fixedDate > lastDateAfter4Investor) {
	fixedDate--;
      }
      assert.equal(lastDateAfter4Investor, fixedDate, "invest last sale date after 4 investor");
    // test to pass 4 stage //
      lastDateAfter5Investor = Math.floor(Date.now()/1000);
      return web3.eth.sendTransaction({ from: accounts[8], to: meta.address, value: investedPass4StageInWei, gas: 180000 })
    }).then(function() {
      return meta.totalInvested.call();
    }).then(function(totalInvested) {
      assert.equal(investedAfter_1_2_3_4_5_in_Wgei.toString(), totalInvested.toString(), "not invested pass stage 4");
      return metaToken.totalSupply.call();
    }).then(function(totalSupply) {
      mBalanceInvestorsFDC = totalSupply;
      assert.equal(firstInvestorTokensFDCInWei.add(investedPass1StageTokensFDCInWei).add(investedPass2StageTokensFDCInWei).add(investedPass3StageTokensFDCInWei).add(investedPass4StageTokensFDCInWei).toString(), totalSupply.toString(), "not mint right count of tokens  pass stage 4");
      return meta.lastSaleDate.call();
    }).then(function(lastSaleDate) {
      var fixedDate = parseInt(lastSaleDate);
      if(fixedDate > lastDateAfter5Investor) {
	fixedDate--;
      }
      assert.equal(lastDateAfter5Investor, fixedDate, "invest last sale date after 5 investor");
    // try to invest - should fail
      return web3.eth.sendTransaction({ from: accounts[9], to: meta.address, value: investedPass4StageInWei, gas: 180000 })
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        catched = true;
        return true;
      } else {
        throw e;
      }
    }).then(function() {
      assert.equal(true, catched, "not catched");
      catched = false;
      // try to transfer - should fail
      return metaToken.transfer(accounts[8], transferredFDCInWei, { from: accounts[9], gas: 180000 });
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        catched = true;
        return true;
      } else {
        throw e;
      }
    }).then(function() {
      assert.equal(true, catched, "not catched");
      catched = false;
      // finish minting try - try from not owner
      return meta.finishMinting({ from: accounts[0], gas: 180000 })
    }).catch(function(e) {
      if(e.toString().indexOf("invalid opcode") != -1) {
        catched = true;
        return true;
      } else {
        throw e;
      }
    }).then(function() {
      assert.equal(true, catched, "not catched when try to finish minting from not owner");
      // finish minting try - it should mint tokens, check balances
      return meta.finishMinting({ from: accounts[1], gas: 180000 })
    }).then(function() {
      return metaToken.balanceOf(accounts[0]);
    }).then(function(balance) {
      mBalanceMultisigFDC = balance;
      return metaToken.balanceOf(accounts[2]);
    }).then(function(balance) {
      mBalanceFoundersFDC = balance;
      return metaToken.balanceOf(accounts[3]);
    }).then(function(balance) {
      mBalanceBountyFDC = balance;
      mSummaryMintedFDCAfterICO = mBalanceMultisigFDC.add(mBalanceInvestorsFDC).add(mBalanceFoundersFDC).add(mBalanceBountyFDC);
      mBountyPercentTokens = mSummaryMintedFDCAfterICO.div(new BigNumber(1000)).mul(new BigNumber(5));
      mFoundersPercentTokens = mSummaryMintedFDCAfterICO.div(new BigNumber(1000)).mul(new BigNumber(45));
      assert.equal(mBalanceFoundersFDC.dividedToIntegerBy(1000).toString(), mFoundersPercentTokens.dividedToIntegerBy(1000).toString(), "Fouders tokens wront count");
      assert.equal(mBalanceBountyFDC.dividedToIntegerBy(1000).toString(), mBountyPercentTokens.dividedToIntegerBy(1000).toString(), "Bounty tokens wront count");
      // check balances for 4,5,6,7,8
      return metaToken.balanceOf(accounts[4]);
    }).then(function(balance) {
      assert.equal(firstInvestorTokensFDCInWei.toString(), balance.toString(), "1 investor balance wrong!");
      return metaToken.balanceOf(accounts[5]);
    }).then(function(balance) {
      assert.equal(investedPass1StageTokensFDCInWei.toString(), balance.toString(), "2 investor balance wrong!");
      return metaToken.balanceOf(accounts[6]);
    }).then(function(balance) {
      assert.equal(investedPass2StageTokensFDCInWei, balance.toString(), "3 investor balance wrong!");
      return metaToken.balanceOf(accounts[7]);
    }).then(function(balance) {
      assert.equal(investedPass3StageTokensFDCInWei, balance.toString(), "4 investor balance wrong!");
      return metaToken.balanceOf(accounts[8]);
    }).then(function(balance) {
      assert.equal(investedPass4StageTokensFDCInWei, balance.toString(), "5 investor balance wrong!");
      // check transfer balance after ICO - try to move tokens - moved
      return metaToken.transfer(accounts[7], transferredFDCInWei, { from: accounts[8], gas: 180000 });
    }).then(function(balance) {
      return metaToken.balanceOf(accounts[4]);
    }).then(function(balance) {
      assert.equal(firstInvestorTokensFDCInWei.toString(), balance.toString(), "after transfer: 1 investor balance wrong!");
      return metaToken.balanceOf(accounts[5]);
    }).then(function(balance) {
      assert.equal(investedPass1StageTokensFDCInWei.toString(), balance.toString(), "after transfer: 2 investor balance wrong!");
      return metaToken.balanceOf(accounts[6]);
    }).then(function(balance) {
      assert.equal(investedPass2StageTokensFDCInWei.toString(), balance.toString(), "after transfer: 3 investor balance wrong!");
      return metaToken.balanceOf(accounts[7]);
    }).then(function(balance) {
      var invested7FDC = investedPass3StageTokensFDCInWei.add(transferredFDCInWei);
      assert.equal(balance.toString(), invested7FDC.toString(), "after transfer: 4 investor balance wrong!");
      return metaToken.balanceOf(accounts[8]);
    }).then(function(balance) {
      var invested8FDC = investedPass4StageTokensFDCInWei.sub(transferredFDCInWei)
      assert.equal(balance.toString(), invested8FDC.toString(), "after transfer: 5 investor balance wrong!");
    });

  });

  // try finish minting for not owner!!!
});
