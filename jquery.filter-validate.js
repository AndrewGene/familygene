/*Created by Andrew Goodwin 3/4/2013*/
//with help from: http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes

//Think about adding min/max values for numbers

/*********IMPORTANT***********/
//DO NOT USE $('body').unbind('keyup'); in your code or you will not be able to use these methods
/*****************************/

/*Things you can filter AND validate*/
/*
    Names
    Letters (with and without spaces) -- to support spaces on entry/validation simply add "-with-spaces" to your class name
    US Currency
    Whole Numbers (positive and negative)
    Floats (positive and negative)
    Credit Card Numbers
    Phone Numbers    
    Email
    Address (street only)
    Zip Codes
    Alphanumeric (with and without spaces)
    IP Address
    MAC Address
    Latitude
    Longitude
    GPS Point (e.g. 35.092945,-92.515869)
    URLs
    Hard Password    
    One input's value equal to another input's value
*/

/*Things you can only validate*/
/*
    FYI -- You can use an existing filter to help you out before validation
           (e.g. Positive Number Filter with a Bank Routing Number validation)
    Bank Routing Number
    Regex passed in via CSS class (HTML4 version)
    Regex passed in via the "pattern" attribute (HTML5 version)
*/

/*Usage*/
/*
    <input id="txtCCNumber" type="text" maxlength="19" class="filter-credit-card regex-credit-card"/>

    <input id="txtCCType" type="text" maxlength="20" class="filter-letters"/>

    --HTML5 Version--
    <input id="txtCCExpireMonth" placeholder="mm" value="" type="text" maxlength="2" class="filter-numbers" pattern="^\d{2}$" data-error="Invalid month"/>

    --HTML4 Version--
    <input id="txtCCExpireYear" placeholder="yy" value="" type="text" maxlength="2" class="filter-numbers regex:^\d{2}$" data-error="Invalid year"/> -- REGEX CANNOT HAVE A SPACE USE '\s' INSTEAD

    --CSS Classes--
    .input-valid
    .input-invalid
    .required

    .error-summary
    .error-tooltip
    .validation-message

    --Validate Forms and response--
    var validation = ValidateContainer("#info");
    if (validation.success) {
        alert("it's all good");
    }
    else {
    --For tooltip errors--
         $.each(validation.errors, function (index, value) {
                    ShowErrorToolTip(value.input, "right", value.message, true);
         });

    --For error summary--
        ShowErrorSummary(this, "after", "The following errors need to be corrected.", validation.errors, true);
    }

    --hard password--
    *8-16 characters
    *must contain at least 4 letters, a capital letter, and a number or symbol(!,$,+,-,comma,.,@,_,space)
*/
/*******/
var validName = /^[- a-zA-Z'.]+$/;
var validCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
var validLetters = /^[a-zA-Z]+$/;
var validLettersWithSpaces = /^[a-zA-Z ]+$/;
var validAmount = /^\$?[\d]{0,3}(?:,?[\d]{3})*(?:\.[\d]{2})?$/;
var validNumbers = /^-?[\d]+$/;
var validPositiveNumbers = /^[\d]+$/;
var validFloat = /^-?[\d]*\.\d+$/;
var validPositiveFloat = /^[\d]*\.\d+$/;
var validPhone = /^(\(\d{3}\)[-.\s]?|\d{3}[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
var validZip = /^\d{5}(-\d{4})?$/;
var validEmail = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
var validStreet = /^[\d]+\s[- a-zA-Z\d#.&]+$/;
var validAlphaNumeric = /^[-\da-zA-Z]+$/;
var validAlphaNumericWithSpaces = /^[\s-\da-zA-Z]+$/;
var validIP = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
var validMAC = /^([A-Fa-f\d]{4}\.[A-Fa-f\d]{4}\.[A-Fa-f\d]{4})|([A-Fa-f\d]{12})$/;
var validGPSCoordinate = /^\-?[\d]{1,3}(\.{1}\d+)?$/
var validGPSPoint = /^\-?[\d]{1,3}(\.{1}\d+)?\,\-?[\d]{1,3}(\.{1}\d+)?$/
var validURL = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
var validHardPassword = /^.*(?=.{8,16})(?=(.*[a-zA-Z]){4})((?=.*[A-Z])(?=.*[!\$\+\-,\.@_\s])|(?=.*[0-9])(?=.*[!\$\+\-,\.@_\s])|(?=.*[A-Z])(?=.*[0-9])).*$/
$(function () {

    $("body").on("keyup.fv", "input[type=text]", function (e) {
        //$(this).css("background-color", "#fff");
        $(this).removeClass("validation-input-error");
    });

    //Name
    $("body").on("keydown.fv", ".filter-name", function (e) {
        return (IsLetter(e.which) || IsModifier(e.which) || IsSpace(e.which) || e.which === 222 || IsDash(e.which, e.shiftKey) || IsDot(e.which) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-name", function (e) {
        ValidateInputWithRegex(this, validName);
    }).on("paste.fv", ".regex-name", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validName, $this, null);
        }, 0);
    });

    //Letters -- no spaces
    $("body").on("keydown.fv", ".filter-letters", function (e) {
        return (IsLetter(e.which) || IsModifier(e.which) || IsSpace(e.which) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-letters", function (e) {
        ValidateInputWithRegex(this, validLetters);
    }).on("paste.fv", ".regex-letters", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validLetters, $this, null);
        }, 0);
    });

    //Letters -- allows spaces
    $("body").on("keydown.fv", ".filter-letters-with-spaces", function (e) {
        return (IsLetter(e.which) || IsModifier(e.which) || IsSpace(e.which) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-letters-with-spaces", function (e) {
        ValidateInputWithRegex(this, validLettersWithSpaces);
    }).on("paste.fv", ".regex-letters-with-spaces", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validLettersWithSpaces, $this, null);
        }, 0);
    });

    //US Currency
    $("body").on("keydown.fv", ".filter-currency", function (e) {
        return (IsNumber(e.which, e.shiftKey) || IsModifier(e.which) || (e.shiftKey && e.which === 52) || IsComma(e.which) || IsDot(e.which) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-currency", function (e) {
        var candidateCurrency = CleanCurrency($(this).val().toString());
        $(this).val().length > 0 ? (!validAmount.test(candidateCurrency) ? $(this).removeClass("input-valid").addClass("input-invalid") : $(this).removeClass("input-invalid").addClass("input-valid")) : $(this).removeClass("input-invalid input-valid");
        if ($(this).hasClass("input-valid") && $(this).next().hasClass("error-tooltip")) {
            $(this).next(".error-tooltip").first().remove();
        }
    }).on("paste.fv", ".regex-currency", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validAmount, $this, null);
        }, 0);
    });

    //Whole Numbers
    $("body").on("keydown.fv", ".filter-numbers", function (e) {
        return (IsNumber(e.which, e.shiftKey) || IsDash(e.which, e.shiftKey) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-numbers", function (e) {
        ValidateInputWithRegex(this, validNumbers);
    }).on("paste.fv", ".regex-numbers", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validNumbers, $this, null);
        }, 0);
    });

    //Positive Whole Numbers
    $("body").on("keydown.fv", ".filter-positive-numbers", function (e) {
        return (IsNumber(e.which, e.shiftKey) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-positive-numbers", function (e) {
        ValidateInputWithRegex(this, validPositiveNumbers);
    }).on("paste.fv", ".regex-positive-numbers", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validPositiveNumbers, $this, null);
        }, 0);
    });

    //Float
    $("body").on("keydown.fv", ".filter-float", function (e) {
        return (IsNumber(e.which, e.shiftKey) || IsDash(e.which, e.shiftKey) || IsDot(e.which) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-float", function (e) {
        ValidateInputWithRegex(this, validFloat);
    }).on("paste.fv", ".regex-float", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validFloat, $this, null);
        }, 0);
    });

    //Positive Float
    $("body").on("keydown.fv", ".filter-positive-float", function (e) {
        return (IsNumber(e.which, e.shiftKey) || IsDot(e.which) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-positive-float", function (e) {
        ValidateInputWithRegex(this, validPositiveFloat);
    }).on("paste.fv", ".regex-positive-float", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validPositiveFloat, $this, null);
        }, 0);
    });

    //Credit Card Number
    $("body").on("keydown.fv", ".filter-credit-card", function (e) {
        return (IsNumber(e.which, e.shiftKey) || IsMovementKey(e.which) || IsDash(e.which) || IsSpace(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-credit-card", function (e) {
        var candidateCardNumber = CleanCreditCard($(this).val().toString());
        $(this).val().length > 0 ? ((!validCard.test(candidateCardNumber) || !Validate(candidateCardNumber)) ? $(this).removeClass("input-valid").addClass("input-invalid") : $(this).removeClass("input-invalid").addClass("input-valid")) : $(this).removeClass("input-invalid input-valid");
        if ($(this).hasClass("input-valid") && $(this).next().hasClass("error-tooltip")) {
            $(this).next(".error-tooltip").first().remove();
        }
    }).on("paste.fv", ".regex-credit-card", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validCard, $this, CleanCreditCard($($this).val().toString()));
        }, 0);


    });

    //Bank Routing Number
    $("body").on("keyup.fv change.fv", ".regex-routing-number", function (e) {
        if ($(this).val().length > 0) {
            var routingCandidate = $(this).val().toString();
            n = 0;
            for (i = 0; i < routingCandidate.length; i += 3) {
                n += parseInt(routingCandidate.charAt(i), 10) * 3
                    + parseInt(routingCandidate.charAt(i + 1), 10) * 7
                    + parseInt(routingCandidate.charAt(i + 2), 10);
            }

            if (n != 0 && n % 10 == 0) {
                $(this).removeClass("input-invalid").addClass("input-valid");
                if ($(this).hasClass("input-valid") && $(this).next().hasClass("error-tooltip")) {
                    $(this).next(".error-tooltip").first().remove();
                }
            }
            else {
                if (IsPaste(e)) {
                    $(this).val("");
                    $(this).removeClass("input-invalid input-valid");
                }
                else {
                    $(this).removeClass("input-valid").addClass("input-invalid");
                }
            }
        }
        else {
            $(this).removeClass("input-invalid input-valid");
        }
    });

    //US Phone
    $("body").on("keydown.fv", ".filter-phone", function (e) {
        return (IsNumber(e.which, e.shiftKey) || IsModifier(e.which) || IsMovementKey(e.which) || IsSpace(e.which) || IsDash(e.which, e.shiftKey) || IsDot(e.which) || (e.shiftKey && e.which == 48) || (e.shiftKey && e.which == 57) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-phone", function (e) {
        ValidateInputWithRegex(this, validPhone);
    }).on("paste.fv", ".regex-phone", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validPhone, $this, null);
        }, 0);
    });

    //US Zip Code
    $("body").on("keydown.fv", ".filter-zip", function (e) {
        return (IsNumber(e.which, e.shiftKey) || IsDash(e.which, e.shiftKey) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-zip", function (e) {
        ValidateInputWithRegex(this, validZip);
    }).on("paste.fv", ".regex-zip", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validZip, $this, null);
        }, 0);
    });

    //Email
    $("body").on("keydown.fv", ".filter-email", function (e) {
        /*if ((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105) || (e.which === 8 || e.which === 46 || e.which === 9 || e.which === 16) || (e.which >= 35 && e.which <= 40) || e.which === 189 || e.which === 32 || e.which === 109 || e.which === 110 || e.which === 190) {
        return true;
        }
        else {
        return false;
        }*/
        return true;
    }).on("keyup.fv change.fv", ".regex-email", function (e) {
        ValidateInputWithRegex(this, validEmail);
    }).on("paste.fv", ".regex-email", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validEmail, $this, null);
        }, 0);
    });

    //Address (street)
    $("body").on("keydown.fv", ".filter-street", function (e) {
        //51: 3 (Shift + 3 == #)
        //55: 7 (Shift + 7 == &)
        return (IsNumber(e.which, e.shiftKey) || IsLetter(e.which) || IsModifier(e.which) || IsMovementKey(e.which) || IsDot(e.which) || IsSpace(e.which) || IsDash(e.which, e.shiftKey) || (e.shiftKey && e.which === 51) || (e.shiftKey && e.which === 55) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-street", function (e) {
        ValidateInputWithRegex(this, validStreet);
    }).on("paste.fv", ".regex-street", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validStreet, $this, null);
        }, 0);
    });

    //Alphanumeric -- no spaces
    $("body").on("keydown.fv", ".filter-alphanumeric", function (e) {
        return (IsLetter(e.which) || IsNumber(e.which, e.shiftKey) || IsModifier(e.which) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-alphanumeric", function (e) {
        ValidateInputWithRegex(this, validAlphaNumeric);
    }).on("paste.fv", ".regex-alphanumeric", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validAlphaNumeric, $this, null);
        }, 0);
    });

    //Alphanumeric -- allows spaces
    $("body").on("keydown.fv", ".filter-alphanumeric-with-spaces", function (e) {
        return (IsLetter(e.which) || IsNumber(e.which, e.shiftKey) || IsModifier(e.which) || IsSpace(e.which) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-alphanumeric-with-spaces", function (e) {
        ValidateInputWithRegex(this, validAlphaNumericWithSpaces);
    }).on("paste.fv", ".regex-alphanumeric-with-spaces", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validAlphaNumericWithSpaces, $this, null);
        }, 0);
    });

    //IP Address
    $("body").on("keydown.fv", ".filter-ip-address", function (e) {
        return (IsNumber(e.which, e.shiftKey) || IsDot(e.which) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-ip-address", function (e) {
        ValidateInputWithRegex(this, validIP);
    }).on("paste.fv", ".regex-ip-address", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validIP, $this, null);
        }, 0);
    });

    //MAC Address
    $("body").on("keydown.fv", ".filter-mac-address", function (e) {
        return (IsLetter(e.which) || IsNumber(e.which, e.shiftKey) || IsDot(e.which) || IsModifier(e.which) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-mac-address", function (e) {
        ValidateInputWithRegex(this, validMAC);
    }).on("paste.fv", ".regex-mac-address", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validMAC, $this, null);
        }, 0);
    });

    //Latitude
    $("body").on("keydown.fv", ".filter-latitude", function (e) {
        return (IsNumber(e.which, e.shiftKey) || IsDot(e.which) || IsDash(e.which, e.shiftKey) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-latitude", function (e) {
        if ($(this).val().length > 0) {
            if (!validGPSCoordinate.test($(this).val())) {
                $(this).removeClass("input-valid").addClass("input-invalid");
            }
            else {
                if (parseFloat($(this).val()) >= -90 && parseFloat($(this).val()) <= 90) {
                    $(this).removeClass("input-invalid").addClass("input-valid");
                    if ($(this).hasClass("input-valid") && $(this).next().hasClass("error-tooltip")) {
                        $(this).next(".error-tooltip").first().remove();
                    }
                }
                else {
                    $(this).removeClass("input-valid").addClass("input-invalid");

                }
            }
        }
        else {
            $(this).removeClass("input-invalid input-valid");
        }
    }).on("paste.fv", ".regex-latitude", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validGPSCoordinate, $this, null);
        }, 0);
    });

    //Longitude
    $("body").on("keydown.fv", ".filter-longitude", function (e) {
        return (IsNumber(e.which, e.shiftKey) || IsDot(e.which) || IsDash(e.which, e.shiftKey) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-longitude", function (e) {
        if ($(this).val().length > 0) {
            if (!validGPSCoordinate.test($(this).val())) {
                $(this).removeClass("input-valid").addClass("input-invalid");
            }
            else {
                if (parseFloat($(this).val()) >= -180 && parseFloat($(this).val()) <= 180) {
                    $(this).removeClass("input-invalid").addClass("input-valid");
                    if ($(this).hasClass("input-valid") && $(this).next().hasClass("error-tooltip")) {
                        $(this).next(".error-tooltip").first().remove();
                    }
                }
                else {
                    $(this).removeClass("input-valid").addClass("input-invalid");

                }
            }
        }
        else {
            $(this).removeClass("input-invalid input-valid");
        }
    }).on("paste.fv", ".regex-longitude", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validGPSCoordinate, $this, null);
        }, 0);
    });

    //GPS Point e.g. Latitude,Longitude
    $("body").on("keydown.fv", ".filter-gps-point", function (e) {
        return (IsNumber(e.which, e.shiftKey) || IsDot(e.which) || IsDash(e.which, e.shiftKey) || IsComma(e.which) || IsMovementKey(e.which) || IsPaste(e) || IsCopy(e) || IsEnter(e));
    }).on("keyup.fv change.fv", ".regex-gps-point", function (e) {
        if ($(this).val().length > 0) {
            if (!validGPSPoint.test($(this).val())) {
                $(this).removeClass("input-valid").addClass("input-invalid");
            }
            else {
                var pointParts = $(this).val().split(',');
                if (parseFloat(pointParts[0]) >= -90 && parseFloat(pointParts[0]) <= 90 && parseFloat(pointParts[1]) >= -180 && parseFloat(pointParts[1]) <= 180) {
                    $(this).removeClass("input-invalid").addClass("input-valid");
                    if ($(this).hasClass("input-valid") && $(this).next().hasClass("error-tooltip")) {
                        $(this).next(".error-tooltip").first().remove();
                    }
                }
                else {
                    $(this).removeClass("input-valid").addClass("input-invalid");

                }
            }
        }
        else {
            $(this).removeClass("input-invalid input-valid");
        }
    }).on("paste.fv", ".regex-gps-point", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validGPSPoint, $this, null);
        }, 0);
    });

    //URL
    $("body").on("keydown.fv", ".filter-url", function (e) {
        return true;
    }).on("keyup.fv change.fv", ".regex-url", function (e) {
        ValidateInputWithRegex(this, validURL);
    }).on("paste.fv", ".regex-url", function (e) {
        var $this = $(this);
        setTimeout(function () {
            return ValidPaste(e, validURL, $this, null);
        }, 0);
    });



    //Hard Password
    $("body").on("keydown.fv", ".filter-hard-password", function (e) {
        return (!IsPaste(e) && !IsCopy(e));
    }).on("keyup.fv change.fv", ".regex-hard-password", function (e) {
        ValidateInputWithRegex(this, validHardPassword);
    });
    
    //matches passed in via CSS class
    $("body").on("keyup.fv change.fv", "input[class*='matches:']", function (e) {
        var classParts = $(this).attr("class").toString().split(' ');
        var matchString;
        $.each(classParts, function (index, value) {
            if (value.indexOf("matches:") !== -1) {
                matchString = value.split(':')[1];
            }
        });
        var matchingObject = Normalize(matchString);
        var $this = $(this);
        $("body").off("change.fvmatch").on("change.fvmatch", matchingObject, function (e) {
            $this.change();
        });
        $(this).removeClass("input-invalid input-valid");
        if ($(this).val() === $(matchingObject).val() && $(this).val().length > 0) {
            $(this).addClass("input-valid");
        }
        else if ($(this).val().length > 0) {
            $(this).addClass("input-invalid");
        }

        if ($(this).hasClass("input-valid") && $(this).next().hasClass("error-tooltip")) {
            $(this).next(".error-tooltip").first().remove();
        }
    }).on("paste.fv", "input[class*='matches:']", function (e) {
        var $this = $(this);

        setTimeout(function () {
            var classParts = $this.attr("class").toString().split(' ');
            var matchString;
            $.each(classParts, function (index, value) {
                if (value.indexOf("matches:") !== -1) {
                    matchString = value.split(':')[1];
                }
            });
            var matchingObject = Normalize(matchString);
            var $this = $(this);
            $("body").off("change.fvmatch").on("change.fvmatch", matchingObject, function (e) {
                $this.change();
            });
            $this.removeClass("input-invalid input-valid");
            if ($this.val() === $(matchingObject).val() && $this.val().length > 0) {
                $this.addClass("input-valid");
                if ($this.hasClass("input-valid") && $this.next().hasClass("error-tooltip")) {
                    $this.next(".error-tooltip").first().remove();
                }
                return true;
            }
            else if ($this.val().length > 0) {
                $this.addClass("input-invalid");
                return false;
            }
            else {
                return false;
            }
        }, 0);
    });

    //matches pass id in via data-matches attribute
    $("body").on("keyup.fv change.fv", "input[data-matches]", function (e) {
        var matchString = $(this).attr("data-matches");
        var matchingObject = Normalize(matchString);
        var $this = $(this);
        $("body").off("change.fvmatch").on("change.fvmatch", matchingObject, function (e) {
            $this.change();
        });
        $(this).removeClass("input-invalid input-valid");
        if ($(this).val() === $(matchingObject).val() && $(this).val().length > 0) {
            $(this).addClass("input-valid");
        }
        else if ($(this).val().length > 0) {
            $(this).addClass("input-invalid");
        }

        if ($(this).hasClass("input-valid") && $(this).next().hasClass("error-tooltip")) {
            $(this).next(".error-tooltip").first().remove();
        }

    }).on("paste.fv", "input[data-matches]", function (e) {
        var $this = $(this);

        setTimeout(function () {
            var matchString = $(this).attr("data-matches");
            var matchingObject = Normalize(matchString);
            var $this = $(this);
            $("body").off("change.fvmatch").on("change.fvmatch", matchingObject, function (e) {
                $this.change();
            });
            $this.removeClass("input-invalid input-valid");
            if ($this.val() === $(matchingObject).val() && $this.val().length > 0) {
                $this.addClass("input-valid");
                if ($this.hasClass("input-valid") && $this.next().hasClass("error-tooltip")) {
                    $this.next(".error-tooltip").first().remove();
                }
                return true;
            }
            else if ($this.val().length > 0) {
                $this.addClass("input-invalid");
                return false;
            }
            else {
                return false;
            }
        }, 0);
    });

    //Regex passed in via CSS class
    $("body").on("keyup.fv change.fv", "input[class*='regex:']", function (e) {
        var classParts = $(this).attr("class").toString().split(' ');
        var regexString;
        $.each(classParts, function (index, value) {
            if (value.indexOf("regex:") !== -1) {
                regexString = value.split(':')[1];
            }
        });
        var regex = new RegExp(regexString, "i");
        ValidateInputWithRegex(this, regex);
    }).on("paste.fv", "input[class*='regex:']", function (e) {
        var $this = $(this);
        var classParts = $(this).attr("class").toString().split(' ');
        var regexString;
        $.each(classParts, function (index, value) {
            if (value.indexOf("regex:") !== -1) {
                regexString = value.split(':')[1];
            }
        });
        var regex = new RegExp(regexString, "i");
        setTimeout(function () {
            return ValidPaste(e, regex, $this, null);
        }, 0);
    });

    //Regex passed in via HTML5 pattern attribute
    $("body").on("keyup.fv change.fv", "input[pattern]", function (e) {
        var regex = new RegExp($(this).attr("pattern"), "i");
        ValidateInputWithRegex(this, regex);
    }).on("paste.fv", "input[pattern]", function (e) {
        var $this = $(this);
        var regex = new RegExp($(this).attr("pattern"), "i");
        setTimeout(function () {
            return ValidPaste(e, regex, $this, null);
        }, 0);
    });
});

