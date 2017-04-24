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

var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/action/place-order': {
                'Awesconcepts_Awescheckout/js/awestep/model/place-order': true
            },
            'Magento_Checkout/js/model/shipping-save-processor/default': {
                'Awesconcepts_Awescheckout/js/awestep/model/shipping-save-processor': true
            },
            'Magento_Checkout/js/action/select-shipping-method': {
                'Awesconcepts_Awescheckout/js/awestep/model/select-shipping-method': true
            }
        }
    }
};