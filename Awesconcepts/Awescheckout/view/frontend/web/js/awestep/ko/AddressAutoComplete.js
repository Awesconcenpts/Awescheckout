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
define(
    [
        'jquery',
        'ko',
        'underscore',
        '//maps.googleapis.com/maps/api/js?key=AIzaSyAxQGg1t2kweRcZ_UW0bHT5_pCP0rLXa4E&sensor=false&libraries=places,geometry'
    ],
    function ($, ko,_) {
        'use strict';
        ko.bindingHandlers.addressAutocomplete = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                setTimeout(function(){
                    var value = valueAccessor(), allBindings = allBindingsAccessor();

                    var options = { types: ['geocode'] };
                    ko.utils.extend(options, allBindings.autocompleteOptions)

                    var autocomplete = new google.maps.places.Autocomplete(element, options);

                    google.maps.event.addListener(autocomplete, 'place_changed', function () {
                        var result = autocomplete.getPlace();
                        value(result.formatted_address);


                        var components = _(result.address_components).groupBy(function (c) { return c.types[0]; });
                        _.each(_.keys(components), function (key) {
                            if (allBindings.hasOwnProperty(key)){
                                if(key != 'administrative_area_level_1'){
                                    allBindings[key](components[key][0].short_name);
                                } else{
                                    allBindings[key](components[key][0].long_name);
                                }

                            }

                        });
                        $(element).change();
                    });

                    if(!!navigator.geolocation && window.location.protocol == 'https:') {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            var geolocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            var circle = new google.maps.Circle({
                                center: geolocation,
                                radius: position.coords.accuracy
                            });
                            autocomplete.setBounds(circle.getBounds());
                        });
                    } else{
                        setTimeout(function(){
                            $.getJSON('https://ipinfo.io/geo', function(response) {
                                var loc = response.loc.split(',');
                                if(loc && loc.length == 2){
                                    var formkey = 'garlic:'+window.location.hostname + window.location.path + '>form:eq(1)>input.street[0]';
                                    var street = window.localStorage.getItem(formkey);
                                    if(street == null || street == ''){
                                        if(response && response.country){
                                            allBindings['country'](response.country);
                                        }
                                        if(response && response.region){
                                            allBindings['administrative_area_level_1'](response.region);
                                        }
                                        if(response && response.city){
                                            allBindings['locality'](response.city);
                                        }
                                    }

                                }
                            });
                        },2000);
                    }
                },3000);
            },
            update: function (element, valueAccessor, allBindingsAccessor) {
                ko.bindingHandlers.value.update(element, valueAccessor);
            }
        };
    }
);
