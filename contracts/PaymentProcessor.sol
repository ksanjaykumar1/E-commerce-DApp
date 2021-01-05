pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PaymentProcessor {

    address public admin;
    IERC20 public dai;

    event PaymentDone(
        address payer,
        uint amount,
        uint paymentID,
        uint date
    );

    constructor(address adminaddress, address daiAddress) public {
        admin = adminaddress;
        dai = IERC20(daiAddress);
    }

    function pay(uint amount , uint paymentID) external {
        dai.transferFrom(msg.sender,admin,amount); 
        emit PaymentDone(msg.sender,amount,paymentID,block.timestamp);
    }
}