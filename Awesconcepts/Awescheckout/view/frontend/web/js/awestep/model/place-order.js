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
    'mage/utils/wrapper'
], function ($,ko, wrapper) {
    'use strict';

    return function (placeOrderAction) {
        /** Override default place order action and add agreement_ids to request */
        return wrapper.wrap(placeOrderAction, function(originalAction, paymentData, redirectOnSuccess, messageContainer) {
            // adding order comments
            var order_comments=$('[name="comment-code"]').val();
            if(paymentData.additional_data == null){
                paymentData.additional_data = {};
            }
            paymentData.additional_data.comments = order_comments;
            var buttonUpdateBillingAddress = $('.payment-method._active').find('button.action-update');
            if(buttonUpdateBillingAddress.length){
                buttonUpdateBillingAddress = buttonUpdateBillingAddress[0];
                if(buttonUpdateBillingAddress){
                    var viewModel = ko.dataFor(buttonUpdateBillingAddress);
                    if(typeof(viewModel.updateAddress) == 'function'){
                        viewModel.updateAddress();
                    }
                }
            }
            return originalAction(paymentData, redirectOnSuccess, messageContainer);
        });
    };
});