function Normalize(id) {
    var container;
    if ($.type(id) === "string") {
        id.indexOf("#") !== -1 ? (container = $(id)) : (container = $("#" + id));
    }
    else {
        container = $(id)
    }

    if (container.length === 0) {        
        if ($.type(id) === "string") {
            container = $("input[id*=" + id.toString().replace("#", "") + "]");
        }
        else {
            console.log("*****IMPORTANT***** Unable to find element: " + $(id).selector + "**********");
            container = null;
        }
    }
    return container;
}

function ValidateContainer(id) {
    $(".error-summary").remove();
    $(".error-tooltip").remove();
    var container;
    var validation = new Object();
    validation.success = true;
    validation.errors = new Array();

    container = Normalize(id);

    if (container !== null) {
        if ($(container.selector + " input.input-invalid").length > 0) {
            validation.success = false;
            $.each($(container.selector + " input.input-invalid"), function (index, value) {
                var error = new Object();
                error.input = value;
                error.message = DecodeMessage(value);
                validation.errors.push(error);
            });
        }
        if ($(container.selector + " input.required").not(".input-invalid").not(".input-valid").length > 0) {
            validation.success = false;
            $.each($(container.selector + " input.required").not(".input-invalid").not(".input-valid"), function (index, value) {
                if ($(value).val().length == 0) {
                    validation.success = false;
                    var error = new Object();
                    error.input = $(value);
                    error.message = DecodeMessage(value);
                    if (error.message === "Unknown Error") {
                        error.message = "*required";
                    }
                    validation.errors.push(error);
                }
            });
        }
    }    

    return validation;
}

