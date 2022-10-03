pragma solidity 0.4.16;

import "./Guard.sol";
import "./Vault.sol";

//实现Guard中的接口
contract SingleOwnerGuard is Guard {
    bytes32 public constant id = "single-owner";

    bool private initialized;
    Vault private vault;

    string[] public publicOps;

    // initialize the proxy instance for the given vault
    //初始化
    function initialize(Vault vault_) external {
        require(!initialized);

        vault = vault_;
        initialized = true;
    }

    // clean up the proxy instance. must be the vault owner
    //销毁
    function cleanup() external {
        require(msg.sender == address(vault));
        require(vault.guard() == this);

        selfdestruct(owner());
    }

    // check if the sender is the owner, or if the op is public
    //检查是否是所有者或者公开的方法
    function isAllowed(address who, string op) external view returns (uint8, uint8) {
        if (who == owner()) return (NO_ERROR, 1);

        for (uint i = 0; i < publicOps.length; i++) {
            if (keccak256(publicOps[i]) == keccak256(op)) {
                return (NO_ERROR, 2);
            }
        }

        return (PERMISSION_DENIED, 1);
    }

    // add a new public op. must be owner
    //只允许金库合约的所有者添加可以公开访问的方法名称
    function addPublicOperation(string op) external {
        require(msg.sender == owner());

        publicOps.push(op);
    }

    // get the owner of the guard (who is also the owner of the vault)
    //返回value的owner
    function owner() public view returns (address) {
        return vault.owner();
    }
}
