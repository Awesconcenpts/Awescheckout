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
        'ko',
        'Magento_Checkout/js/view/summary/abstract-total',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/model/totals'
    ],
    function (ko, Component, quote, totals) {
        "use strict";
        var isTaxDisplayedInGrandTotal = window.checkoutConfig.includeTaxInGrandTotal;
        var isFullTaxSummaryDisplayed = window.checkoutConfig.isFullTaxSummaryDisplayed;
        var isZeroTaxDisplayed = window.checkoutConfig.isZeroTaxDisplayed;
        return Component.extend({
            defaults: {
                isTaxDisplayedInGrandTotal: isTaxDisplayedInGrandTotal,
                notCalculatedMessage: 'Not yet calculated',
                template: 'Magento_Tax/checkout/summary/tax'
            },
            totals: quote.getTotals(),
            isFullTaxSummaryDisplayed: isFullTaxSummaryDisplayed,
            ifShowValue: function() {
                if (this.isFullMode() && this.getPureValue() == 0) {
                    return isZeroTaxDisplayed;
                }
                return true;
            },
            ifShowDetails: function() {
                if (!this.isFullMode()) {
                    return false;
                }
                return this.getPureValue() > 0 && isFullTaxSummaryDisplayed;
            },
            getPureValue: function() {
                var amount = 0;
                if (this.totals()) {
                    var taxTotal = totals.getSegment('tax');
                    if (taxTotal) {
                        amount = taxTotal.value;
                    }
                }
                return amount;
            },
            isCalculated: function() {
                return this.totals() && this.isFullMode() && null != totals.getSegment('tax');
            },
            getValue: function() {
                if (!this.isCalculated()) {
                    return this.notCalculatedMessage;
                }
                var amount = totals.getSegment('tax').value;
                return this.getFormattedPrice(amount);
            },
            formatPrice: function(amount) {
                return this.getFormattedPrice(amount);
            },
            getDetails: function() {
                var taxSegment = totals.getSegment('tax');
                if (taxSegment && taxSegment.extension_attributes) {
                    return taxSegment.extension_attributes.tax_grandtotal_details;
                }
                return [];
            },
            isFullMode: function() {
                if(!this.getTotals()) {
                    return false;
                }
                return true;
            }
        });
    }
);