function DecodeMessage(value) {
    if ($(value).attr("data-error") !== undefined && $(value).attr("data-error") !== null) {
        return $(value).attr("data-error").toString();
    }
    else if ($(value).hasClass("regex-name")) {
        return "Invalid name";
    }
    else if ($(value).hasClass("regex-letters") || $(value).hasClass("regex-letters-with-spaces")) {
        return "Must be letters";
    }
    else if ($(value).hasClass("regex-currency")) {
        return "Invalid amount";
    }
    else if ($(value).hasClass("regex-numbers")) {
        return "Must be a whole number";
    }
    else if ($(value).hasClass("regex-positive-numbers")) {
        return "Must be a POSITIVE whole number";
    }
    else if ($(value).hasClass("regex-float")) {
        return "Must be a float/decimal number";
    }
    else if ($(value).hasClass("regex-positive-float")) {
        return "Must be a POSITIVE float/decimal number";
    }
    else if ($(value).hasClass("regex-credit-card")) {
        return "Invalid credit card number";
    }
    else if ($(value).hasClass("regex-routing-number")) {
        return "Invalid bank routing number";
    }
    else if ($(value).hasClass("regex-phone")) {
        return "Invalid phone number";
    }
    else if ($(value).hasClass("regex-email")) {
        return "Invalid email address";
    }
    else if ($(value).hasClass("regex-street")) {
        return "Invalid street";
    }
    else if ($(value).hasClass("regex-zip")) {
        return "Invalid zip code";
    }
    else if ($(value).hasClass("regex-alphanumeric") || $(value).hasClass("regex-alphanumeric-with-spaces")) {
        return "Must be a letter,number, or combination thereof";
    }
    else if ($(value).hasClass("regex-ip-address")) {
        return "Invalid IP address";
    }
    else if ($(value).hasClass("regex-mac-address")) {
        return "Invalid MAC address";
    }
    else if ($(value).hasClass("regex-latitude")) {
        return "Invalid latitude";
    }
    else if ($(value).hasClass("regex-longitude")) {
        return "Invalid longitude";
    }
    else if ($(value).hasClass("regex-gps-point")) {
        return "Invalid GPS point (must be in the format 35.092945,-92.515869)";
    }
    else if ($(value).hasClass("regex-hard-password")) {
        return "Invalid Username/Password";
    }
    else if ($(value).hasClass("regex-url")) {
        return "Invalid URL";
    }
    else {
        return "Unknown Error";
    }
}

