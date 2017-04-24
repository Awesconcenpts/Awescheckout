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
    'mage/utils/wrapper',
    'Magento_Checkout/js/model/shipping-save-processor/default'
], function ($,ko, wrapper,shippingSaveProcessor) {
    'use strict';

    return function (selectShippingMethodAction) {
        /** Override default place order action and add agreement_ids to request */
        return wrapper.wrap(selectShippingMethodAction, function(originalAction,shippingMethod) {
            var result = originalAction(shippingMethod);
            shippingSaveProcessor.saveShippingInformation();
            return result;
        });
    };
});