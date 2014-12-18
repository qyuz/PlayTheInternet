define(["underscore", "slimscroll"], function () {
    $('#dummyInput').length || $('body').append('<input id="dummyInput" class="temp-absolute-off-screen"/>')
    var focusout = function () {
        $('#dummyInput').focus()
    }
    $('body').mouseup(function () {
        $('body').removeClass('temp-webkit-grabbing temp-crosshair')
    })
    $('body').on('mousedown', '.pti-ptilist .pti-content .pti-element .pti-sortable-handler, .pti-ptilist .pti-content .pti-element .pti-clickable', function (event) {
        console.log(this)
        $(this).hasClass('pti-sortable-handler') && ($('body').addClass('temp-webkit-grabbing') | focusout())
        event.stopPropagation()
    })
    $('body').on('mousedown', '.pti-ptilist .pti-content', function (event) {
        console.log(this)
        $('body').addClass('temp-crosshair');
        event.stopPropagation();
        focusout();
    })

    function Ptilist(appendToElementExpression, options) {
        _.isUndefined(appendToElementExpression) || this._init(appendToElementExpression, options)
    }

    Ptilist.prototype._init = function (appendToElementExpression, options) {
        var me = this
        me.options = _.extend({}, options)
        me.options.containerElementExpression = appendToElementExpression
        me.options.ptiElementClass = "pti-element " + _.default(me.options.ptiElementClass, "")
        me.options.elementSize = _.default(me.options.elementSize, "big")
        me.options.elementSplit = _.default(me.options.elementSplit, "two")
        me.options.slimScroll = _.default(me.options.slimScroll, true)
        me.options.blockSort = _.default(me.options.blockSort, false)
        me.options.listenId = _.default(me.options.listenId, me.options.id)
        me.options.notice = _.default(me.options.notice, "")
        me.options.uid = _.guid()

        //events
        me._callbacksAdd({ name: 'change', flags: 'memory' })

        //draw
        me.$ = {}
        me.$.container = $(me.options.containerElementExpression)
        me.$.header = me._createHeader ? me._createHeader().appendTo(me.$.container) : null
        me.$.noticeContainer = $('<div class="pti-make-last-droppable-work"/>').text(me.options.notice)
        me.$.content = $('<div class="pti-content"></div>').append(me.$.noticeContainer).appendTo(me.$.container)

        //classes
        me.$.container.addClass("pti-ptilist")
        me.$.content.addClass("pti-view-" + me.options.elementSize)
        me.$.content.addClass("pti-split-" + me.options.elementSplit)
        me.options.connectWith && me.$.content.addClass(me.options.connectWith)

        //sortable, selectable, slimScroll
        if (me.options.slimScroll) {
            var sortableSlimScroll = { scroll: false }
            me.$.content.data('sortableSlimScroll', sortableSlimScroll)
            me._setSlimScroll(me.$.content, "100%")
        }

        var first_rows = {}, blockSort = false
        me.$.content.data('ptilist', this)
        me.$.content.selectable({
            filter: 'div.pti-element',
//            cancel: 'div.image-div, label.pti-droppable-target, div.pti-make-last-droppable-work, a'
            cancel: '.pti-sortable-handler, .pti-make-last-droppable-work, a, .pti-clickable'
        })
            .sortable({
                connectWith: "." + me.options.connectWith,
                scrollSensitivity: 50,
                tolerance: 'pointer',
                distance: 7,
                handle: '.pti-sortable-handler',
                placeholder: 'pti-sortable-placeholder',
//            update:function (event, ui) {
//                this._recalculateContent()
//            }.bind(this),
//                cancel: '.pti-droppable-target, .pti-make-last-droppable-work',
                cancel: '.pti-make-last-droppable-work',
//        sort : function(event, ui) {
//            var $helper = $('.ui-sortable-helper'), hTop = $helper.offset().top, hStyle = $helper.attr('style'), hId = $helper.attr('id');
//            if (first_rows.length > 1) {
//                $.each(first_rows, function(i, item) {
////                    if (hId != item.id) {
////                        var _top = hTop + (26 * i);
////                        $('#' + item.id).addClass('ui-sortable-helper').attr('style', hStyle).css('top', _top);
////                    }
//                });
//            }
//        },
                start: function (event, ui) {
                    $('.cloned').removeClass('cloned')
                    me.options.blockSort && (blockSort = true)
//                console.log('start')
//                console.log(this)
                    if (ui.item.hasClass('ui-selected') && me.$.content.find('.ui-selected').length > 1) {
                        first_rows = me.$.content.find('.ui-selected').map(function (i, e) {
                            var $tr = $(e);
                            return {
                                tr: $tr.clone(true),
                                id: $tr.attr('id')
                            };
                        }).get();
                        me.$.content.find('.ui-selected').addClass('cloned');
                    }
//                ui.placeholder.html('<td class="pti-view-big">&nbsp;</td>');
                }.bind(this),
                stop: function (event, ui) {
//                console.log('stop')
//                console.log(this)
                    if (me.options.blockSort) {
//                    console.log('preventDefault')
                        event.preventDefault()
                    } else {
//                    console.log('preventDefaultElse')
                        var targetParent = ui.item.parent().data('ptilist')
//                    console.log(targetParent)
//                    console.log(this.first_rows)
                        if (first_rows.length > 1) {
                            var self = this
                            $.each(first_rows, function (i, item) {
                                var trs = $(item.tr)
                                var logItem = trs.removeAttr('style').insertBefore(ui.item);
//                            console.log(logItem)
                                targetParent != self && trs.removeClass('selected')
                            });
                            $('.cloned').remove();
                        }
                        $("#uber tr:even").removeClass("odd even").addClass("even");
                        $("#uber tr:odd").removeClass("odd even").addClass("odd");
                        (!targetParent || targetParent.options.id != me.options.id) && me._recalculateContent()
                        targetParent && targetParent._recalculateContent && targetParent._recalculateContent()
                    }
                    first_rows = {};
                    blockSort = false
                }.bind(this),
                remove: function (event, ui) {
//                console.log('remove')
//                console.log(this)
                    blockSort = false
                }.bind(this),
                receive: function (event, ui) {
                    $(ui.item).removeClass('selected')
                }
//        ,receive: function(event, ui) {
//            _.defer(function () {
//                this._recalculateContent()
//            }.bind(this))
//        }.bind(this)
            }).hover(function () {
                me.options.slimScroll && (sortableSlimScroll.scroll = true)
            }, function () {
                me.options.slimScroll && (sortableSlimScroll.scroll = false)
            })

        this._recalculateContentDebounce = _.debounce(function () {
            this._recalculateContent()
        }, 50)

        this.setId(this.options.id, this.options.listenId, this.options.scrollTo)
    }

    Ptilist.prototype._callbacksAdd = function() {
        this._callbacks = this._callbacks || {}
        for(var i in arguments) {
            var eventCallback = _.isObject(arguments[i]) ? _.object([arguments[i].name], [new $.Callbacks(arguments[i].flags)]) : _.object([arguments[i]], [new $.Callbacks()])
            _.extend(this._callbacks, eventCallback)
        }
    }
    Ptilist.prototype._callbacksFindAndCall = function(eventName, methodName) {
        var callback = this._callbacks[eventName]
        callback && callback[methodName].apply(null, (_.toArray(arguments).slice(2)))
        return callback
    }
    Ptilist.prototype._callbacksFire = function(eventName, data) {
        var callback = this._callbacksFindAndCall(eventName, 'fire', data)
    }
    Ptilist.prototype._callbacksRemove = function(eventName, func) {
        var callback = this._callbacksFindAndCall(eventName, 'remove', func)
    }
    
    Ptilist.prototype._createHeader = function () {
        var me = this
        var $header = $('<div class="pti-header"/>')
        if(me.options.headerConfigKey) {
            var conf = $.jStorage.get(me.options.headerConfigKey)
            conf && conf.size && ( me.options.elementSize = conf.size )
            conf && conf.split && ( me.options.elementSplit = conf.split )
        }

        function _moveScrollBar(before, after) {
            var beforeScrollTop = before.scrollTop / (before.scrollHeight - before.height)
            var afterScrollTop = (after.scrollHeight - after.height) * beforeScrollTop
            me.$.content.slimscroll({scrollTo:  afterScrollTop + 'px' })
        }

        function _setSize(which, persist) {
            if (me.$.content) {
                var before = { scrollTop:me.$.content.scrollTop(), scrollHeight:me.$.content.prop('scrollHeight'), height:me.$.content.height() }
                me.$.content.toggleClass("pti-view-big", which == "big")
                me.$.content.toggleClass("pti-view-medium", which == "medium")
                me.$.content.toggleClass("pti-view-list", which == "list")
                var after = { scrollTop:me.$.content.scrollTop(), scrollHeight:me.$.content.prop('scrollHeight'), height:me.$.content.height() }
                _moveScrollBar(before, after)
            }
            bigView.toggleClass("selected", which == "big")
            mediumView.toggleClass("selected", which == "medium")
            listView.toggleClass("selected", which == "list")
            me.options.elementSize = which
            _persistHeaderConfig(persist)
        }

        function _setSplit(which, persist) {
            if (me.$.content) {
                var before = { scrollTop:me.$.content.scrollTop(), scrollHeight:me.$.content.prop('scrollHeight'), height:me.$.content.height() }
                me.$.content.toggleClass("pti-split-one", which == "one")
                me.$.content.toggleClass("pti-split-two", which == "two")
                var after = { scrollTop:me.$.content.scrollTop(), scrollHeight:me.$.content.prop('scrollHeight'), height:me.$.content.height() }
                _moveScrollBar(before, after)
            }
            splitOne.toggleClass("selected", which == "one")
            splitTwo.toggleClass("selected", which == "two")
            me.options.elementSplit = which
            _persistHeaderConfig(persist)
        }

        function _persistHeaderConfig(persist) {
            var options = { size: me.options.elementSize, split: me.options.elementSplit }
            _.default(persist, true) && me.options.headerConfigKey && $.jStorage.set(me.options.headerConfigKey, options)
        }

        var bigView = $('<div class="pti-header-button size-button">L</div>').appendTo($header).click(_.bind(_setSize, undefined, 'big'))
        var mediumView = $('<div class="pti-header-button size-button">M</div>').appendTo($header).click(_.bind(_setSize, undefined, 'medium'))
        var listView = $('<div class="pti-header-button size-button">S</div>').appendTo($header).click(_.bind(_setSize, undefined, 'list'))
        var splitOne = $('<div data="one" class="pti-header-button temp-playlist-header-margin-left">1</div>').appendTo($header).click(_.bind(_setSplit, undefined, 'one'))
        var splitTwo = $('<div data="two" class="pti-header-button">2</div>').appendTo($header).click(_.bind(_setSplit, undefined, 'two'))

        _setSize(me.options.elementSize, false)
        _setSplit(me.options.elementSplit, false)

        return $header
    }

    Ptilist.prototype._drawPtiElement = function(data, $ptiElement) {
        return $ptiElement.html(data)
    }

    Ptilist.prototype._emptyContent = function () {
        this.$.content.html(this.$.noticeContainer)
    }

    Ptilist.prototype._ptiElement = PTITemplates.prototype.PtilistElement

    Ptilist.prototype._recalculateContent = function () {
        _.defer(_.bind(this._recalculateContentImmediate, this))
    }

    Ptilist.prototype._recalculateContentBuildStorageObject = function () {
        var storageObj = { id: this.options.id, source: this.options.uid, data: _.arrayToString(this.getIds()), updated: Date.now() }
        return storageObj
    }

    Ptilist.prototype._recalculateContentImmediate = function () {
        if (this.options.id) {
            console.log('setting to storage')
            var storageObj = this._recalculateContentBuildStorageObject()
            storageObj && $.jStorage.set(storageObj.id, storageObj)
        }
        this._recalculateContentImmediateFire()
    }

    Ptilist.prototype._recalculateContentImmediateFire = function() {
        this._callbacksFire('change')
    }

    Ptilist.prototype._redrawContent = function (storageObject, scrollTo) {
        if (storageObject.data) {
            this._emptyContent()
            return this.addElements(storageObject.data, undefined, false, scrollTo)
        }
    }

    Ptilist.prototype._redrawContentGeneric = function (key, action, functionName, filterOwn, scrollTo) {
        var storageObject = this._redrawContentGetCacheObject(key, action, functionName, filterOwn)
        storageObject && this._redrawContent(storageObject, scrollTo)
    }

    Ptilist.prototype._redrawContentFromCacheListen = function (key, action) {
        this._redrawContentGeneric(key, action, 'listener redraw ptilist from cache', true)
    }

    Ptilist.prototype._redrawContentFromCacheListenJStorage = function () {
        this._redrawContentFromCacheListenLast = this._redrawContentFromCacheListen.bind(this);
        $.jStorage.listenKeyChange(this.options.listenId, this._redrawContentFromCacheListenLast)
    }

    Ptilist.prototype._redrawContentFromCacheManual = function (scrollTo) {
        this._redrawContentGeneric(this.options.id, 'manual redraw from cache', 'manual redraw ptilist from cache', false, scrollTo)
    }

    Ptilist.prototype._redrawContentGetCacheObject = function (key, action, functionName, filterOwn) {
        console.log(key + ' has been ' + action)
        var jStorageData = $.jStorage.get(key);
        if (filterOwn && jStorageData && jStorageData.source == this.options.uid) {
            console.log('not talking to self')
            return undefined
        } else {
            var resultStorageData = null
            jStorageData && ((resultStorageData = _.extend({}, jStorageData)) | (resultStorageData.data = _.stringToArray(jStorageData.data)))
            return resultStorageData
        }
    }

    Ptilist.prototype._setId = function(id, listenId) {
        this.options.listenId = _.default(listenId, id)
        this.options.id = id
    }

    Ptilist.prototype._setSlimScroll = function (element, height) {
        $(element).slimScroll({
            height: height,
            color: '#56545e',
            railVisible: true,
            railColor: '#000000',
            disableFadeOut: true
        });
    }

    Ptilist.prototype._unique = function(current, input) {
        var currIds = current
        var newIds = input.map(function(item) {
            return item && typeof item.id !== "undefined" ? item.id : item
        }).filter(Boolean)
        return _.difference(newIds, currIds)
    }

    Ptilist.prototype.addElements = function (elementsData, unique, recalculcate, scrollTo) {
        var me = this, dataPtiElements = new Array(), slices = new Array(), sliceCap = 33, deferred = new $.Deferred()
        var _defer = function (func) {
            var _defer = new $.Deferred()
            var _then = function () {
                func(_defer)
                return _defer
            }
            return { defer:_defer, then:_then }
        }

        unique && ( elementsData = this._unique(this.getIds(), elementsData) )

        elementsData.forEach(function(elementData) {
            elementData && dataPtiElements.push({ data: elementData, $ptiElement: $(Ptilist.prototype._ptiElement({id: _.default(elementData.id, elementData), elementClass: me.options.ptiElementClass})).appendTo(me.$.content) })
        })
        while(dataPtiElements.length) {
            slices.push(dataPtiElements.splice(0, sliceCap))
        }

        if(scrollTo) {
            var startSlice = parseInt(scrollTo / sliceCap), offset = 1, reorderSlices = new Array()
            slices[startSlice] && reorderSlices.push(slices[startSlice])
            while(slices[startSlice - offset] || slices[startSlice + offset]) {
                slices[startSlice - offset] && reorderSlices.push(slices[startSlice - offset])
                slices[startSlice + offset] && reorderSlices.push(slices[startSlice + offset])
                offset++
            }
            slices = reorderSlices
            this.scrollTo(scrollTo)
        }

        deferred.resolve()
		var firstSlice = slices.shift()
		if(firstSlice) {
			var _drawSlice = function(slice) {
				slice.forEach(function(dataPtiElement) {
					me._drawPtiElement(dataPtiElement.data, dataPtiElement.$ptiElement)
				})
			}
            _drawSlice(firstSlice)
			slices.forEach(function(slice) {
                var defObj = _defer(function(deferred) {
                    _.defer(function() {
                        _drawSlice(slice)
                        deferred.resolve()
                    })
                })
                deferred.then(defObj.then)
                deferred = defObj.defer
			})
		}

        if(_.default(recalculcate, true)) {
            defObj = _defer(function(deferred) {
                me._recalculateContentDebounce()
                deferred.resolve()
            })
            deferred.then(defObj.then)
            deferred = defObj.defer
        }

        return deferred
    }


    Ptilist.prototype.getPtiElement = function(item) {
        return $(item).parents('.pti-element')
    }

    Ptilist.prototype.getPtiElements = function () {
        return this.$.content.find('.pti-element')
    }

    Ptilist.prototype.getPtiElementsUiSelected = function () {
        return this.$.content.find('.pti-element.ui-selected')
    }

    Ptilist.prototype.getIds = function () {
        return this.$.content.sortable('toArray').filter(Boolean)
    }

    Ptilist.prototype.getIdsCount = function () {
        return this.$.content.children().length - 1
    }

    Ptilist.prototype.getIdsUiSelected = function () {
        return (this.$.content.find('.pti-element.ui-selected').map(function(index, item) {
            return $(item).attr('id')
        })).get()
    }

    Ptilist.prototype.on = function (eventName, func) {
        var callback = this._callbacksFindAndCall(eventName, 'add', func)
    }

    Ptilist.prototype.scrollTo = function(index) {
        var rowHeight = this.$.content.prop('scrollHeight') / this.getIdsCount()
		var elementHeight = this.getPtiElements().height()
        var scrollTo = rowHeight * (index - (this.$.content.hasClass('pti-split-two') ? index % 2 == 1 ? 1 : 0 : 0)) - this.$.content.height() / 2 + elementHeight / 2
        this.$.content.slimscroll({ scrollTo: scrollTo + 'px' })
    }

    Ptilist.prototype.setId = function(id, listenId, scrollTo) {
        this._redrawContentFromCacheListenLast && $.jStorage.stopListening(this.options.listenId, this._redrawContentFromCacheListenLast)
        this._setId(id, listenId)
        this.options.listenId && (this._redrawContentFromCacheListenJStorage() | this._redrawContentFromCacheManual(scrollTo))
    }

    return Ptilist
})