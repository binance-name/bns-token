/** 
* Binance Name Service
* @website github.com/binance-name
* @author Team BNS <hello@binance.name>
* @license SPDX-License-Identifier: MIT
*/
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetMinterPauserUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract BNSToken is
    Initializable,
    ContextUpgradeable,
    ERC20Upgradeable,
    ERC20PermitUpgradeable,
    ERC20BurnableUpgradeable,
    ERC20VotesUpgradeable,
    ERC20PresetMinterPauserUpgradeable
{   

    string private  _name;
    string private  _symbol;
    uint256 private _initialSupply;

    /**
     * main Function 
     */
    function initialize() public initializer {

        // update the variable to match 
        _name = "Binance Name Service";
        _symbol =  "BNS";
        _initialSupply = 2_500_000_000 * (10 ** 18);

        // process deployment
        __BNSToken_init();
    }

    function __BNSToken_init() private  {

        __Context_init();

        __ERC20Permit_init(_name);
        __ERC20PresetMinterPauser_init(_name, _symbol);
         __ERC20Votes_init();

        _mint(_msgSender(), _initialSupply);
    }


    ///////////////// overrides starts ///////////////////

     function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20Upgradeable, ERC20PresetMinterPauserUpgradeable)
    {
        super._beforeTokenTransfer(from, to, amount);
    }


    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._burn(account, amount);
    }

    ///////////////////// overrides ends /////////////////

    uint256[50] private __gap;
}