function ShowErrorToolTip(inputElement, position, message, colorInput) {
    var input = Normalize(inputElement);
    if (input !== null) {
        if (colorInput !== null && colorInput === true) {
            input.not(".input-valid").addClass("validation-input-error");
        }
        if (position == "right") {
            input.after("<p class='error-tooltip' style='position:absolute; top:" + (input.position().top - input.scrollTop()) + "px; left:" + (input.position().left + input.outerWidth() + 5) + "px;'>" + message + "</p>");
        }
        else if (position == "top") {
            input.after("<p class='error-tooltip' style='position:absolute; top:" + (input.position().top - input.scrollTop() - input.outerHeight() - 5) + "px; left:" + (input.position().left) + "px;'>" + message + "</p>");
        }
        else if (position == "bottom") {
            input.after("<p class='error-tooltip' style='position:absolute; top:" + (input.position().top - input.scrollTop() + input.outerHeight() + 5) + "px; left:" + (input.position().left) + "px;'>" + message + "</p>");
        }
        /*else if (position == "left") {
        console.log("right", $(input).position().right);
        $(input).before("<p class='error-tooltip' style='position:absolute; top:" + ($(input).position().top - $(input).scrollTop()) + "px; left:" + ($(input).position().left - 200.0) + "px;'>" + message + "</p>");
        }*/
    }
}

