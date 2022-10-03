pragma solidity 0.4.16;

import "./SingleOwnerGuard.sol";
import "./GuardRegistry.sol";
import "./Vault.sol";

contract vaultSetup {
    GuardRegistry public registry;
    Vault public vault;

    function vaultSetup() public {
        registry = new GuardRegistry();
        registry.registerGuardImplementation(new SingleOwnerGuard(), true);

        vault = new Vault(registry);

        SingleOwnerGuard guard = SingleOwnerGuard(vault.guard());
        guard.addPublicOperation("deposit");
        guard.addPublicOperation("withdraw");
    }

    function isSolved() public view returns (bool) {
        return vault.owner() != address(this);
    }
}
