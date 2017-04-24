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
    'mage/utils/wrapper',
    'ko',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/resource-url-manager',
    'mage/storage',
    'Magento_Checkout/js/model/payment-service',
    'Magento_Checkout/js/model/payment/method-converter',
    'Magento_Checkout/js/model/error-processor',
    'Magento_Checkout/js/model/full-screen-loader',
    'Magento_Checkout/js/action/select-billing-address',
    'Magento_Checkout/js/view/summary'
], function ($,
             wrapper,
             ko,
             quote,
             resourceUrlManager,
             storage,
             paymentService,
             methodConverter,
             errorProcessor,
             fullScreenLoader,
             selectBillingAddressAction,
             summaryView
    ) {
    'use strict';

    return function (saveShippingProcessorParentObject) {
        saveShippingProcessorParentObject.isRunning = false;
        saveShippingProcessorParentObject.saveShippingInformation = function () {
            var self = this;
            if(!quote.shippingMethod() || !quote.shippingMethod().method_code || !quote.shippingMethod().carrier_code || self.isRunning){
                return;
            }
            var payload;

            if (!quote.billingAddress()) {
                selectBillingAddressAction(quote.shippingAddress());
            }
            payload = {
                addressInformation: {
                    shipping_address: quote.shippingAddress(),
                    billing_address: quote.billingAddress(),
                    extension_attributes:{
                        delivery_date: $('[name="delivery_date"]').val(),
                        delivery_comment: $('[name="delivery_comment"]').val(),
                        subscribe: $('[name="subscribe"]').val()
                    }
                }
            };

            if(quote.shippingMethod()){
                payload['addressInformation']['shipping_method_code'] = quote.shippingMethod().method_code;
                payload['addressInformation']['shipping_carrier_code'] = quote.shippingMethod().carrier_code;
            }
            self.isRunning = true;
            //$('#awescheckout-poc-lg button.checkout').prop('disabled',true);
            summaryView().isLoading(true);
            return storage.post(
                resourceUrlManager.getUrlForSetShippingInformation(quote),
                JSON.stringify(payload)
            ).done(
                function (response) {
                    quote.setTotals(response.totals);
                    self.isRunning = false;
                    //$('#awescheckout-poc-lg button.checkout').prop('disabled',false);
                    summaryView().isLoading(false);
                    $(".col-method > input").each(function () {
                        $(this).prop('disabled',false);
                    });
                }
            ).fail(
                function (response) {
                    errorProcessor.process(response);
                    self.isRunning = false;
                    summaryView().isLoading(false);
                    $(".col-method > input").each(function () {
                        $(this).prop('disabled',false);
                    });
                }
            );
        };
        return saveShippingProcessorParentObject;
    };
});