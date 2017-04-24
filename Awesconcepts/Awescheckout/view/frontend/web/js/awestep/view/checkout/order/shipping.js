/*
 * Awesconcepts.
 *
 * NOTICE OF LICENSE
 *
 *
 * =================================================================
 *                 MAGENTO EDITION USAGE NOTICE
 * =================================================================
 * This package designed for Magento COMMUNITY edition
 * Awesconcepts does not guarantee correct work of this extension
 * on any other Magento edition except Magento COMMUNITY edition.
 * Awesconcepts does not provide extension support in case of
 * incorrect edition usage.
 * =================================================================
 *
 * @category   Awesconcepts
 * @package    Awesconcepts_Awestep
 * @author     Awesconcepts Team
 * @copyright  Copyright (c) 2014-2017 Awesconcepts. ( http://awesconcepts.com )
*/
define(
    [
        'jquery',
        'Magento_Tax/js/view/checkout/summary/shipping',
        'Magento_Checkout/js/model/quote'
    ],
    function ($, Component, quote) {
        return Component.extend({
            isFullMode: function() {
                if (!this.getTotals()) {
                    return false;
                }
                return true;
            }
        });
    }
);