function RemoveErrorToolTip(inputElement) {
    var input = Normalize(inputElement);
    if (input !== null) {
        input.next(".error-tooltip").first().remove();
    }
}

function ShowErrorSummary(element, beforeOrAfter, heading, errors, colorInputs) {
    var theElement = Normalize(element);
    if (theElement !== null) {
        var errorString = "<div class='error-summary'><h3>" + heading + "</h3><ul>";
        $.each(errors, function (index, value) {
            if (colorInputs !== null && colorInputs === true) {
                value.input.not(".input-valid").addClass("validation-input-error");
            }
            if (value.message.length > 0 && value.message !== "") {
                errorString += "<li>" + value.message + "</li>";
            }
        });
        errorString += "</ul></div>";
        beforeOrAfter.toUpperCase() === "BEFORE" ? theElement.before(errorString) : theElement.after(errorString);
    }
}

function ShowMessage(element, beforeOrAfter, type, header, message, timeout) {
    var theElement = Normalize(element);
    if (theElement !== null) {
        var uid = "validation-" + new Date().getTime().toString();
        var messageString = "<div id='" + uid + "' class='validation-message " + type + "'><h3>" + header + "</h3><p>";
        messageString += message;
        messageString += "</p>";
        if (timeout === null) {
            messageString += "<a class='validation-message-close-button' href='#" + uid + "' style='text-decoration:none; position:absolute; top:3px; right:3px; width:15px; height:15px; cursor:pointer;'>x</a>";
        }
        else {
            messageString += "</div>";
        }
        beforeOrAfter.toUpperCase() === "BEFORE" ? theElement.before(messageString) : theElement.after(messageString);
        if (timeout !== null) {
            //setTimeout
            setTimeout(function () {
                $("#" + uid).remove();
            }, timeout);
        }
        else {
            //show dismiss button
            $(".validation-message-close-button").click(function (e) {
                e.preventDefault();
                $($(this).attr("href")).remove();
            });
        }
    }
}

