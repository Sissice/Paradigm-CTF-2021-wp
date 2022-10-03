pragma solidity 0.4.16;

import "./Guard.sol";

contract GuardRegistry {
    mapping(bytes32 => address) public implementations;

    address public owner;

    bytes32 public defaultImplementation;

    function GuardRegistry() public {
        owner = msg.sender;
    }

    // register a new guard implementation, optionally setting it to the default
    // 注册一个新的guard implementation，也可以选择将他设置为默认
    // 只有合约拥有者才能调用
    function registerGuardImplementation(address impl, bool def) public {
        require(msg.sender == owner);

        bytes32 id = GuardIdGetter(impl).id();

        implementations[id] = impl;
        if (def) {
            defaultImplementation = id;
        }
    }

    // transfer ownership to a new address
    // 转移所有权
    function transferOwnership(address newOwner) public {
        require(msg.sender == owner);

        owner = newOwner;
    }
}
