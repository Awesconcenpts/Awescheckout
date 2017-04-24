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

class AddOrderDeliveryHtmlShippingBlock implements ObserverInterface
{
    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    protected $objectManager;

    /**
     * @param \Magento\Framework\ObjectManagerInterface $objectManager
     */
    public function __construct(\Magento\Framework\ObjectManagerInterface $objectManager)
    {
        $this->objectManager = $objectManager;
    }

    public function execute(EventObserver $observer)
    {
        if($observer->getElementName() == 'sales.order.info') {
            $orderShippingViewBlock = $observer->getLayout()->getBlock($observer->getElementName());
            $order = $orderShippingViewBlock->getOrder();
            $localeDate = $this->objectManager->create('\Magento\Framework\Stdlib\DateTime\TimezoneInterface');
            if($order->getDeliveryDate() != '0000-00-00 00:00:00') {
                $formattedDate = $localeDate->formatDateTime(
                    $order->getDeliveryDate(),
                    \IntlDateFormatter::MEDIUM,
                    \IntlDateFormatter::MEDIUM,
                    null,
                    $localeDate->getConfigTimezone(
                        \Magento\Store\Model\ScopeInterface::SCOPE_STORE,
                        $order->getStore()->getCode()
                    )
                );
            } else {
                $formattedDate = __('N/A');
            }

            $deliveryDateBlock = $this->objectManager->create('Magento\Framework\View\Element\Template');
            $deliveryDateBlock->setDeliveryDate($formattedDate);
            $deliveryDateBlock->setDeliveryComment($order->getDeliveryComment());
            $deliveryDateBlock->setTemplate('Awesconcepts_Awescheckout::Order/View/DeliveryInfo.phtml');
            $html = $observer->getTransport()->getOutput() . $deliveryDateBlock->toHtml();
            $observer->getTransport()->setOutput($html);
        }
    }
}