function IsLetter(key) {
    //65: a
    //90: z
    return (key >= 65 && key <= 90);
}
function IsRowNumber(key, shift) {
    //48: 0
    //57: 9
    return (key >= 48 && key <= 57 && !shift);
}
function IsNumberPadNumber(key) {
    //96: 0
    //105: 9
    return (key >= 96 && key <= 105);
}
function IsNumber(key, shift) {
    return (IsRowNumber(key, shift) || IsNumberPadNumber(key));
}
function IsDash(key, shift) {
    //109: subtract
    //189: dash
    return (key === 109 || (key === 189 && !shift));
}
function IsDot(key) {
    //110: decimal point
    //190: period
    return (key === 110 || key === 190);
}
function IsMovementKey(key) {
    //35: End
    //36: Home
    //37: Left Arrow
    //38: Up Arrow
    //39: Right Arrow
    //40: Down Arrow
    //8: Backspace
    //46: Delete
    //9: Tab
    return ((key >= 35 && key <= 40) || key === 8 || key === 46 || key === 9);
}
function IsModifier(key) {    
    //16: Shift
    return (key === 16);
}
function IsSpace(key) {    
    return key === 32;
}
function IsComma(key) {    
    return key === 188;
}
function IsPaste(e) {
    return (e.ctrlKey && e.which === 86);
}
function IsCopy(e) {
    return (e.ctrlKey && e.which === 67);
}
function IsEnter(e) {
    return (e.which === 13);
}
function ValidPaste(e, regex, input, overridingText) {
    //look for a matches in a data-matches='#someid' attribute or a class of matches:#someid
    if (!regex.test(overridingText !== null ? overridingText : $(input).val())) {
        $(input).val("");
        $(input).removeClass("input-invalid input-valid");
        return false;
    }
    else {
        return true;
    }
}
function ValidateInputWithRegex(input, regex) {
    $(input).removeClass("input-invalid input-valid");    
    if ($(input).val().length > 0) {        
        regex.test($(input).val()) ? $(input).removeClass("input-invalid").addClass("input-valid") : $(input).removeClass("input-valid").addClass("input-invalid");
    }

    if ($(input).hasClass("input-valid") && $(input).next().hasClass("error-tooltip")) {
        $(input).next(".error-tooltip").first().remove();
    }
}
function Identify(string) {
    var matches = new Array();
    if (validName.test(string)) {
        matches.push("name");
    }
    if (validCard.test(CleanCreditCard(string)) && Validate(CleanCreditCard(string))) {
        matches.push("credit card");
    }
    if (validLetters.test(string)) {
        matches.push("letters");
    }
    if (validLettersWithSpaces.test(string)) {
        matches.push("letters with spaces");
    }
    if (validAmount.test(CleanCurrency(string))) {
        matches.push("US currency");
    }
    if (validPositiveNumbers.test(string)) {
        matches.push("positive numbers");
    }
    if (validNumbers.test(string)) {
        matches.push("numbers");
    }
    if (validPositiveFloat.test(string)) {
        matches.push("positive float");
    }
    if (validFloat.test(string)) {
        matches.push("float");
    }
    if (validPhone.test(string)) {
        matches.push("phone");
    }
    if (validZip.test(string)) {
        matches.push("zip");
    }
    if (validEmail.test(string)) {
        matches.push("email");
    }
    if (validStreet.test(string)) {
        matches.push("street");
    }
    if (validAlphaNumeric.test(string)) {
        matches.push("alpha-numeric");
    }
    if (validAlphaNumericWithSpaces.test(string)) {
        matches.push("alpha-numeric with spaces");
    }
    if (validIP.test(string)) {
        matches.push("IP");
    }
    if (validMAC.test(string)) {
        matches.push("MAC");
    }
    if (validGPSCoordinate.test(string)) {
        if (parseFloat(string) >= -90 && parseFloat(string) <= 90) {
            matches.push("latitude");
        }
        else if (parseFloat(string) >= -180 && parseFloat(string) <= 180) {
            matches.push("longitude");
        }
    }
    if (validGPSPoint.test(string)) {
        var pointParts = string.split(',');
        if (parseFloat(pointParts[0]) >= -90 && parseFloat(pointParts[0]) <= 90 && parseFloat(pointParts[1]) >= -180 && parseFloat(pointParts[1]) <= 180) {
            matches.push("GPS point");
        }
    }
    if (validURL.test(string)) {
        matches.push("URL");
    }
    if (validHardPassword.test(string)) {
        matches.push("Hard password");
    }

     
    var n = 0;
    for (var i = 0; i < string.length; i += 3) {
        n += parseInt(string.charAt(i), 10) * 3
            + parseInt(string.charAt(i + 1), 10) * 7
            + parseInt(string.charAt(i + 2), 10);
    }

    if (n != 0 && n % 10 == 0) {
        matches.push("bank routing number");
    }

    if (matches.length == 0) {
        matches.push("No Matches");
    }

    return matches;
}
function CleanPhone(number) {
    if (number.indexOf(' ') !== -1) {
        number = number.replace(/\s/g, '');
    }

    if (number.indexOf('-') !== -1) {
        number = number.replace(/-/g, '');
    }

    if (number.indexOf('.') !== -1) {
        number = number.replace(/./g, '');
    }

    if (number.indexOf('(') !== -1) {
        number = number.replace(/\(/g, '');
    }

    if (number.indexOf(')') !== -1) {
        number = number.replace(/\)/g, '');
    }
    return number;
}
function CleanCreditCard(number) {
    if (number.indexOf(' ') !== -1) {
        number = number.replace(/\s/g, '');
    }
    if (number.indexOf('-') !== -1) {
        number = number.replace(/-/g, '');
    }
    return number;
}
function CleanCurrency(number) {
    if (number.indexOf('$') !== -1) {
        number = number.replace(/\$/g, '');
    }
    if (number.indexOf(',') !== -1) {
        number = number.replace(/\,/g, '');
    }
    return number;
}
function Calculate(Luhn) {
    var sum = 0;
    for (i = 0; i < Luhn.length; i++) {
        sum += parseInt(Luhn.substring(i, i + 1));
    }
    var delta = new Array(0, 1, 2, 3, 4, -4, -3, -2, -1, 0);
    for (i = Luhn.length - 1; i >= 0; i -= 2) {
        var deltaIndex = parseInt(Luhn.substring(i, i + 1));
        var deltaValue = delta[deltaIndex];
        sum += deltaValue;
    }
    var mod10 = sum % 10;
    mod10 = 10 - mod10;
    if (mod10 == 10) {
        mod10 = 0;
    }
    return mod10;
}
function Validate(Luhn) {
    var LuhnDigit = parseInt(Luhn.substring(Luhn.length - 1, Luhn.length));
    var LuhnLess = Luhn.substring(0, Luhn.length - 1);
    if (Calculate(LuhnLess) == parseInt(LuhnDigit)) {
        return true;
    }
    return false;
}
