<?php
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
namespace Awesconcepts\ Awescheckout\ Block\Checkout;

class LayoutProcessor
{
    /**
     * @param \Magento\Checkout\Block\Checkout\LayoutProcessor $subject
     * @param array $jsLayout
     * @return array
     */
    public function afterProcess(\Magento\Checkout\Block\Checkout\LayoutProcessor $subject,array  $jsLayout) {
		//address list
		$jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']['shippingAddress']['children']['address-list']['component']='Awesconcepts_Awescheckout/js/awestep/view/checkout/shipping-address/list';
		
		//total
        $jsLayout['components']['checkout']['children']['sidebar']['children']['summary']['children']
        ['totals']['component'] = 'Awesconcepts_Awescheckout/js/awestep/view/checkout/order/grand-total';
		
		//shipping
		$jsLayout['components']['checkout']['children']['sidebar']['children']['summary']['children']
        ['totals']['children']['shipping']['component'] = 'Awesconcepts_Awescheckout/js/awestep/view/checkout/order/shipping';
		
		//grand total
		$jsLayout['components']['checkout']['children']['sidebar']['children']['summary']['children']
        ['totals']['children']['grand-total']['component'] = 'Awesconcepts_Awescheckout/js/awestep/view/checkout/order/grand-total';
		
		//tax
		$jsLayout['components']['checkout']['children']['sidebar']['children']['summary']['children']
        ['totals']['children']['tax']['component'] = 'Awesconcepts_Awescheckout/js/awestep/view/checkout/order/tax';//grand-total

		foreach ($jsLayout['components']['checkout']['children']['steps']['children']['billing-step']['children']
                 ['payment']['children']['payments-list']['children'] as &$child)
        {
            if (isset($child['children']['form-fields'])) {
                $child['children']['form-fields']['children']['postcode'] = array_merge(
                    $child['children']['form-fields']['children']['postcode'],
                    ['sortOrder' => 75]
                );
				$child['children']['form-fields']['children']['city'] = array_merge(
                    $child['children']['form-fields']['children']['city'],
                    ['sortOrder' => 74]
                );
				$child['children']['form-fields']['children']['company'] = array_merge(
                    $child['children']['form-fields']['children']['company'],
                    ['sortOrder' => 200]
                );
				$child['children']['form-fields']['children']['country_id'] = array_merge(
                    $child['children']['form-fields']['children']['country_id'],
                    ['sortOrder' => 71]
                );
				
            }
        }
		
		
		
        return $jsLayout;
    }
}