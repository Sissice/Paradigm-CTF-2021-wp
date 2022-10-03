pragma solidity 0.7.0;

contract BabySandbox {
    function run(address code) external payable {
        assembly {
            // if we're calling ourselves, perform the privileged delegatecall
            //如果合约正在调用自己，则对指定地址执行delegatecall
            if eq(caller(), address()) {
                switch delegatecall(gas(), code, 0x00, 0x00, 0x00, 0x00)
                    case 0 {
                        returndatacopy(0x00, 0x00, returndatasize())
                        revert(0x00, returndatasize())
                    }
                    case 1 {
                        returndatacopy(0x00, 0x00, returndatasize())
                        return(0x00, returndatasize())
                    }
            }

            // ensure enough gas
            //检查是否有足够的gas
            if lt(gas(), 0xf000) {
                revert(0x00, 0x00)
            }

            // load calldata
            calldatacopy(0x00, 0x00, calldatasize())

            // run using staticcall
            // if this fails, then the code is malicious because it tried to change state
            //否则，通过staticcall将当前调用转发给它自己
            if iszero(staticcall(0x4000, address(), 0, calldatasize(), 0, 0)) {
                revert(0x00, 0x00)
            }

            // if we got here, the code wasn't malicious
            // run without staticcall since it's safe
            //staticcall成功后，才对它自己进行另一个call。
            switch call(0x4000, address(), 0, 0, calldatasize(), 0, 0)
                case 0 {
                    returndatacopy(0x00, 0x00, returndatasize())
                    // revert(0x00, returndatasize())
                }
                case 1 {
                    returndatacopy(0x00, 0x00, returndatasize())
                    return(0x00, returndatasize())
                }
        }
    }
}
