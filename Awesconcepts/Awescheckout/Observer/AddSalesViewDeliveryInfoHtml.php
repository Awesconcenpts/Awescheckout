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
namespace Awesconcepts\Awescheckout\Observer;

use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;

class AddSalesViewDeliveryInfoHtml implements ObserverInterface
{

    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    protected $_objectManager;

    /**
     * @param \Magento\Framework\ObjectManagerInterface $objectmanager
     */
    public function __construct(\Magento\Framework\ObjectManagerInterface $objectmanager)
    {
        $this->_objectManager = $objectmanager;
    }

    public function execute(EventObserver $observer)
    {
        if($observer->getElementName() == 'order_shipping_view')
        {
            $orderShippingViewBlock = $observer->getLayout()->getBlock($observer->getElementName());
            $order = $orderShippingViewBlock->getOrder();
            $localeDate = $this->_objectManager->create('\Magento\Framework\Stdlib\DateTime\TimezoneInterface');
            $formattedDate = $localeDate->formatDate(
                $localeDate->scopeDate(
                    $order->getStore(),
                    $order->getDeliveryDate(),
                    true
                ),
                \IntlDateFormatter::MEDIUM,
                false
            );

            $deliveryBlock = $this->_objectManager->create('Magento\Framework\View\Element\Template');
            $deliveryBlock->setDeliveryDate($formattedDate);
			$deliveryBlock->setDeliveryComment($order->getDeliveryComment());
            $deliveryBlock->setTemplate('Awesconcepts_Awescheckout::Order/View/DeliveryInfo.phtml');
            $html = $observer->getTransport()->getOutput() . $deliveryBlock->toHtml();
            $observer->getTransport()->setOutput($html);
        }
    }
}