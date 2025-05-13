
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


/**
 * @title LendingProtocol
 * @dev A simple decentralized lending protocol that allows users to deposit, borrow, and repay.
 */
contract LendingProtocol is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // Struct to track deposits
    struct Deposit {
        uint256 amount;
        uint256 timestamp;
    }
    
    // Struct to track loans
    struct Loan {
        uint256 amount;
        uint256 collateral;
        uint256 timestamp;
        bool active;
    }
    
    // Asset configuration
    struct AssetConfig {
        bool isListed;
        uint256 collateralFactor; // Percentage (e.g., 75 = 75%)
        uint256 borrowInterestRate; // Annual rate in basis points (1% = 100)
        uint256 depositInterestRate; // Annual rate in basis points (1% = 100)
    }
    
    // Mapping of token address to asset configuration
    mapping(address => AssetConfig) public assetConfigs;
    
    // Mapping of user address to token address to deposit amount
    mapping(address => mapping(address => Deposit)) public deposits;
    
    // Mapping of user address to token address to loan details
    mapping(address => mapping(address => Loan)) public loans;
    
    // Total deposits for each token
    mapping(address => uint256) public totalDeposits;
    
    // Total borrowed for each token
    mapping(address => uint256) public totalBorrowed;
    
    // Events
    event AssetListed(address indexed token, uint256 collateralFactor, uint256 borrowRate, uint256 depositRate);
    event Deposited(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(address indexed user, address indexed token, uint256 amount);
    event Borrowed(address indexed user, address indexed token, uint256 amount, uint256 collateral);
    event Repaid(address indexed user, address indexed token, uint256 amount);
    
    /**
     * @dev Constructor for the LendingProtocol contract
     */
    constructor() {}
    
    /**
     * @dev Lists a new asset to be used in the protocol
     * @param token The address of the ERC20 token
     * @param collateralFactor The collateral factor (e.g., 75 = 75%)
     * @param borrowRate The borrowing interest rate in basis points
     * @param depositRate The deposit interest rate in basis points
     */
    function listAsset(
        address token,
        uint256 collateralFactor,
        uint256 borrowRate,
        uint256 depositRate
    ) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(collateralFactor <= 90, "Collateral factor too high");
        require(borrowRate >= depositRate, "Borrow rate must be >= deposit rate");
        
        assetConfigs[token] = AssetConfig({
            isListed: true,
            collateralFactor: collateralFactor,
            borrowInterestRate: borrowRate,
            depositInterestRate: depositRate
        });
        
        emit AssetListed(token, collateralFactor, borrowRate, depositRate);
    }
    
    /**
     * @dev Deposits tokens into the protocol
     * @param token The address of the token to deposit
     * @param amount The amount to deposit
     */
    function deposit(address token, uint256 amount) external nonReentrant {
        require(assetConfigs[token].isListed, "Asset not listed");
        require(amount > 0, "Amount must be > 0");
        
        // Transfer tokens from user to contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        // Update deposit tracking
        deposits[msg.sender][token] = Deposit({
            amount: deposits[msg.sender][token].amount + amount,
            timestamp: block.timestamp
        });
        
        totalDeposits[token] += amount;
        
        emit Deposited(msg.sender, token, amount);
    }
    
    /**
     * @dev Withdraws tokens from the protocol
     * @param token The address of the token to withdraw
     * @param amount The amount to withdraw
     */
    function withdraw(address token, uint256 amount) external nonReentrant {
        require(assetConfigs[token].isListed, "Asset not listed");
        require(amount > 0, "Amount must be > 0");
        require(deposits[msg.sender][token].amount >= amount, "Insufficient deposit");
        
        // Calculate interest earned (simplified)
        uint256 interestEarned = calculateDepositInterest(msg.sender, token);
        uint256 totalAmount = amount + interestEarned;
        
        // Ensure there are enough funds in the protocol
        require(IERC20(token).balanceOf(address(this)) >= totalAmount, "Insufficient protocol funds");
        
        // Update deposit tracking
        deposits[msg.sender][token].amount -= amount;
        deposits[msg.sender][token].timestamp = block.timestamp;
        
        totalDeposits[token] -= amount;
        
        // Transfer tokens from contract to user
        IERC20(token).safeTransfer(msg.sender, totalAmount);
        
        emit Withdrawn(msg.sender, token, totalAmount);
    }
    
    /**
     * @dev Borrows tokens using another token as collateral
     * @param borrowToken The address of the token to borrow
     * @param borrowAmount The amount to borrow
     * @param collateralToken The address of the token to use as collateral
     * @param collateralAmount The amount of collateral to lock
     */
    function borrow(
        address borrowToken,
        uint256 borrowAmount,
        address collateralToken,
        uint256 collateralAmount
    ) external nonReentrant {
        require(assetConfigs[borrowToken].isListed, "Borrow asset not listed");
        require(assetConfigs[collateralToken].isListed, "Collateral asset not listed");
        require(borrowAmount > 0, "Borrow amount must be > 0");
        require(collateralAmount > 0, "Collateral amount must be > 0");
        require(!loans[msg.sender][borrowToken].active, "Existing loan must be repaid first");
        
        // Check if there's enough of the borrow token in the protocol
        require(
            IERC20(borrowToken).balanceOf(address(this)) >= borrowAmount,
            "Insufficient protocol liquidity"
        );
        
        // Calculate the borrow limit based on the collateral
        uint256 collateralValue = collateralAmount; // Simplified - should use price oracle
        uint256 collateralFactor = assetConfigs[collateralToken].collateralFactor;
        uint256 borrowLimit = (collateralValue * collateralFactor) / 100;
        
        require(borrowAmount <= borrowLimit, "Borrow amount exceeds limit");
        
        // Transfer collateral from user to contract
        IERC20(collateralToken).safeTransferFrom(msg.sender, address(this), collateralAmount);
        
        // Update loan tracking
        loans[msg.sender][borrowToken] = Loan({
            amount: borrowAmount,
            collateral: collateralAmount,
            timestamp: block.timestamp,
            active: true
        });
        
        totalBorrowed[borrowToken] += borrowAmount;
        
        // Transfer borrowed tokens to user
        IERC20(borrowToken).safeTransfer(msg.sender, borrowAmount);
        
        emit Borrowed(msg.sender, borrowToken, borrowAmount, collateralAmount);
    }
    
    /**
     * @dev Repays a loan and retrieves the collateral
     * @param token The address of the token that was borrowed
     * @param amount The amount to repay (0 = full amount)
     */
    function repay(address token, uint256 amount) external nonReentrant {
        require(loans[msg.sender][token].active, "No active loan");
        
        Loan storage loan = loans[msg.sender][token];
        
        // Calculate interest owed (simplified)
        uint256 interest = calculateLoanInterest(msg.sender, token);
        uint256 totalOwed = loan.amount + interest;
        
        // Determine repayment amount
        uint256 repayAmount = amount == 0 ? totalOwed : amount;
        require(repayAmount <= totalOwed, "Repay amount too high");
        
        // Transfer repayment from user to contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), repayAmount);
        
        // If full repayment, return collateral
        if (repayAmount == totalOwed) {
            // Get collateral token (simplified)
            address collateralToken = token; // This should be stored with loan or determined differently
            
            // Reset loan
            loan.active = false;
            loan.amount = 0;
            
            totalBorrowed[token] -= loan.amount;
            
            // Transfer collateral back to user
            IERC20(collateralToken).safeTransfer(msg.sender, loan.collateral);
        } else {
            // Partial repayment
            loan.amount = totalOwed - repayAmount;
            loan.timestamp = block.timestamp;
            
            totalBorrowed[token] -= repayAmount;
        }
        
        emit Repaid(msg.sender, token, repayAmount);
    }
    
    /**
     * @dev Calculates the interest earned on a deposit (simplified)
     * @param user The address of the user
     * @param token The address of the token
     * @return The interest amount
     */
    function calculateDepositInterest(address user, address token) public view returns (uint256) {
        Deposit memory deposit = deposits[user][token];
        if (deposit.amount == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - deposit.timestamp;
        uint256 annualRate = assetConfigs[token].depositInterestRate;
        
        // Calculate interest: principal * rate * time
        // Rate is in basis points (100 = 1%), time is in seconds
        return (deposit.amount * annualRate * timeElapsed) / (10000 * 365 days);
    }
    
    /**
     * @dev Calculates the interest owed on a loan (simplified)
     * @param user The address of the user
     * @param token The address of the token
     * @return The interest amount
     */
    function calculateLoanInterest(address user, address token) public view returns (uint256) {
        Loan memory loan = loans[user][token];
        if (!loan.active) return 0;
        
        uint256 timeElapsed = block.timestamp - loan.timestamp;
        uint256 annualRate = assetConfigs[token].borrowInterestRate;
        
        // Calculate interest: principal * rate * time
        // Rate is in basis points (100 = 1%), time is in seconds
        return (loan.amount * annualRate * timeElapsed) / (10000 * 365 days);
    }
    
    /**
     * @dev Calculates the health factor of a user's position
     * @param user The address of the user
     * @param token The address of the token
     * @return The health factor (scaled by 100)
     */
    function getHealthFactor(address user, address token) external view returns (uint256) {
        Loan memory loan = loans[user][token];
        if (!loan.active) return type(uint256).max; // Max value if no loan
        
        uint256 collateralValue = loan.collateral; // Simplified - should use price oracle
        uint256 loanValue = loan.amount + calculateLoanInterest(user, token);
        
        if (loanValue == 0) return type(uint256).max;
        
        // Health factor = (collateral_value * 100) / loan_value
        return (collateralValue * 100) / loanValue;
    }
    
    /**
     * @dev Gets the deposit balance including interest
     * @param user The address of the user
     * @param token The address of the token
     * @return The total balance with interest
     */
    function getDepositWithInterest(address user, address token) external view returns (uint256) {
        return deposits[user][token].amount + calculateDepositInterest(user, token);
    }
    
    /**
     * @dev Gets the loan amount including interest
     * @param user The address of the user
     * @param token The address of the token
     * @return The total loan amount with interest
     */
    function getLoanWithInterest(address user, address token) external view returns (uint256) {
        return loans[user][token].amount + calculateLoanInterest(user, token);
    }
}
