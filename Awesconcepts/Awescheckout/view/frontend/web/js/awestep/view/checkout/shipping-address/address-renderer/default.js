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
define([
    'jquery',
    'ko',
    'uiComponent',
    'Magento_Checkout/js/action/select-shipping-address',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/shipping-address/form-popup-state',
    'Magento_Checkout/js/checkout-data',
    'Magento_Customer/js/customer-data'
], function($, ko, Component, selectShippingAddressAction, quote, formPopUpState, checkoutData, customerData) {
    'use strict';
    var countryData = customerData.get('directory-data');

    return Component.extend({
        defaults: {
            template: 'Awesconcepts_Awescheckout/awestep/shipping-address/address-renderer/form'
        },
        isFormInline: true,

        initObservable: function () {
            this._super();
            this.isSelected = ko.computed(function() {
                var isSelected = false;
                var shippingAddress = quote.shippingAddress();
                if (shippingAddress) {
                    isSelected = shippingAddress.getKey() == this.address().getKey();
                }
                return isSelected;
            }, this);

            return this;
        },

        getCountryName: function(countryId) {
            return (countryData()[countryId] != undefined) ? countryData()[countryId].name : "";
        },

        /** Set selected customer shipping address  */
        selectAddress: function() {
            selectShippingAddressAction(this.address());
            checkoutData.setSelectedShippingAddress(this.address().getKey());
            var checkboxSameShipping = $('.payment-method._active').find("[name='billing-address-same-as-shipping']:checked");
            if(checkboxSameShipping.length){
                var viewModelCheckboxSameShipping = ko.dataFor(checkboxSameShipping[0]);
                if(typeof(viewModelCheckboxSameShipping.useShippingAddress) == 'function'){
                    viewModelCheckboxSameShipping.useShippingAddress();
                }
            }
        },

        editAddress: function() {
            formPopUpState.isVisible(true);
            this.showPopup();

        },
        showPopup: function() {
            $('[data-open-modal="opc-new-shipping-address"]').trigger('click');
        }
    });
});
