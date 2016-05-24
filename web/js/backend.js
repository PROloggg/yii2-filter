if (typeof pistol88 == "undefined" || !pistol88) {
    var pistol88 = {};
}

pistol88.filter = {
    csrf_param: '_csrf',
    csrf_token: '',
    init: function() {
        $(document).on('change', '.pistol88-filter input, .pistol88-filter select', this.choiceVariant);

        $(document).on('click', '.pistol88-filter .new-variant button', this.addVariant);
        pistol88.filter.csrf_param = $('meta[name="csrf-param"]').attr('content');
        pistol88.filter.csrf_token = $('meta[name="csrf-token"]').attr('content');
    },
    addVariant: function() {
        var input = $(this).siblings('input');
        var filter_id = $(input).data('filter-id');
        var value = $(input).val();
        
        $(input).css('opacity', '0.3');
        
        var create_action = $(this).siblings('input').data('create-action');
        
        var data = {};
        data.FilterVariant = {};
        data.FilterVariant.filter_id = filter_id;
        data.FilterVariant.value = value;
        data.json = true;
        data[pistol88.filter.csrf_param] = pistol88.filter.csrf_token;

        $.post(create_action, data,
            function(json) {
                if(json.result == 'success') {
                    $(input).val('');
                    $(input).css('opacity', 1);

                    $(input).parent('div').siblings('ul').append('<li><input checked="checked" type="checkbox" id="filtervariant'+json.id+'" name="variant" value="1" data-id="'+json.id+'"> <label for="filtervariant'+json.id+'">'+value+'</label></li>');
                    if(!json.new) {
                        $(input).parent('div').siblings('.filter-data-container').find('select').append('<option value="'+json.id+'">'+value+'</option>').val(json.id).change();
                    }
                    else {
                        $(input).parent('div').siblings('.filter-data-container').find('select').val(json.id).change();
                    }
                    $('#filtervariant'+json.id).change();
                }
                else {
                    alert('Error');
                }
                
            }, "json");
    },
    choiceVariant: function() {
        var li = $(this).parent();

        var variant_id = $(this).data('id');
        
        var filter_id = $(this).parents('.filter-data-container').data('id');
        var item_id = $(this).parents('.filter-data-container').data('item-id');

        var create_action = $(this).parents('.filter-data-container').data('create-action');
        var update_action = $(this).parents('.filter-data-container').data('update-action');
        var delete_action = $(this).parents('.filter-data-container').data('delete-action');

        //$(li).css('opacity', '0.3');

        if($(this).is('select')) {
            variant_id = $(this).val();
            if(variant_id <= 0) {
                $.post(delete_action, {variant_id: variant_id, item_id: item_id},
                    function(json) {
                        if(json.result == 'success') {
                            $(li).css('opacity', '1');
                        }
                        else {
                            alert('Error');
                        }
                    }, "json");
            }
            else {
                var data = {};
                data.FilterValue = {};
                data.FilterValue.variant_id = variant_id;
                data.FilterValue.filter_id = filter_id;
                data.FilterValue.item_id = item_id;
                data[pistol88.filter.csrf_param] = pistol88.filter.csrf_token;

                $.post(update_action, data,
                    function(json) {
                        $(li).css('opacity', '1');
                    }, "json");
            }
        }
        else if($(this).prop('checked')) {
            var data = {};
            data.FilterValue = {};
            data.FilterValue.variant_id = variant_id;
            data.FilterValue.filter_id = filter_id;
            data.FilterValue.item_id = item_id;
            data[pistol88.filter.csrf_param] = pistol88.filter.csrf_token;

            $.post(create_action, data,
                function(json) {
                    $(li).css('opacity', '1');
                }, "json");
        }
        else {
            $.post(delete_action, {variant_id: variant_id, item_id: item_id},
                function(json) {
                    if(json.result == 'success') {
                        $(li).css('opacity', '1');
                    }
                    else {
                        alert('Error');
                    }
                }, "json");
        }
    },
};

pistol88.filter.init();
