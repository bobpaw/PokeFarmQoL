class PublicFieldsPage extends Page {
    constructor() {
        super('QoLPublicFields', {
            fieldByBerry: false,
            fieldByMiddle: false,
            fieldByGrid: false,
            fieldClickCount: true,
            fieldCustom: "",
            fieldType: "",
            fieldNature: "",
            fieldEggGroup: "",
            fieldNewPokemon: true,
            fieldShiny: true,
            fieldAlbino: true,
            fieldMelanistic: true,
            fieldPrehistoric: true,
            fieldDelta: true,
            fieldMega: true,
            fieldStarter: true,
            fieldCustomSprite: true,
            fieldMale: true,
            fieldFemale: true,
            fieldNoGender: true,
            fieldCustomPokemon: true,
            fieldCustomPng: false,
            fieldItem: true,
            customItem: true,
        }, 'fields/');
        this.customArray = [];
        this.typeArray = [];
        this.natureArray = [];
        this.eggGroupArray = [];
        this.TYPES_NAME = 'typeTypes'
        this.NATURES_NAME = 'natureTypes'
        this.EGG_GROUPS_NAME = 'eggGroupTypes'
        const obj = this
        this.observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                obj.customSearch();
            });
        });
    }

    settingsChange(element, textElement, customClass, typeClass, arrayName) {
	if(super.settingsChange(element, textElement, customClass, typeClass, arrayName) === false) {
	    return false;
	}

	const mutuallyExclusive = ["fieldByBerry", "fieldByMiddle", "fieldByGrid"]
        const idx = mutuallyExclusive.indexOf(element)
        if(idx > -1) {
            for(let i = 0; i < mutuallyExclusive.length; i++) {
                if(i !== idx) {
                    this.settings[mutuallyExclusive[i]] = false;
                }
            }
            return true;
        }
	else { return false; }
    }

    setupHTML() {
        document.querySelector('#field_field').insertAdjacentHTML('beforebegin', TEMPLATES.fieldSortHTML);
        document.querySelector('#field_field').insertAdjacentHTML('afterend', TEMPLATES.fieldSearchHTML);

        const theField = Helpers.textSearchDivWithCheckboxes('numberDiv', 'fieldCustom', 'removeFieldSearch')
        const theType = Helpers.selectSearchDiv('typeNumber', 'types', 'fieldType', GLOBALS.TYPE_OPTIONS,
                                             'removeTypeSearch', this.TYPES_NAME, 'typeArray');
        const theNature = Helpers.selectSearchDiv('natureNumber', 'natures', 'fieldNature', GLOBALS.NATURE_OPTIONS,
                                               'removeNatureSearch', this.NATURES_NAME, 'natureArray')
        const theEggGroup = Helpers.selectSearchDiv('eggGroupNumber', 'eggGroups', 'fieldEggGroup', GLOBALS.EGG_GROUP_OPTIONS,
                                                 'removeEggGroupSearch', this.EGG_GROUPS_NAME, 'eggGroupArray')
        this.customArray = this.settings.fieldCustom.split(',');
        this.typeArray = this.settings.fieldType.split(',');
        this.natureArray = this.settings.fieldNature.split(',');
        this.eggGroupArray = this.settings.fieldEggGroup.split(',');
        Helpers.setupFieldArrayHTML(this.customArray, 'searchkeys', theField, 'numberDiv');
        Helpers.setupFieldArrayHTML(this.typeArray, this.TYPES_NAME, theType, 'typeNumber');
        Helpers.setupFieldArrayHTML(this.natureArray, this.NATURES_NAME, theNature, 'natureNumber');
        Helpers.setupFieldArrayHTML(this.eggGroupArray, this.EGG_GROUPS_NAME, theEggGroup, 'eggGroupNumber');
    }
    setupCSS() {
        let fieldOrderCssColor = $('#field_field').css('background-color');
        let fieldOrderCssBorder = $('#field_field').css('border');
        $("#fieldorder").css("background-color", ""+fieldOrderCssColor+"");
        $("#fieldorder").css("border", ""+fieldOrderCssBorder+"");
        $("#fieldsearch").css("background-color", ""+fieldOrderCssColor+"");
        $("#fieldsearch").css("border", ""+fieldOrderCssBorder+"");

        // accordian CSS
        $(".accordian").css("background-color", "#eee")
        $(".accordian").css("color", "#444")
        $(".accordian").css("cursor", "pointer")
        $(".accordian").css("padding", "18px")
        $(".accordian").css("width", "100%")
        $(".accordian").css("border", "none")
        $(".accordian").css("text-align", "left")
        $(".accordian").css("outline", "none")
        $(".accordian").css("font-size", "15px")
        $(".accordian").css("transition", "0.4s")
        $(".active,.accordion:hover").css("background-color", "#ccc")
        $(".accordianPanel").css("padding", "0 18px")
        $(".accordianPanel").css("display", "none")
        $(".accordianPanel").css("background-color", "white")
        $(".accordianPanel").css("overflow", "hidden")
    }
    setupObserver() {
        this.observer.observe(document.querySelector('#field_field'), {
            childList: true,
            attributeFilter: ['class'],
        });
        this.observer.observe(document.querySelector('#fieldorder'), {
            childList: true,
        });
    }
    setupHandlers() {
        const obj = this
        $(window).on('load', (function() {
            obj.customSearch();
        }));

        $(document).on('click input', '#fieldorder, #field_field, #field_berries, #field_nav', (function() { //field sort
            obj.customSearch();
        }));

        document.addEventListener("keydown", function() {
            obj.customSearch();
        });

        $(document).on('click', '#addFieldSearch', (function() { //add field text field
            obj.fieldAddTextField();
        }));

        $(document).on('click', '#removeFieldSearch', (function() { //remove field text field
            obj.fieldRemoveTextField(this, $(this).parent().find('input').val());
        }));

        $(document).on('click', '#addTypeSearch', (function() { //add field type list
            obj.addSelectSearch('typeNumber', 'types', 'fieldType', GLOBALS.TYPE_OPTIONS, 'removeTypeSearch', obj.TYPES_NAME, 'typeArray');
            obj.customSearch();
        }));

        $(document).on('click', '#removeTypeSearch', (function() { //remove field type list
            obj.typeArray = obj.removeSelectSearch(obj.typeArray, this, $(this).parent().find('select').val(), 'fieldType', obj.TYPES_NAME)
            obj.saveSettings();
            obj.customSearch();
        }));

        $(document).on('click', '#addNatureSearch', (function() { //add field nature search
            obj.addSelectSearch('natureNumber', 'natures', 'fieldNature', GLOBALS.NATURE_OPTIONS, 'removeNatureSearch', obj.NATURES_NAME, 'natureArray')
            obj.customSearch();
        }));

        $(document).on('click', '#removeNatureSearch', (function() { //remove field nature search
            obj.natureArray = obj.removeSelectSearch(obj.natureArray, this, $(this).parent().find('select').val(), 'fieldNature', obj.NATURES_NAME)
            obj.saveSettings();
            obj.customSearch();
        }));

        $(document).on('click', '#addEggGroupSearch', (function() { //add egg group nature search
            obj.addSelectSearch('eggGroupNumber', 'eggGroups', 'fieldEggGroup', GLOBALS.EGG_GROUP_OPTIONS, 'removeEggGroupSearch', obj.EGG_GROUPS_NAME, 'eggGroupArray')
            obj.customSearch();
        }));

        $(document).on('click', '#removeEggGroupSearch', (function() { //remove egg group nature search
            obj.eggGroupArray = obj.removeSelectSearch(obj.eggGroupArray, this, $(this).parent().find('select').val(), 'fieldEggGroup', obj.EGG_GROUPS_NAME)
            obj.saveSettings();
            obj.customSearch();
        }));

        $(document).on('change', '.qolsetting', (function() {
            obj.loadSettings();
            obj.customSearch();
            obj.saveSettings();
        }));

        $(document).on('input', '.qolsetting', (function() { //Changes QoL settings
            obj.settingsChange(this.getAttribute('data-key'),
                               $(this).val(),
                               $(this).parent().parent().attr('class'),
                               $(this).parent().attr('class'),
                               (this.hasAttribute('array-name') ? this.getAttribute('array-name') : ''));
            obj.customSearch();
            obj.saveSettings();
        }));

        $('input.qolalone').on('change', function() { //only 1 textbox may be true
            $('input.qolalone').not(this).prop('checked', false);
        });
    }
    // specific
    customSearch() {
        let dexData = GLOBALS.DEX_DATA;

        /////////////////////////////////////////////////
        //////////////////// sorting ////////////////////
        /////////////////////////////////////////////////
        if (this.settings.fieldByBerry === true) { //sort field by berries
            $('.fieldmon').removeClass("qolSortMiddle");
            $('.field').removeClass("qolGridField");
            $('.fieldmon').removeClass("qolGridPokeSize");
            $('.fieldmon>img').removeClass("qolGridPokeImg");

            if($('#field_field [data-flavour*="any-"]').length) {
                $('#field_field [data-flavour*="any-"]').addClass("qolAnyBerry");
            }
            if($('#field_field [data-flavour*="sour-"]').length) {
                $('#field_field [data-flavour*="sour-"]').addClass("qolSourBerry");
            }
            if($('#field_field [data-flavour*="spicy-"]').length) {
                $('#field_field [data-flavour*="spicy-"]').addClass("qolSpicyBerry");
            }
            if($('#field_field [data-flavour*="dry-"]').length) {
                $('#field_field [data-flavour*="dry-"]').addClass("qolDryBerry");
            }
            if($('#field_field [data-flavour*="sweet-"]').length) {
                $('#field_field [data-flavour*="sweet-"]').addClass("qolSweetBerry");
            }
            if($('#field_field [data-flavour*="bitter-"]').length) {
                $('#field_field [data-flavour*="bitter-"]').addClass("qolBitterBerry");
            }
        }
        else if (this.settings.fieldByMiddle === true) { //sort field in the middle
            $('#field_field [data-flavour*="any-"]').removeClass("qolAnyBerry");
            $('#field_field [data-flavour*="sour-"]').removeClass("qolSourBerry");
            $('#field_field [data-flavour*="spicy-"]').removeClass("qolSpicyBerry");
            $('#field_field [data-flavour*="dry-"]').removeClass("qolDryBerry");
            $('#field_field [data-flavour*="sweet-"]').removeClass("qolSweetBerry");
            $('#field_field [data-flavour*="bitter-"]').removeClass("qolBitterBerry");
            $('.field').removeClass("qolGridField");
            $('.fieldmon').removeClass("qolGridPokeSize");
            $('.fieldmon>img').removeClass("qolGridPokeImg");

            $('.fieldmon').addClass("qolSortMiddle");
        }
        else if (this.settings.fieldByGrid === true) { //sort field in a grid
            $('#field_field [data-flavour*="any-"]').removeClass("qolAnyBerry");
            $('#field_field [data-flavour*="sour-"]').removeClass("qolSourBerry");
            $('#field_field [data-flavour*="spicy-"]').removeClass("qolSpicyBerry");
            $('#field_field [data-flavour*="dry-"]').removeClass("qolDryBerry");
            $('#field_field [data-flavour*="sweet-"]').removeClass("qolSweetBerry");
            $('#field_field [data-flavour*="bitter-"]').removeClass("qolBitterBerry");
            $('.fieldmon').removeClass("qolSortMiddle");

            $('.field').addClass("qolGridField");
            $('.fieldmon').addClass("qolGridPokeSize");
            $('.fieldmon>img').addClass("qolGridPokeImg");
        }
        else {
            $('#field_field [data-flavour*="any-"]').removeClass("qolAnyBerry");
            $('#field_field [data-flavour*="sour-"]').removeClass("qolSourBerry");
            $('#field_field [data-flavour*="spicy-"]').removeClass("qolSpicyBerry");
            $('#field_field [data-flavour*="dry-"]').removeClass("qolDryBerry");
            $('#field_field [data-flavour*="sweet-"]').removeClass("qolSweetBerry");
            $('#field_field [data-flavour*="bitter-"]').removeClass("qolBitterBerry");
            $('.fieldmon').removeClass("qolSortMiddle");
            $('.field').removeClass("qolGridField");
            $('.fieldmon').removeClass("qolGridPokeSize");
            $('.fieldmon>img').removeClass("qolGridPokeImg");
        }

        //Pokémon click counter
        if (this.settings.fieldClickCount === false) {
            $('#pokemonclickcount').remove();
        } else if (this.settings.fieldClickCount === true) {
            let pokemonFed = $(".fieldmon").map(function() { return $(this).attr("data-fed"); }).get();

            let pokemonClicked = 0;
            for (var i = 0; i < pokemonFed.length; i++) {
                pokemonClicked += pokemonFed[i] << 0;
            }

            let pokemonInField = $('.fieldpkmncount').text();

            $('#pokemonclickcount').remove(); //make sure no duplicates are being produced
            document.querySelector('.fielddata').insertAdjacentHTML('beforeend','<div id="pokemonclickcount">'+pokemonClicked+' / '+pokemonInField+' Clicked</div>');
            if (JSON.stringify(pokemonClicked) === pokemonInField) {
                $('#pokemonclickcount').css({"color" : "#059121"});
            }
            if (pokemonClicked !== JSON.parse(pokemonInField)) {
                $('#pokemonclickcount').css({"color" : "#a30323"});
            }
        }

        /////////////////////////////////////////////////
        /////////////////// searching ///////////////////
        /////////////////////////////////////////////////
        let bigImgs = document.querySelectorAll('.publicfoundme')
        if(bigImgs !== null) {
            bigImgs.forEach((b) => {$(b).removeClass('publicfoundme')})
        }

        const filteredTypeArray = this.typeArray.filter(v=>v!='');
        const filteredNatureArray = this.natureArray.filter(v=>v!='');
        const filteredEggGroupArray = this.eggGroupArray.filter(v=>v!='');

        //loop to find all the types
        if (filteredTypeArray.length > 0 || filteredNatureArray.length > 0 || filteredEggGroupArray.length > 0) {
            $('.fieldmon').each(function() {
                let searchPokemonBigImg = $(this)[0].childNodes[0];
                const tooltip_data = Helpers.parseFieldPokemonTooltip($(searchPokemonBigImg).parent().next()[0])

                let searchPokemon = tooltip_data.species;
                let searchPokemonIndex = dexData.indexOf('"'+searchPokemon+'"');
                let searchTypeOne = tooltip_data.types[0] + ""
                let searchTypeTwo = (tooltip_data.types.length > 1) ? tooltip_data.types[1] + "": ""

                let searchNature = GLOBALS.NATURE_LIST[tooltip_data.nature];

                let searchEggGroup = $($(this).next()[0].querySelector('.fieldmontip')).
                    children(':contains(Egg Group)')[0].innerText.slice("Egg Group: ".length)

                for (let i = 0; i < filteredTypeArray.length; i++) {
                    if ((searchTypeOne === filteredTypeArray[i]) || (searchTypeTwo === filteredTypeArray[i])) {
                        $(searchPokemonBigImg).addClass('publicfoundme');
                    }
                }

                for (let i = 0; i < filteredNatureArray.length; i++) {
                    if(searchNature === GLOBALS.NATURE_LIST[filteredNatureArray[i]]) {
                        $(searchPokemonBigImg).addClass('publicfoundme');
                    }
                }

                for (let i = 0; i < filteredEggGroupArray.length; i++) {
                    let value = GLOBALS.EGG_GROUP_LIST[filteredEggGroupArray[i]];
                    if(searchEggGroup === value ||
                       searchEggGroup.indexOf(value + "/") > -1 ||
                       searchEggGroup.indexOf("/" + value) > -1) {
                        $(searchPokemonBigImg).addClass('publicfoundme');
                    }
                }
            }) // each
        } // end            
    } // customSearch
    addSelectSearch(cls, name, data_key, options, id, divParent, array_name) {
        const theList = Helpers.selectSearchDiv(cls, name, data_key, options, id, divParent, array_name)
        let number = $(`#${divParent}>div`).length;
        $(`#${divParent}`).append(theList);
        $(`.${cls}`).removeClass(cls).addClass(""+number+"");
    }
    removeSelectSearch(arr, byebye, key, settingsKey, divParent) {
        arr = $.grep(arr, function(value) { return value != key; });
        this.settings[settingsKey] = arr.toString();

        $(byebye).parent().remove();

        for(let i = 0; i < $(`#${divParent}>div`).length; i++) {
            let rightDiv = i + 1;
            $('.'+i+'').next().removeClass().addClass(''+rightDiv+'');
        }

        return arr;
    }
    fieldAddTextField() {
        const theField = Helpers.textSearchDiv('numberDiv', 'fieldCustom', 'removeFieldSearch')
        let numberDiv = $('#searchkeys>div').length;
        $('#searchkeys').append(theField);
        $('.numberDiv').removeClass('numberDiv').addClass(""+numberDiv+"");
    }
    fieldRemoveTextField(byebye, key) {
        this.customArray = $.grep(this.customArray, function(value) { //when textfield is removed, the value will be deleted from the localstorage
            return value != key;
        });
        this.settings.fieldCustom = this.customArray.toString()

        this.saveSettings();
        $(byebye).parent().remove();

        let i;
        for(i = 0; i < $('#searchkeys>div').length; i++) {
            let rightDiv = i + 1;
            $('.'+i+'').next().removeClass().addClass(''+rightDiv+'');
        }
    }
}

const publicFieldsPage = new PublicFieldsPage();
