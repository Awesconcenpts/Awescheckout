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
    'underscore',
    'uiRegistry',
    'Magento_Ui/js/form/element/boolean',
    'Magento_Checkout/js/model/shipping-save-processor/default'
], function ($,_, registry, Abstract,shippingSaveProcessor) {
    'use strict';

    return Abstract.extend({
        defaults: {
            template: 'Awesconcepts_Awescheckout/awestep/form/element/subscribe'
        },
        /**
         * @returns {*|void|Element}
         */
        initObservable: function () {
            return this._super();//.observe('checked value');
        },
        /**
         * Choose notice on update
         *
         * @returns void
         */
        onUpdate: function () {
            this._super();
            //var checkedNoticeNumber = Number(this.checked());
            //shippingSaveProcessor.saveShippingInformation();
            //debugger;
        }
    });
});