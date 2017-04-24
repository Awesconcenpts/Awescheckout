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
	'Magento_Checkout/js/model/checkout-data-resolver',
	'Magento_Checkout/js/model/payment-service',
	'Magento_Checkout/js/model/shipping-save-processor/default',
	'Magento_Checkout/js/action/get-payment-information',
	'Awesconcepts_Awescheckout/js/jquery.livequery.min',
	'Magento_Checkout/js/model/step-navigator'
], function ($, ko, checkoutDataResolver, paymentService, shippingSaveProcessor, getPaymentInformation) {
	'use strict';
	return function (config) {
		var AweSteps = {
			timerSaveShippingAddress: null,
			getInit: function () {
				$(document).on('keyup', 'input[name="street[0]"],input[name="street[1]"],input[name="city"],input[name="region"],select[name="country_id"],input[name="postcode"],select[name="region_id"],input[name="delivery_date"],textarea[name="delivery_comment"]', function (e) {
					clearTimeout(AweSteps.timerSaveShippingAddress);
					AweSteps.timerSaveShippingAddress = setTimeout(function () {
						checkoutDataResolver.resolveShippingAddress();

						var checkboxSameShipping = $('.payment-method._active').find("[name='billing-address-same-as-shipping']:checked");
						if (checkboxSameShipping.length) {
							var viewModelCheckboxSameShipping = ko.dataFor(checkboxSameShipping[0]);
							if (typeof (viewModelCheckboxSameShipping.useShippingAddress) == 'function') {
								viewModelCheckboxSameShipping.useShippingAddress();
								var checkboxSameShipping = $('.payment-method._active')
									.find("[name='billing-address-same-as-shipping']:checked");
								var viewModelCheckboxSameShipping = ko.dataFor(checkboxSameShipping[0]);
								viewModelCheckboxSameShipping.useShippingAddress();

							}
						}
					}, 2000);

				});
			},
			getReady: function (shippingForm) {
				if ($("[name='payment[method]']").length > 0) {
					$("[name='payment[method]']").on('change', function () {
						var self = $(this);
						var placeOrderButton = $(this).parent().parent().find('button.checkout');
						var clonePlaceButton = placeOrderButton.clone(true);
						var clonePlaceButtonMobile = placeOrderButton.clone(true);
						var placeOrder = function () {
							var shippingView = ko.dataFor(shippingForm);
							var buttonUpdateBillingAddress = $('.payment-method._active').find('button.action-update');
							var checkboxSameShipping = $('.payment-method._active').find("[name='billing-address-same-as-shipping']:checked");
							var buttonPlaceOrder = $('.payment-method._active').find('button.checkout');

							if (buttonPlaceOrder.length) {
								buttonPlaceOrder = buttonPlaceOrder[0];
								var viewModelPlaceOrder = ko.dataFor(buttonPlaceOrder);
								if (checkboxSameShipping.length) {
									if (typeof (viewModelPlaceOrder.placeOrder) == 'function') {
										if (!$('#shipping').is(':visible')) {
											viewModelPlaceOrder.placeOrder();
										} else {
											if (shippingView.validateShippingInformation()) {
												viewModelPlaceOrder.placeOrder();
											}
										}
									}
								} else {
									if (buttonUpdateBillingAddress.length) {
										buttonUpdateBillingAddress = buttonUpdateBillingAddress[0];
										if (buttonUpdateBillingAddress) {
											var viewModel = ko.dataFor(buttonUpdateBillingAddress);
											if (typeof (viewModel.updateAddress) == 'function') {
												viewModel.updateAddress();
												if (!viewModel.source.get('params.invalid')) {

													if (buttonUpdateBillingAddress) {
														if (typeof (viewModelPlaceOrder.placeOrder) == 'function') {
															if (!$('#shipping').is(':visible')) {
																viewModelPlaceOrder.placeOrder();
															} else {
																if (shippingView.validateShippingInformation()) {
																	viewModelPlaceOrder.placeOrder();
																}
															}

														}
													}
												}
											}
										}
									}
								}
							}
						}

						if ($(this).val() != 'braintree' && $(this).val() != 'braintree_paypal') {
							clonePlaceButton.off('click');
							clonePlaceButton.click(placeOrder);

							clonePlaceButtonMobile.off('click');
							clonePlaceButtonMobile.click(placeOrder);
						}

						if ($(this).val() == 'braintree_paypal') {
							setInterval(function () {
								var paypalText = $('.payment-method-description').text();
								if (paypalText && paypalText.length > 0) {
									$('[data-button="paypal-place"]:last').show();
									$('[data-button="place"]:last').hide();
								} else {
									$('[data-button="paypal-place"]:last').hide();
									$('[data-button="place"]:last').show();
								}
							}, 1000);
						}

						$('#awescheckout-poc-lg').html(clonePlaceButton);
						$('#awescheckout-poc-sm').html(clonePlaceButtonMobile);
						clonePlaceButton.prop('disabled', false).removeClass('disabled');
						clonePlaceButtonMobile.prop('disabled', false).removeClass('disabled');

						if (!$('#shipping').is(':visible')) {
							$('.billing-address-details').attr('style', 'display: block !important');
						} else {

							var radioSameShipping = $('#billing-address-same-as-shipping-' + $(this).val()).get(0);
							if (radioSameShipping) {
								var modelRadioShipping = ko.dataFor(radioSameShipping);
								if (modelRadioShipping) {
									modelRadioShipping.isAddressSameAsShipping(modelRadioShipping.isAddressDetailsVisible());
									modelRadioShipping.useShippingAddress();
								}
							}

						}
					});
					if ($("[name='payment[method]']:checked").length == 0) {
						var paymentSelectedRadio = $("[name='payment[method]'][value='" + config.defaultPaymentMethod + "']").get(0);

						if (paymentSelectedRadio) {
							var paymentSelectedRadioViewModel = ko.dataFor(paymentSelectedRadio);
							if (paymentSelectedRadioViewModel && paymentSelectedRadioViewModel.selectPaymentMethod) {
								paymentSelectedRadioViewModel.selectPaymentMethod();
							}
							$(paymentSelectedRadio).change();
						} else {
							paymentSelectedRadio = $("[name='payment[method]']:first").get(0);
							var paymentSelectedRadioViewModel = ko.dataFor(paymentSelectedRadio);
							if (paymentSelectedRadioViewModel && paymentSelectedRadioViewModel.selectPaymentMethod) {
								paymentSelectedRadioViewModel.selectPaymentMethod();
							}
							$(paymentSelectedRadio).change();
						}
					}

				}

				if ($(".col-method > input").length > 0) {
					var shippingSelectedRadio = $("#s_method_" + config.defaultShippingMethod).get(0);

					if (shippingSelectedRadio) {
						var shippingSelectedRadioViewModel = ko.dataFor(shippingSelectedRadio);
						var shippingSelectedRadioContext = ko.contextFor(shippingSelectedRadio);
						if (shippingSelectedRadioContext && shippingSelectedRadioContext.$parent && shippingSelectedRadioContext.$parent.selectShippingMethod) {
							shippingSelectedRadioContext.$parent.selectShippingMethod(shippingSelectedRadioViewModel);
						}
					} else {
						shippingSelectedRadio = $(".col-method > input").first().get(0);
						var shippingSelectedRadioViewModel = ko.dataFor(shippingSelectedRadio);
						if (shippingSelectedRadioViewModel && shippingSelectedRadioViewModel.$parent && shippingSelectedRadioViewModel.$parent.selectShippingMethod) {
							shippingSelectedRadioViewModel.$parent.selectShippingMethod();
						}
					}
				}
			},
			getActive: function (shippingForm) {
				if ($("[name='payment[method]']").length) {
					AweSteps.getReady(shippingForm);
				} else {
					setTimeout(function () {
						AweSteps.getActive(shippingForm);
					}, 50);
				}
			}
		};
		$('#checkout').livequery('#co-shipping-form',
			function (shippingForm) {
				getPaymentInformation().done(function () {
					AweSteps.getActive(shippingForm);
				});
			}
		);
		AweSteps.getInit();
	};
});