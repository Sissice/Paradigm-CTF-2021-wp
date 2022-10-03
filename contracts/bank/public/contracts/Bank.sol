pragma solidity 0.4.24;

contract ERC20Like {
    function transfer(address dst, uint qty) public returns (bool);
    function transferFrom(address src, address dst, uint qty) public returns (bool);
    function approve(address dst, uint qty) public returns (bool);

    function balanceOf(address who) public view returns (uint);
}

contract Bank {
    address public owner;
    address public pendingOwner;

    struct Account {
        string accountName;
        uint uniqueTokens;
        mapping(address => uint) balances;
    }

    mapping(address => Account[]) accounts;

    constructor() public {
        owner = msg.sender;
    }

    //存入Token
    function depositToken(uint accountId, address token, uint amount) external {
        require(accountId <= accounts[msg.sender].length, "depositToken/bad-account");

        // open a new account for the user if necessary
        //如果需要，请为用户打开一个新帐户
        if (accountId == accounts[msg.sender].length) {
            accounts[msg.sender].length++;
        }

        Account storage account = accounts[msg.sender][accountId];
        uint oldBalance = account.balances[token];

        // check the user has enough balance and no overflows will occur
        //检查用户是否有足够的余额，不会发生溢出
        require(oldBalance + amount >= oldBalance, "depositToken/overflow");
        require(ERC20Like(token).balanceOf(msg.sender) >= amount, "depositToken/low-sender-balance");

        // increment counter for unique tokens if necessary
        //如有必要，递增唯一令牌的计数器
        if (oldBalance == 0) {
            account.uniqueTokens++;
        }

        // update the balance
        //更新余额
        account.balances[token] += amount;

        // transfer the tokens in
        //将代币转入
        uint beforeBalance = ERC20Like(token).balanceOf(address(this));
        require(ERC20Like(token).transferFrom(msg.sender, address(this), amount), "depositToken/transfer-failed");
        uint afterBalance = ERC20Like(token).balanceOf(address(this));
        require(afterBalance - beforeBalance == amount, "depositToken/fee-token");
    }

    function withdrawToken(uint accountId, address token, uint amount) external {
        require(accountId < accounts[msg.sender].length, "withdrawToken/bad-account");

        Account storage account = accounts[msg.sender][accountId];
        uint lastAccount = accounts[msg.sender].length - 1;
        uint oldBalance = account.balances[token];

        // check the user can actually withdraw the amount they want and we have enough balance
        //检查用户是否可以实际提取他们想要的金额，我们有足够的余额
        require(oldBalance >= amount, "withdrawToken/underflow");
        require(ERC20Like(token).balanceOf(address(this)) >= amount, "withdrawToken/low-sender-balance");

        // update the balance
        //更新余额
        account.balances[token] -= amount;

        // if the user has emptied their balance, decrement the number of unique tokens
        //如果用户清空了余额，则减少唯一令牌的数量
        if (account.balances[token] == 0) {
            account.uniqueTokens--;

            // if the user is withdrawing everything from their last account, close it
            // we can't close accounts in the middle of the array because we can't
            // clone the balances mapping, so the user would lose all their balance
            //如果用户要从上一个帐户中提取所有内容，请关闭它
            //我们无法关闭阵列中间的帐户，因为我们无法克隆余额映射，这样用户将失去所有余额
            if (account.uniqueTokens == 0 && accountId == lastAccount) {
                accounts[msg.sender].length--;
            }
        }

        // transfer the tokens out
        //转出代币
        uint beforeBalance = ERC20Like(token).balanceOf(msg.sender);
        require(ERC20Like(token).transfer(msg.sender, amount), "withdrawToken/transfer-failed");
        uint afterBalance = ERC20Like(token).balanceOf(msg.sender);
        require(afterBalance - beforeBalance == amount, "withdrawToken/fee-token");
    }

    // set the display name of the account
    //设置账户的显示名称
    function setAccountName(uint accountId, string name) external {
        require(accountId < accounts[msg.sender].length, "setAccountName/invalid-account");

        accounts[msg.sender][accountId].accountName = name;
    }

    // close the last account if empty - we need this in case we couldn't automatically close
    // the account during withdrawal
    function closeLastAccount() external {
        // make sure the user has an account
        //确保用户有账户
        require(accounts[msg.sender].length > 0, "closeLastAccount/no-accounts");

        // make sure the last account is empty
        //确保最后一个账户为空
        uint lastAccount = accounts[msg.sender].length - 1;
        require(accounts[msg.sender][lastAccount].uniqueTokens == 0, "closeLastAccount/non-empty");

        // close the account
        //关闭账户
        accounts[msg.sender].length--;
    }

    // get info about the account
    //获得账户信息
    function getAccountInfo(uint accountId) public view returns (string, uint) {
        require(accountId < accounts[msg.sender].length, "getAccountInfo/invalid-account");

        return (
            accounts[msg.sender][accountId].accountName,
            accounts[msg.sender][accountId].uniqueTokens
        );
    }

    // get the balance of a token
    //获得Token的余额
    function getAccountBalance(uint accountId, address token) public view returns (uint) {
        require(accountId < accounts[msg.sender].length, "getAccountBalance/invalid-account");

        return accounts[msg.sender][accountId].balances[token];
    }

    // transfer ownership to a new address
    //将所有权转移到新地址
    function transferOwnership(address newOwner) public {
        require(msg.sender == owner);

        pendingOwner = newOwner;
    }

    // accept the ownership transfer
    //接受所有权转让
    function acceptOwnership() public {
        require(msg.sender == pendingOwner);

        owner = pendingOwner;
        pendingOwner = address(0x00);
    }
}
