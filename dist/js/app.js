(() => {
    var __webpack_modules__ = {
        205: function(module) {
            /*!
 * lightgallery | 2.4.0 | January 29th 2022
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
            (function(global, factory) {
                true ? module.exports = factory() : 0;
            })(0, (function() {
                "use strict";
                /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */                var __assign = function() {
                    __assign = Object.assign || function __assign(t) {
                        for (var s, i = 1, n = arguments.length; i < n; i++) {
                            s = arguments[i];
                            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                        }
                        return t;
                    };
                    return __assign.apply(this, arguments);
                };
                var thumbnailsSettings = {
                    thumbnail: true,
                    animateThumb: true,
                    currentPagerPosition: "middle",
                    alignThumbnails: "middle",
                    thumbWidth: 100,
                    thumbHeight: "80px",
                    thumbMargin: 5,
                    appendThumbnailsTo: ".lg-components",
                    toggleThumb: false,
                    enableThumbDrag: true,
                    enableThumbSwipe: true,
                    thumbnailSwipeThreshold: 10,
                    loadYouTubeThumbnail: true,
                    youTubeThumbSize: 1,
                    thumbnailPluginStrings: {
                        toggleThumbnails: "Toggle thumbnails"
                    }
                };
                var lGEvents = {
                    afterAppendSlide: "lgAfterAppendSlide",
                    init: "lgInit",
                    hasVideo: "lgHasVideo",
                    containerResize: "lgContainerResize",
                    updateSlides: "lgUpdateSlides",
                    afterAppendSubHtml: "lgAfterAppendSubHtml",
                    beforeOpen: "lgBeforeOpen",
                    afterOpen: "lgAfterOpen",
                    slideItemLoad: "lgSlideItemLoad",
                    beforeSlide: "lgBeforeSlide",
                    afterSlide: "lgAfterSlide",
                    posterClick: "lgPosterClick",
                    dragStart: "lgDragStart",
                    dragMove: "lgDragMove",
                    dragEnd: "lgDragEnd",
                    beforeNextSlide: "lgBeforeNextSlide",
                    beforePrevSlide: "lgBeforePrevSlide",
                    beforeClose: "lgBeforeClose",
                    afterClose: "lgAfterClose",
                    rotateLeft: "lgRotateLeft",
                    rotateRight: "lgRotateRight",
                    flipHorizontal: "lgFlipHorizontal",
                    flipVertical: "lgFlipVertical",
                    autoplay: "lgAutoplay",
                    autoplayStart: "lgAutoplayStart",
                    autoplayStop: "lgAutoplayStop"
                };
                var Thumbnail = function() {
                    function Thumbnail(instance, $LG) {
                        this.thumbOuterWidth = 0;
                        this.thumbTotalWidth = 0;
                        this.translateX = 0;
                        this.thumbClickable = false;
                        this.core = instance;
                        this.$LG = $LG;
                        return this;
                    }
                    Thumbnail.prototype.init = function() {
                        this.settings = __assign(__assign({}, thumbnailsSettings), this.core.settings);
                        this.thumbOuterWidth = 0;
                        this.thumbTotalWidth = this.core.galleryItems.length * (this.settings.thumbWidth + this.settings.thumbMargin);
                        this.translateX = 0;
                        this.setAnimateThumbStyles();
                        if (!this.core.settings.allowMediaOverlap) this.settings.toggleThumb = false;
                        if (this.settings.thumbnail) {
                            this.build();
                            if (this.settings.animateThumb) {
                                if (this.settings.enableThumbDrag) this.enableThumbDrag();
                                if (this.settings.enableThumbSwipe) this.enableThumbSwipe();
                                this.thumbClickable = false;
                            } else this.thumbClickable = true;
                            this.toggleThumbBar();
                            this.thumbKeyPress();
                        }
                    };
                    Thumbnail.prototype.build = function() {
                        var _this = this;
                        this.setThumbMarkup();
                        this.manageActiveClassOnSlideChange();
                        this.$lgThumb.first().on("click.lg touchend.lg", (function(e) {
                            var $target = _this.$LG(e.target);
                            if (!$target.hasAttribute("data-lg-item-id")) return;
                            setTimeout((function() {
                                if (_this.thumbClickable && !_this.core.lgBusy) {
                                    var index = parseInt($target.attr("data-lg-item-id"));
                                    _this.core.slide(index, false, true, false);
                                }
                            }), 50);
                        }));
                        this.core.LGel.on(lGEvents.beforeSlide + ".thumb", (function(event) {
                            var index = event.detail.index;
                            _this.animateThumb(index);
                        }));
                        this.core.LGel.on(lGEvents.beforeOpen + ".thumb", (function() {
                            _this.thumbOuterWidth = _this.core.outer.get().offsetWidth;
                        }));
                        this.core.LGel.on(lGEvents.updateSlides + ".thumb", (function() {
                            _this.rebuildThumbnails();
                        }));
                        this.core.LGel.on(lGEvents.containerResize + ".thumb", (function() {
                            if (!_this.core.lgOpened) return;
                            setTimeout((function() {
                                _this.thumbOuterWidth = _this.core.outer.get().offsetWidth;
                                _this.animateThumb(_this.core.index);
                                _this.thumbOuterWidth = _this.core.outer.get().offsetWidth;
                            }), 50);
                        }));
                    };
                    Thumbnail.prototype.setThumbMarkup = function() {
                        var thumbOuterClassNames = "lg-thumb-outer ";
                        if (this.settings.alignThumbnails) thumbOuterClassNames += "lg-thumb-align-" + this.settings.alignThumbnails;
                        var html = '<div class="' + thumbOuterClassNames + '">\n        <div class="lg-thumb lg-group">\n        </div>\n        </div>';
                        this.core.outer.addClass("lg-has-thumb");
                        if (".lg-components" === this.settings.appendThumbnailsTo) this.core.$lgComponents.append(html); else this.core.outer.append(html);
                        this.$thumbOuter = this.core.outer.find(".lg-thumb-outer").first();
                        this.$lgThumb = this.core.outer.find(".lg-thumb").first();
                        if (this.settings.animateThumb) this.core.outer.find(".lg-thumb").css("transition-duration", this.core.settings.speed + "ms").css("width", this.thumbTotalWidth + "px").css("position", "relative");
                        this.setThumbItemHtml(this.core.galleryItems);
                    };
                    Thumbnail.prototype.enableThumbDrag = function() {
                        var _this = this;
                        var thumbDragUtils = {
                            cords: {
                                startX: 0,
                                endX: 0
                            },
                            isMoved: false,
                            newTranslateX: 0,
                            startTime: new Date,
                            endTime: new Date,
                            touchMoveTime: 0
                        };
                        var isDragging = false;
                        this.$thumbOuter.addClass("lg-grab");
                        this.core.outer.find(".lg-thumb").first().on("mousedown.lg.thumb", (function(e) {
                            if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                                e.preventDefault();
                                thumbDragUtils.cords.startX = e.pageX;
                                thumbDragUtils.startTime = new Date;
                                _this.thumbClickable = false;
                                isDragging = true;
                                _this.core.outer.get().scrollLeft += 1;
                                _this.core.outer.get().scrollLeft -= 1;
                                _this.$thumbOuter.removeClass("lg-grab").addClass("lg-grabbing");
                            }
                        }));
                        this.$LG(window).on("mousemove.lg.thumb.global" + this.core.lgId, (function(e) {
                            if (!_this.core.lgOpened) return;
                            if (isDragging) {
                                thumbDragUtils.cords.endX = e.pageX;
                                thumbDragUtils = _this.onThumbTouchMove(thumbDragUtils);
                            }
                        }));
                        this.$LG(window).on("mouseup.lg.thumb.global" + this.core.lgId, (function() {
                            if (!_this.core.lgOpened) return;
                            if (thumbDragUtils.isMoved) thumbDragUtils = _this.onThumbTouchEnd(thumbDragUtils); else _this.thumbClickable = true;
                            if (isDragging) {
                                isDragging = false;
                                _this.$thumbOuter.removeClass("lg-grabbing").addClass("lg-grab");
                            }
                        }));
                    };
                    Thumbnail.prototype.enableThumbSwipe = function() {
                        var _this = this;
                        var thumbDragUtils = {
                            cords: {
                                startX: 0,
                                endX: 0
                            },
                            isMoved: false,
                            newTranslateX: 0,
                            startTime: new Date,
                            endTime: new Date,
                            touchMoveTime: 0
                        };
                        this.$lgThumb.on("touchstart.lg", (function(e) {
                            if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                                e.preventDefault();
                                thumbDragUtils.cords.startX = e.targetTouches[0].pageX;
                                _this.thumbClickable = false;
                                thumbDragUtils.startTime = new Date;
                            }
                        }));
                        this.$lgThumb.on("touchmove.lg", (function(e) {
                            if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                                e.preventDefault();
                                thumbDragUtils.cords.endX = e.targetTouches[0].pageX;
                                thumbDragUtils = _this.onThumbTouchMove(thumbDragUtils);
                            }
                        }));
                        this.$lgThumb.on("touchend.lg", (function() {
                            if (thumbDragUtils.isMoved) thumbDragUtils = _this.onThumbTouchEnd(thumbDragUtils); else _this.thumbClickable = true;
                        }));
                    };
                    Thumbnail.prototype.rebuildThumbnails = function() {
                        var _this = this;
                        this.$thumbOuter.addClass("lg-rebuilding-thumbnails");
                        setTimeout((function() {
                            _this.thumbTotalWidth = _this.core.galleryItems.length * (_this.settings.thumbWidth + _this.settings.thumbMargin);
                            _this.$lgThumb.css("width", _this.thumbTotalWidth + "px");
                            _this.$lgThumb.empty();
                            _this.setThumbItemHtml(_this.core.galleryItems);
                            _this.animateThumb(_this.core.index);
                        }), 50);
                        setTimeout((function() {
                            _this.$thumbOuter.removeClass("lg-rebuilding-thumbnails");
                        }), 200);
                    };
                    Thumbnail.prototype.setTranslate = function(value) {
                        this.$lgThumb.css("transform", "translate3d(-" + value + "px, 0px, 0px)");
                    };
                    Thumbnail.prototype.getPossibleTransformX = function(left) {
                        if (left > this.thumbTotalWidth - this.thumbOuterWidth) left = this.thumbTotalWidth - this.thumbOuterWidth;
                        if (left < 0) left = 0;
                        return left;
                    };
                    Thumbnail.prototype.animateThumb = function(index) {
                        this.$lgThumb.css("transition-duration", this.core.settings.speed + "ms");
                        if (this.settings.animateThumb) {
                            var position = 0;
                            switch (this.settings.currentPagerPosition) {
                              case "left":
                                position = 0;
                                break;

                              case "middle":
                                position = this.thumbOuterWidth / 2 - this.settings.thumbWidth / 2;
                                break;

                              case "right":
                                position = this.thumbOuterWidth - this.settings.thumbWidth;
                            }
                            this.translateX = (this.settings.thumbWidth + this.settings.thumbMargin) * index - 1 - position;
                            if (this.translateX > this.thumbTotalWidth - this.thumbOuterWidth) this.translateX = this.thumbTotalWidth - this.thumbOuterWidth;
                            if (this.translateX < 0) this.translateX = 0;
                            this.setTranslate(this.translateX);
                        }
                    };
                    Thumbnail.prototype.onThumbTouchMove = function(thumbDragUtils) {
                        thumbDragUtils.newTranslateX = this.translateX;
                        thumbDragUtils.isMoved = true;
                        thumbDragUtils.touchMoveTime = (new Date).valueOf();
                        thumbDragUtils.newTranslateX -= thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;
                        thumbDragUtils.newTranslateX = this.getPossibleTransformX(thumbDragUtils.newTranslateX);
                        this.setTranslate(thumbDragUtils.newTranslateX);
                        this.$thumbOuter.addClass("lg-dragging");
                        return thumbDragUtils;
                    };
                    Thumbnail.prototype.onThumbTouchEnd = function(thumbDragUtils) {
                        thumbDragUtils.isMoved = false;
                        thumbDragUtils.endTime = new Date;
                        this.$thumbOuter.removeClass("lg-dragging");
                        var touchDuration = thumbDragUtils.endTime.valueOf() - thumbDragUtils.startTime.valueOf();
                        var distanceXnew = thumbDragUtils.cords.endX - thumbDragUtils.cords.startX;
                        var speedX = Math.abs(distanceXnew) / touchDuration;
                        if (speedX > .15 && thumbDragUtils.endTime.valueOf() - thumbDragUtils.touchMoveTime < 30) {
                            speedX += 1;
                            if (speedX > 2) speedX += 1;
                            speedX += speedX * (Math.abs(distanceXnew) / this.thumbOuterWidth);
                            this.$lgThumb.css("transition-duration", Math.min(speedX - 1, 2) + "settings");
                            distanceXnew *= speedX;
                            this.translateX = this.getPossibleTransformX(this.translateX - distanceXnew);
                            this.setTranslate(this.translateX);
                        } else this.translateX = thumbDragUtils.newTranslateX;
                        if (Math.abs(thumbDragUtils.cords.endX - thumbDragUtils.cords.startX) < this.settings.thumbnailSwipeThreshold) this.thumbClickable = true;
                        return thumbDragUtils;
                    };
                    Thumbnail.prototype.getThumbHtml = function(thumb, index) {
                        var slideVideoInfo = this.core.galleryItems[index].__slideVideoInfo || {};
                        var thumbImg;
                        if (slideVideoInfo.youtube) if (this.settings.loadYouTubeThumbnail) thumbImg = "//img.youtube.com/vi/" + slideVideoInfo.youtube[1] + "/" + this.settings.youTubeThumbSize + ".jpg"; else thumbImg = thumb; else thumbImg = thumb;
                        return '<div data-lg-item-id="' + index + '" class="lg-thumb-item ' + (index === this.core.index ? " active" : "") + '" \n        style="width:' + this.settings.thumbWidth + "px; height: " + this.settings.thumbHeight + ";\n            margin-right: " + this.settings.thumbMargin + 'px;">\n            <img data-lg-item-id="' + index + '" src="' + thumbImg + '" />\n        </div>';
                    };
                    Thumbnail.prototype.getThumbItemHtml = function(items) {
                        var thumbList = "";
                        for (var i = 0; i < items.length; i++) thumbList += this.getThumbHtml(items[i].thumb, i);
                        return thumbList;
                    };
                    Thumbnail.prototype.setThumbItemHtml = function(items) {
                        var thumbList = this.getThumbItemHtml(items);
                        this.$lgThumb.html(thumbList);
                    };
                    Thumbnail.prototype.setAnimateThumbStyles = function() {
                        if (this.settings.animateThumb) this.core.outer.addClass("lg-animate-thumb");
                    };
                    Thumbnail.prototype.manageActiveClassOnSlideChange = function() {
                        var _this = this;
                        this.core.LGel.on(lGEvents.beforeSlide + ".thumb", (function(event) {
                            var $thumb = _this.core.outer.find(".lg-thumb-item");
                            var index = event.detail.index;
                            $thumb.removeClass("active");
                            $thumb.eq(index).addClass("active");
                        }));
                    };
                    Thumbnail.prototype.toggleThumbBar = function() {
                        var _this = this;
                        if (this.settings.toggleThumb) {
                            this.core.outer.addClass("lg-can-toggle");
                            this.core.$toolbar.append('<button type="button" aria-label="' + this.settings.thumbnailPluginStrings["toggleThumbnails"] + '" class="lg-toggle-thumb lg-icon"></button>');
                            this.core.outer.find(".lg-toggle-thumb").first().on("click.lg", (function() {
                                _this.core.outer.toggleClass("lg-components-open");
                            }));
                        }
                    };
                    Thumbnail.prototype.thumbKeyPress = function() {
                        var _this = this;
                        this.$LG(window).on("keydown.lg.thumb.global" + this.core.lgId, (function(e) {
                            if (!_this.core.lgOpened || !_this.settings.toggleThumb) return;
                            if (38 === e.keyCode) {
                                e.preventDefault();
                                _this.core.outer.addClass("lg-components-open");
                            } else if (40 === e.keyCode) {
                                e.preventDefault();
                                _this.core.outer.removeClass("lg-components-open");
                            }
                        }));
                    };
                    Thumbnail.prototype.destroy = function() {
                        if (this.settings.thumbnail) {
                            this.$LG(window).off(".lg.thumb.global" + this.core.lgId);
                            this.core.LGel.off(".lg.thumb");
                            this.core.LGel.off(".thumb");
                            this.$thumbOuter.remove();
                            this.core.outer.removeClass("lg-has-thumb");
                        }
                    };
                    return Thumbnail;
                }();
                return Thumbnail;
            }));
        },
        578: function(module) {
            /*!
 * lightgallery | 2.4.0 | January 29th 2022
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
            (function(global, factory) {
                true ? module.exports = factory() : 0;
            })(0, (function() {
                "use strict";
                /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */                var __assign = function() {
                    __assign = Object.assign || function __assign(t) {
                        for (var s, i = 1, n = arguments.length; i < n; i++) {
                            s = arguments[i];
                            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                        }
                        return t;
                    };
                    return __assign.apply(this, arguments);
                };
                var zoomSettings = {
                    scale: 1,
                    zoom: true,
                    actualSize: true,
                    showZoomInOutIcons: false,
                    actualSizeIcons: {
                        zoomIn: "lg-zoom-in",
                        zoomOut: "lg-zoom-out"
                    },
                    enableZoomAfter: 300,
                    zoomPluginStrings: {
                        zoomIn: "Zoom in",
                        zoomOut: "Zoom out",
                        viewActualSize: "View actual size"
                    }
                };
                var lGEvents = {
                    afterAppendSlide: "lgAfterAppendSlide",
                    init: "lgInit",
                    hasVideo: "lgHasVideo",
                    containerResize: "lgContainerResize",
                    updateSlides: "lgUpdateSlides",
                    afterAppendSubHtml: "lgAfterAppendSubHtml",
                    beforeOpen: "lgBeforeOpen",
                    afterOpen: "lgAfterOpen",
                    slideItemLoad: "lgSlideItemLoad",
                    beforeSlide: "lgBeforeSlide",
                    afterSlide: "lgAfterSlide",
                    posterClick: "lgPosterClick",
                    dragStart: "lgDragStart",
                    dragMove: "lgDragMove",
                    dragEnd: "lgDragEnd",
                    beforeNextSlide: "lgBeforeNextSlide",
                    beforePrevSlide: "lgBeforePrevSlide",
                    beforeClose: "lgBeforeClose",
                    afterClose: "lgAfterClose",
                    rotateLeft: "lgRotateLeft",
                    rotateRight: "lgRotateRight",
                    flipHorizontal: "lgFlipHorizontal",
                    flipVertical: "lgFlipVertical",
                    autoplay: "lgAutoplay",
                    autoplayStart: "lgAutoplayStart",
                    autoplayStop: "lgAutoplayStop"
                };
                var Zoom = function() {
                    function Zoom(instance, $LG) {
                        this.core = instance;
                        this.$LG = $LG;
                        this.settings = __assign(__assign({}, zoomSettings), this.core.settings);
                        return this;
                    }
                    Zoom.prototype.buildTemplates = function() {
                        var zoomIcons = this.settings.showZoomInOutIcons ? '<button id="' + this.core.getIdName("lg-zoom-in") + '" type="button" aria-label="' + this.settings.zoomPluginStrings["zoomIn"] + '" class="lg-zoom-in lg-icon"></button><button id="' + this.core.getIdName("lg-zoom-out") + '" type="button" aria-label="' + this.settings.zoomPluginStrings["zoomIn"] + '" class="lg-zoom-out lg-icon"></button>' : "";
                        if (this.settings.actualSize) zoomIcons += '<button id="' + this.core.getIdName("lg-actual-size") + '" type="button" aria-label="' + this.settings.zoomPluginStrings["viewActualSize"] + '" class="' + this.settings.actualSizeIcons.zoomIn + ' lg-icon"></button>';
                        this.core.outer.addClass("lg-use-transition-for-zoom");
                        this.core.$toolbar.first().append(zoomIcons);
                    };
                    Zoom.prototype.enableZoom = function(event) {
                        var _this = this;
                        var _speed = this.settings.enableZoomAfter + event.detail.delay;
                        if (this.$LG("body").first().hasClass("lg-from-hash") && event.detail.delay) _speed = 0; else this.$LG("body").first().removeClass("lg-from-hash");
                        this.zoomableTimeout = setTimeout((function() {
                            if (!_this.isImageSlide()) return;
                            _this.core.getSlideItem(event.detail.index).addClass("lg-zoomable");
                            if (event.detail.index === _this.core.index) _this.setZoomEssentials();
                        }), _speed + 30);
                    };
                    Zoom.prototype.enableZoomOnSlideItemLoad = function() {
                        this.core.LGel.on(lGEvents.slideItemLoad + ".zoom", this.enableZoom.bind(this));
                    };
                    Zoom.prototype.getModifier = function(rotateValue, axis, el) {
                        var originalRotate = rotateValue;
                        rotateValue = Math.abs(rotateValue);
                        var transformValues = this.getCurrentTransform(el);
                        if (!transformValues) return 1;
                        var modifier = 1;
                        if ("X" === axis) {
                            var flipHorizontalValue = Math.sign(parseFloat(transformValues[0]));
                            if (0 === rotateValue || 180 === rotateValue) modifier = 1; else if (90 === rotateValue) if (-90 === originalRotate && 1 === flipHorizontalValue || 90 === originalRotate && -1 === flipHorizontalValue) modifier = -1; else modifier = 1;
                            modifier *= flipHorizontalValue;
                        } else {
                            var flipVerticalValue = Math.sign(parseFloat(transformValues[3]));
                            if (0 === rotateValue || 180 === rotateValue) modifier = 1; else if (90 === rotateValue) {
                                var sinX = parseFloat(transformValues[1]);
                                var sinMinusX = parseFloat(transformValues[2]);
                                modifier = Math.sign(sinX * sinMinusX * originalRotate * flipVerticalValue);
                            }
                            modifier *= flipVerticalValue;
                        }
                        return modifier;
                    };
                    Zoom.prototype.getImageSize = function($image, rotateValue, axis) {
                        var imageSizes = {
                            y: "offsetHeight",
                            x: "offsetWidth"
                        };
                        if (90 === Math.abs(rotateValue)) if ("x" === axis) axis = "y"; else axis = "x";
                        return $image[imageSizes[axis]];
                    };
                    Zoom.prototype.getDragCords = function(e, rotateValue) {
                        if (90 === rotateValue) return {
                            x: e.pageY,
                            y: e.pageX
                        }; else return {
                            x: e.pageX,
                            y: e.pageY
                        };
                    };
                    Zoom.prototype.getSwipeCords = function(e, rotateValue) {
                        var x = e.targetTouches[0].pageX;
                        var y = e.targetTouches[0].pageY;
                        if (90 === rotateValue) return {
                            x: y,
                            y: x
                        }; else return {
                            x,
                            y
                        };
                    };
                    Zoom.prototype.getDragAllowedAxises = function(rotateValue, scale) {
                        scale = scale || this.scale || 1;
                        var allowY = this.imageYSize * scale > this.containerRect.height;
                        var allowX = this.imageXSize * scale > this.containerRect.width;
                        if (90 === rotateValue) return {
                            allowX: allowY,
                            allowY: allowX
                        }; else return {
                            allowX,
                            allowY
                        };
                    };
                    Zoom.prototype.getCurrentTransform = function(el) {
                        if (!el) return;
                        var st = window.getComputedStyle(el, null);
                        var tm = st.getPropertyValue("-webkit-transform") || st.getPropertyValue("-moz-transform") || st.getPropertyValue("-ms-transform") || st.getPropertyValue("-o-transform") || st.getPropertyValue("transform") || "none";
                        if ("none" !== tm) return tm.split("(")[1].split(")")[0].split(",");
                        return;
                    };
                    Zoom.prototype.getCurrentRotation = function(el) {
                        if (!el) return 0;
                        var values = this.getCurrentTransform(el);
                        if (values) return Math.round(Math.atan2(parseFloat(values[1]), parseFloat(values[0])) * (180 / Math.PI));
                        return 0;
                    };
                    Zoom.prototype.setZoomEssentials = function() {
                        var $image = this.core.getSlideItem(this.core.index).find(".lg-image").first();
                        var rotateEl = this.core.getSlideItem(this.core.index).find(".lg-img-rotate").first().get();
                        this.rotateValue = this.getCurrentRotation(rotateEl);
                        this.imageYSize = this.getImageSize($image.get(), this.rotateValue, "y");
                        this.imageXSize = this.getImageSize($image.get(), this.rotateValue, "x");
                        this.containerRect = this.core.outer.get().getBoundingClientRect();
                        this.modifierX = this.getModifier(this.rotateValue, "X", rotateEl);
                        this.modifierY = this.getModifier(this.rotateValue, "Y", rotateEl);
                    };
                    Zoom.prototype.zoomImage = function(scale) {
                        var offsetX = (this.containerRect.width - this.imageXSize) / 2 + this.containerRect.left;
                        var _a = this.core.mediaContainerPosition, top = _a.top, bottom = _a.bottom;
                        var topBottomSpacing = Math.abs(top - bottom) / 2;
                        var offsetY = (this.containerRect.height - this.imageYSize - topBottomSpacing * this.modifierX) / 2 + this.scrollTop + this.containerRect.top;
                        var originalX;
                        var originalY;
                        if (1 === scale) this.positionChanged = false;
                        var dragAllowedAxises = this.getDragAllowedAxises(Math.abs(this.rotateValue), scale);
                        var allowY = dragAllowedAxises.allowY, allowX = dragAllowedAxises.allowX;
                        if (this.positionChanged) {
                            originalX = this.left / (this.scale - 1);
                            originalY = this.top / (this.scale - 1);
                            this.pageX = Math.abs(originalX) + offsetX;
                            this.pageY = Math.abs(originalY) + offsetY;
                            this.positionChanged = false;
                        }
                        var possibleSwipeCords = this.getPossibleSwipeDragCords(this.rotateValue, scale);
                        var _x = offsetX - this.pageX;
                        var _y = offsetY - this.pageY;
                        var x = (scale - 1) * _x;
                        var y = (scale - 1) * _y;
                        if (allowX) {
                            if (this.isBeyondPossibleLeft(x, possibleSwipeCords.minX)) x = possibleSwipeCords.minX; else if (this.isBeyondPossibleRight(x, possibleSwipeCords.maxX)) x = possibleSwipeCords.maxX;
                        } else if (scale > 1) if (x < possibleSwipeCords.minX) x = possibleSwipeCords.minX; else if (x > possibleSwipeCords.maxX) x = possibleSwipeCords.maxX;
                        if (allowY) {
                            if (this.isBeyondPossibleTop(y, possibleSwipeCords.minY)) y = possibleSwipeCords.minY; else if (this.isBeyondPossibleBottom(y, possibleSwipeCords.maxY)) y = possibleSwipeCords.maxY;
                        } else if (scale > 1) if (y < possibleSwipeCords.minY) y = possibleSwipeCords.minY; else if (y > possibleSwipeCords.maxY) y = possibleSwipeCords.maxY;
                        this.setZoomStyles({
                            x,
                            y,
                            scale
                        });
                    };
                    Zoom.prototype.setZoomStyles = function(style) {
                        var $image = this.core.getSlideItem(this.core.index).find(".lg-image").first();
                        var $dummyImage = this.core.outer.find(".lg-current .lg-dummy-img").first();
                        var $imageWrap = $image.parent();
                        this.scale = style.scale;
                        $image.css("transform", "scale3d(" + style.scale + ", " + style.scale + ", 1)");
                        $dummyImage.css("transform", "scale3d(" + style.scale + ", " + style.scale + ", 1)");
                        var transform = "translate3d(" + style.x + "px, " + style.y + "px, 0)";
                        $imageWrap.css("transform", transform);
                        this.left = style.x;
                        this.top = style.y;
                    };
                    Zoom.prototype.setActualSize = function(index, event) {
                        var _this = this;
                        if (!this.isImageSlide() || this.core.outer.hasClass("lg-first-slide-loading")) return;
                        var scale = this.getCurrentImageActualSizeScale();
                        if (this.core.outer.hasClass("lg-zoomed")) this.scale = 1; else this.scale = this.getScale(scale);
                        this.setPageCords(event);
                        this.beginZoom(this.scale);
                        this.zoomImage(this.scale);
                        setTimeout((function() {
                            _this.core.outer.removeClass("lg-grabbing").addClass("lg-grab");
                        }), 10);
                    };
                    Zoom.prototype.getNaturalWidth = function(index) {
                        var $image = this.core.getSlideItem(index).find(".lg-image").first();
                        var naturalWidth = this.core.galleryItems[index].width;
                        return naturalWidth ? parseFloat(naturalWidth) : $image.get().naturalWidth;
                    };
                    Zoom.prototype.getActualSizeScale = function(naturalWidth, width) {
                        var _scale;
                        var scale;
                        if (naturalWidth > width) {
                            _scale = naturalWidth / width;
                            scale = _scale || 2;
                        } else scale = 1;
                        return scale;
                    };
                    Zoom.prototype.getCurrentImageActualSizeScale = function() {
                        var $image = this.core.getSlideItem(this.core.index).find(".lg-image").first();
                        var width = $image.get().offsetWidth;
                        var naturalWidth = this.getNaturalWidth(this.core.index) || width;
                        return this.getActualSizeScale(naturalWidth, width);
                    };
                    Zoom.prototype.getPageCords = function(event) {
                        var cords = {};
                        if (event) {
                            cords.x = event.pageX || event.targetTouches[0].pageX;
                            cords.y = event.pageY || event.targetTouches[0].pageY;
                        } else {
                            var containerRect = this.core.outer.get().getBoundingClientRect();
                            cords.x = containerRect.width / 2 + containerRect.left;
                            cords.y = containerRect.height / 2 + this.scrollTop + containerRect.top;
                        }
                        return cords;
                    };
                    Zoom.prototype.setPageCords = function(event) {
                        var pageCords = this.getPageCords(event);
                        this.pageX = pageCords.x;
                        this.pageY = pageCords.y;
                    };
                    Zoom.prototype.beginZoom = function(scale) {
                        this.core.outer.removeClass("lg-zoom-drag-transition lg-zoom-dragging");
                        if (scale > 1) {
                            this.core.outer.addClass("lg-zoomed");
                            var $actualSize = this.core.getElementById("lg-actual-size");
                            $actualSize.removeClass(this.settings.actualSizeIcons.zoomIn).addClass(this.settings.actualSizeIcons.zoomOut);
                        } else this.resetZoom();
                        return scale > 1;
                    };
                    Zoom.prototype.getScale = function(scale) {
                        var actualSizeScale = this.getCurrentImageActualSizeScale();
                        if (scale < 1) scale = 1; else if (scale > actualSizeScale) scale = actualSizeScale;
                        return scale;
                    };
                    Zoom.prototype.init = function() {
                        var _this = this;
                        if (!this.settings.zoom) return;
                        this.buildTemplates();
                        this.enableZoomOnSlideItemLoad();
                        var tapped = null;
                        this.core.outer.on("dblclick.lg", (function(event) {
                            if (!_this.$LG(event.target).hasClass("lg-image")) return;
                            _this.setActualSize(_this.core.index, event);
                        }));
                        this.core.outer.on("touchstart.lg", (function(event) {
                            var $target = _this.$LG(event.target);
                            if (1 === event.targetTouches.length && $target.hasClass("lg-image")) if (!tapped) tapped = setTimeout((function() {
                                tapped = null;
                            }), 300); else {
                                clearTimeout(tapped);
                                tapped = null;
                                event.preventDefault();
                                _this.setActualSize(_this.core.index, event);
                            }
                        }));
                        this.core.LGel.on(lGEvents.containerResize + ".zoom " + lGEvents.rotateRight + ".zoom " + lGEvents.rotateLeft + ".zoom " + lGEvents.flipHorizontal + ".zoom " + lGEvents.flipVertical + ".zoom", (function() {
                            if (!_this.core.lgOpened || !_this.isImageSlide()) return;
                            _this.setPageCords();
                            _this.setZoomEssentials();
                            _this.zoomImage(_this.scale);
                        }));
                        this.$LG(window).on("scroll.lg.zoom.global" + this.core.lgId, (function() {
                            if (!_this.core.lgOpened) return;
                            _this.scrollTop = _this.$LG(window).scrollTop();
                        }));
                        this.core.getElementById("lg-zoom-out").on("click.lg", (function() {
                            if (_this.core.outer.find(".lg-current .lg-image").get()) {
                                _this.scale -= _this.settings.scale;
                                _this.scale = _this.getScale(_this.scale);
                                _this.beginZoom(_this.scale);
                                _this.zoomImage(_this.scale);
                            }
                        }));
                        this.core.getElementById("lg-zoom-in").on("click.lg", (function() {
                            _this.zoomIn();
                        }));
                        this.core.getElementById("lg-actual-size").on("click.lg", (function() {
                            _this.setActualSize(_this.core.index);
                        }));
                        this.core.LGel.on(lGEvents.beforeOpen + ".zoom", (function() {
                            _this.core.outer.find(".lg-item").removeClass("lg-zoomable");
                        }));
                        this.core.LGel.on(lGEvents.afterOpen + ".zoom", (function() {
                            _this.scrollTop = _this.$LG(window).scrollTop();
                            _this.pageX = _this.core.outer.width() / 2;
                            _this.pageY = _this.core.outer.height() / 2 + _this.scrollTop;
                            _this.scale = 1;
                        }));
                        this.core.LGel.on(lGEvents.afterSlide + ".zoom", (function(event) {
                            var prevIndex = event.detail.prevIndex;
                            _this.scale = 1;
                            _this.positionChanged = false;
                            _this.resetZoom(prevIndex);
                            if (_this.isImageSlide()) _this.setZoomEssentials();
                        }));
                        this.zoomDrag();
                        this.pinchZoom();
                        this.zoomSwipe();
                        this.zoomableTimeout = false;
                        this.positionChanged = false;
                    };
                    Zoom.prototype.zoomIn = function(scale) {
                        if (!this.isImageSlide()) return;
                        if (scale) this.scale = scale; else this.scale += this.settings.scale;
                        this.scale = this.getScale(this.scale);
                        this.beginZoom(this.scale);
                        this.zoomImage(this.scale);
                    };
                    Zoom.prototype.resetZoom = function(index) {
                        this.core.outer.removeClass("lg-zoomed lg-zoom-drag-transition");
                        var $actualSize = this.core.getElementById("lg-actual-size");
                        var $item = this.core.getSlideItem(void 0 !== index ? index : this.core.index);
                        $actualSize.removeClass(this.settings.actualSizeIcons.zoomOut).addClass(this.settings.actualSizeIcons.zoomIn);
                        $item.find(".lg-img-wrap").first().removeAttr("style");
                        $item.find(".lg-image").first().removeAttr("style");
                        this.scale = 1;
                        this.left = 0;
                        this.top = 0;
                        this.setPageCords();
                    };
                    Zoom.prototype.getTouchDistance = function(e) {
                        return Math.sqrt((e.targetTouches[0].pageX - e.targetTouches[1].pageX) * (e.targetTouches[0].pageX - e.targetTouches[1].pageX) + (e.targetTouches[0].pageY - e.targetTouches[1].pageY) * (e.targetTouches[0].pageY - e.targetTouches[1].pageY));
                    };
                    Zoom.prototype.pinchZoom = function() {
                        var _this = this;
                        var startDist = 0;
                        var pinchStarted = false;
                        var initScale = 1;
                        var $item = this.core.getSlideItem(this.core.index);
                        this.core.$inner.on("touchstart.lg", (function(e) {
                            $item = _this.core.getSlideItem(_this.core.index);
                            if (!_this.isImageSlide()) return;
                            if (2 === e.targetTouches.length && !_this.core.outer.hasClass("lg-first-slide-loading") && (_this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target))) {
                                initScale = _this.scale || 1;
                                _this.core.outer.removeClass("lg-zoom-drag-transition lg-zoom-dragging");
                                _this.core.touchAction = "pinch";
                                startDist = _this.getTouchDistance(e);
                            }
                        }));
                        this.core.$inner.on("touchmove.lg", (function(e) {
                            if (2 === e.targetTouches.length && "pinch" === _this.core.touchAction && (_this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target))) {
                                e.preventDefault();
                                var endDist = _this.getTouchDistance(e);
                                var distance = startDist - endDist;
                                if (!pinchStarted && Math.abs(distance) > 5) pinchStarted = true;
                                if (pinchStarted) {
                                    _this.scale = Math.max(1, initScale + .008 * -distance);
                                    _this.zoomImage(_this.scale);
                                }
                            }
                        }));
                        this.core.$inner.on("touchend.lg", (function(e) {
                            if ("pinch" === _this.core.touchAction && (_this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target))) {
                                pinchStarted = false;
                                startDist = 0;
                                if (_this.scale <= 1) _this.resetZoom(); else {
                                    _this.scale = _this.getScale(_this.scale);
                                    _this.zoomImage(_this.scale);
                                    _this.core.outer.addClass("lg-zoomed");
                                }
                                _this.core.touchAction = void 0;
                            }
                        }));
                    };
                    Zoom.prototype.touchendZoom = function(startCoords, endCoords, allowX, allowY, touchDuration, rotateValue) {
                        var distanceXnew = endCoords.x - startCoords.x;
                        var distanceYnew = endCoords.y - startCoords.y;
                        var speedX = Math.abs(distanceXnew) / touchDuration + 1;
                        var speedY = Math.abs(distanceYnew) / touchDuration + 1;
                        if (speedX > 2) speedX += 1;
                        if (speedY > 2) speedY += 1;
                        distanceXnew *= speedX;
                        distanceYnew *= speedY;
                        var _LGel = this.core.getSlideItem(this.core.index).find(".lg-img-wrap").first();
                        var distance = {};
                        distance.x = this.left + distanceXnew * this.modifierX;
                        distance.y = this.top + distanceYnew * this.modifierY;
                        var possibleSwipeCords = this.getPossibleSwipeDragCords(rotateValue);
                        if (Math.abs(distanceXnew) > 15 || Math.abs(distanceYnew) > 15) {
                            if (allowY) if (this.isBeyondPossibleTop(distance.y, possibleSwipeCords.minY)) distance.y = possibleSwipeCords.minY; else if (this.isBeyondPossibleBottom(distance.y, possibleSwipeCords.maxY)) distance.y = possibleSwipeCords.maxY;
                            if (allowX) if (this.isBeyondPossibleLeft(distance.x, possibleSwipeCords.minX)) distance.x = possibleSwipeCords.minX; else if (this.isBeyondPossibleRight(distance.x, possibleSwipeCords.maxX)) distance.x = possibleSwipeCords.maxX;
                            if (allowY) this.top = distance.y; else distance.y = this.top;
                            if (allowX) this.left = distance.x; else distance.x = this.left;
                            this.setZoomSwipeStyles(_LGel, distance);
                            this.positionChanged = true;
                        }
                    };
                    Zoom.prototype.getZoomSwipeCords = function(startCoords, endCoords, allowX, allowY, possibleSwipeCords) {
                        var distance = {};
                        if (allowY) {
                            distance.y = this.top + (endCoords.y - startCoords.y) * this.modifierY;
                            if (this.isBeyondPossibleTop(distance.y, possibleSwipeCords.minY)) {
                                var diffMinY = possibleSwipeCords.minY - distance.y;
                                distance.y = possibleSwipeCords.minY - diffMinY / 6;
                            } else if (this.isBeyondPossibleBottom(distance.y, possibleSwipeCords.maxY)) {
                                var diffMaxY = distance.y - possibleSwipeCords.maxY;
                                distance.y = possibleSwipeCords.maxY + diffMaxY / 6;
                            }
                        } else distance.y = this.top;
                        if (allowX) {
                            distance.x = this.left + (endCoords.x - startCoords.x) * this.modifierX;
                            if (this.isBeyondPossibleLeft(distance.x, possibleSwipeCords.minX)) {
                                var diffMinX = possibleSwipeCords.minX - distance.x;
                                distance.x = possibleSwipeCords.minX - diffMinX / 6;
                            } else if (this.isBeyondPossibleRight(distance.x, possibleSwipeCords.maxX)) {
                                var difMaxX = distance.x - possibleSwipeCords.maxX;
                                distance.x = possibleSwipeCords.maxX + difMaxX / 6;
                            }
                        } else distance.x = this.left;
                        return distance;
                    };
                    Zoom.prototype.isBeyondPossibleLeft = function(x, minX) {
                        return x >= minX;
                    };
                    Zoom.prototype.isBeyondPossibleRight = function(x, maxX) {
                        return x <= maxX;
                    };
                    Zoom.prototype.isBeyondPossibleTop = function(y, minY) {
                        return y >= minY;
                    };
                    Zoom.prototype.isBeyondPossibleBottom = function(y, maxY) {
                        return y <= maxY;
                    };
                    Zoom.prototype.isImageSlide = function() {
                        var currentItem = this.core.galleryItems[this.core.index];
                        return "image" === this.core.getSlideType(currentItem);
                    };
                    Zoom.prototype.getPossibleSwipeDragCords = function(rotateValue, scale) {
                        var dataScale = scale || this.scale || 1;
                        var elDataScale = Math.abs(dataScale);
                        var _a = this.core.mediaContainerPosition, top = _a.top, bottom = _a.bottom;
                        var topBottomSpacing = Math.abs(top - bottom) / 2;
                        var minY = (this.imageYSize - this.containerRect.height) / 2 + topBottomSpacing * this.modifierX;
                        var maxY = this.containerRect.height - this.imageYSize * elDataScale + minY;
                        var minX = (this.imageXSize - this.containerRect.width) / 2;
                        var maxX = this.containerRect.width - this.imageXSize * elDataScale + minX;
                        var possibleSwipeCords = {
                            minY,
                            maxY,
                            minX,
                            maxX
                        };
                        if (90 === Math.abs(rotateValue)) possibleSwipeCords = {
                            minY: minX,
                            maxY: maxX,
                            minX: minY,
                            maxX: maxY
                        };
                        return possibleSwipeCords;
                    };
                    Zoom.prototype.setZoomSwipeStyles = function(LGel, distance) {
                        LGel.css("transform", "translate3d(" + distance.x + "px, " + distance.y + "px, 0)");
                    };
                    Zoom.prototype.zoomSwipe = function() {
                        var _this = this;
                        var startCoords = {};
                        var endCoords = {};
                        var isMoved = false;
                        var allowX = false;
                        var allowY = false;
                        var startTime = new Date;
                        var endTime = new Date;
                        var possibleSwipeCords;
                        var _LGel;
                        var $item = this.core.getSlideItem(this.core.index);
                        this.core.$inner.on("touchstart.lg", (function(e) {
                            if (!_this.isImageSlide()) return;
                            $item = _this.core.getSlideItem(_this.core.index);
                            if ((_this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target)) && 1 === e.targetTouches.length && _this.core.outer.hasClass("lg-zoomed")) {
                                e.preventDefault();
                                startTime = new Date;
                                _this.core.touchAction = "zoomSwipe";
                                _LGel = _this.core.getSlideItem(_this.core.index).find(".lg-img-wrap").first();
                                var dragAllowedAxises = _this.getDragAllowedAxises(Math.abs(_this.rotateValue));
                                allowY = dragAllowedAxises.allowY;
                                allowX = dragAllowedAxises.allowX;
                                if (allowX || allowY) startCoords = _this.getSwipeCords(e, Math.abs(_this.rotateValue));
                                possibleSwipeCords = _this.getPossibleSwipeDragCords(_this.rotateValue);
                                _this.core.outer.addClass("lg-zoom-dragging lg-zoom-drag-transition");
                            }
                        }));
                        this.core.$inner.on("touchmove.lg", (function(e) {
                            if (1 === e.targetTouches.length && "zoomSwipe" === _this.core.touchAction && (_this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target))) {
                                e.preventDefault();
                                _this.core.touchAction = "zoomSwipe";
                                endCoords = _this.getSwipeCords(e, Math.abs(_this.rotateValue));
                                var distance = _this.getZoomSwipeCords(startCoords, endCoords, allowX, allowY, possibleSwipeCords);
                                if (Math.abs(endCoords.x - startCoords.x) > 15 || Math.abs(endCoords.y - startCoords.y) > 15) {
                                    isMoved = true;
                                    _this.setZoomSwipeStyles(_LGel, distance);
                                }
                            }
                        }));
                        this.core.$inner.on("touchend.lg", (function(e) {
                            if ("zoomSwipe" === _this.core.touchAction && (_this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target))) {
                                _this.core.touchAction = void 0;
                                _this.core.outer.removeClass("lg-zoom-dragging");
                                if (!isMoved) return;
                                isMoved = false;
                                endTime = new Date;
                                var touchDuration = endTime.valueOf() - startTime.valueOf();
                                _this.touchendZoom(startCoords, endCoords, allowX, allowY, touchDuration, _this.rotateValue);
                            }
                        }));
                    };
                    Zoom.prototype.zoomDrag = function() {
                        var _this = this;
                        var startCoords = {};
                        var endCoords = {};
                        var isDragging = false;
                        var isMoved = false;
                        var allowX = false;
                        var allowY = false;
                        var startTime;
                        var endTime;
                        var possibleSwipeCords;
                        var _LGel;
                        this.core.outer.on("mousedown.lg.zoom", (function(e) {
                            if (!_this.isImageSlide()) return;
                            var $item = _this.core.getSlideItem(_this.core.index);
                            if (_this.$LG(e.target).hasClass("lg-item") || $item.get().contains(e.target)) {
                                startTime = new Date;
                                _LGel = _this.core.getSlideItem(_this.core.index).find(".lg-img-wrap").first();
                                var dragAllowedAxises = _this.getDragAllowedAxises(Math.abs(_this.rotateValue));
                                allowY = dragAllowedAxises.allowY;
                                allowX = dragAllowedAxises.allowX;
                                if (_this.core.outer.hasClass("lg-zoomed")) if (_this.$LG(e.target).hasClass("lg-object") && (allowX || allowY)) {
                                    e.preventDefault();
                                    startCoords = _this.getDragCords(e, Math.abs(_this.rotateValue));
                                    possibleSwipeCords = _this.getPossibleSwipeDragCords(_this.rotateValue);
                                    isDragging = true;
                                    _this.core.outer.get().scrollLeft += 1;
                                    _this.core.outer.get().scrollLeft -= 1;
                                    _this.core.outer.removeClass("lg-grab").addClass("lg-grabbing lg-zoom-drag-transition lg-zoom-dragging");
                                }
                            }
                        }));
                        this.$LG(window).on("mousemove.lg.zoom.global" + this.core.lgId, (function(e) {
                            if (isDragging) {
                                isMoved = true;
                                endCoords = _this.getDragCords(e, Math.abs(_this.rotateValue));
                                var distance = _this.getZoomSwipeCords(startCoords, endCoords, allowX, allowY, possibleSwipeCords);
                                _this.setZoomSwipeStyles(_LGel, distance);
                            }
                        }));
                        this.$LG(window).on("mouseup.lg.zoom.global" + this.core.lgId, (function(e) {
                            if (isDragging) {
                                endTime = new Date;
                                isDragging = false;
                                _this.core.outer.removeClass("lg-zoom-dragging");
                                if (isMoved && (startCoords.x !== endCoords.x || startCoords.y !== endCoords.y)) {
                                    endCoords = _this.getDragCords(e, Math.abs(_this.rotateValue));
                                    var touchDuration = endTime.valueOf() - startTime.valueOf();
                                    _this.touchendZoom(startCoords, endCoords, allowX, allowY, touchDuration, _this.rotateValue);
                                }
                                isMoved = false;
                            }
                            _this.core.outer.removeClass("lg-grabbing").addClass("lg-grab");
                        }));
                    };
                    Zoom.prototype.closeGallery = function() {
                        this.resetZoom();
                    };
                    Zoom.prototype.destroy = function() {
                        this.$LG(window).off(".lg.zoom.global" + this.core.lgId);
                        this.core.LGel.off(".lg.zoom");
                        this.core.LGel.off(".zoom");
                        clearTimeout(this.zoomableTimeout);
                        this.zoomableTimeout = false;
                    };
                    return Zoom;
                }();
                return Zoom;
            }));
        },
        732: function(module) {
            !function(n, t) {
                true ? module.exports = t() : 0;
            }(0, (function() {
                "use strict";
                function n() {
                    return n = Object.assign || function(n) {
                        for (var t = 1; t < arguments.length; t++) {
                            var e = arguments[t];
                            for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (n[i] = e[i]);
                        }
                        return n;
                    }, n.apply(this, arguments);
                }
                var t = "undefined" != typeof window, e = t && !("onscroll" in window) || "undefined" != typeof navigator && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent), i = t && "IntersectionObserver" in window, o = t && "classList" in document.createElement("p"), a = t && window.devicePixelRatio > 1, r = {
                    elements_selector: ".lazy",
                    container: e || t ? document : null,
                    threshold: 300,
                    thresholds: null,
                    data_src: "src",
                    data_srcset: "srcset",
                    data_sizes: "sizes",
                    data_bg: "bg",
                    data_bg_hidpi: "bg-hidpi",
                    data_bg_multi: "bg-multi",
                    data_bg_multi_hidpi: "bg-multi-hidpi",
                    data_poster: "poster",
                    class_applied: "applied",
                    class_loading: "loading",
                    class_loaded: "loaded",
                    class_error: "error",
                    class_entered: "entered",
                    class_exited: "exited",
                    unobserve_completed: !0,
                    unobserve_entered: !1,
                    cancel_on_exit: !0,
                    callback_enter: null,
                    callback_exit: null,
                    callback_applied: null,
                    callback_loading: null,
                    callback_loaded: null,
                    callback_error: null,
                    callback_finish: null,
                    callback_cancel: null,
                    use_native: !1
                }, c = function(t) {
                    return n({}, r, t);
                }, u = function(n, t) {
                    var e, i = "LazyLoad::Initialized", o = new n(t);
                    try {
                        e = new CustomEvent(i, {
                            detail: {
                                instance: o
                            }
                        });
                    } catch (n) {
                        (e = document.createEvent("CustomEvent")).initCustomEvent(i, !1, !1, {
                            instance: o
                        });
                    }
                    window.dispatchEvent(e);
                }, l = "src", s = "srcset", f = "sizes", d = "poster", _ = "llOriginalAttrs", g = "loading", v = "loaded", b = "applied", p = "error", h = "native", m = "data-", E = "ll-status", I = function(n, t) {
                    return n.getAttribute(m + t);
                }, y = function(n) {
                    return I(n, E);
                }, A = function(n, t) {
                    return function(n, t, e) {
                        var i = "data-ll-status";
                        null !== e ? n.setAttribute(i, e) : n.removeAttribute(i);
                    }(n, 0, t);
                }, k = function(n) {
                    return A(n, null);
                }, L = function(n) {
                    return null === y(n);
                }, w = function(n) {
                    return y(n) === h;
                }, x = [ g, v, b, p ], O = function(n, t, e, i) {
                    n && (void 0 === i ? void 0 === e ? n(t) : n(t, e) : n(t, e, i));
                }, N = function(n, t) {
                    o ? n.classList.add(t) : n.className += (n.className ? " " : "") + t;
                }, C = function(n, t) {
                    o ? n.classList.remove(t) : n.className = n.className.replace(new RegExp("(^|\\s+)" + t + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");
                }, M = function(n) {
                    return n.llTempImage;
                }, z = function(n, t) {
                    if (t) {
                        var e = t._observer;
                        e && e.unobserve(n);
                    }
                }, R = function(n, t) {
                    n && (n.loadingCount += t);
                }, T = function(n, t) {
                    n && (n.toLoadCount = t);
                }, G = function(n) {
                    for (var t, e = [], i = 0; t = n.children[i]; i += 1) "SOURCE" === t.tagName && e.push(t);
                    return e;
                }, D = function(n, t) {
                    var e = n.parentNode;
                    e && "PICTURE" === e.tagName && G(e).forEach(t);
                }, V = function(n, t) {
                    G(n).forEach(t);
                }, F = [ l ], j = [ l, d ], P = [ l, s, f ], S = function(n) {
                    return !!n[_];
                }, U = function(n) {
                    return n[_];
                }, $ = function(n) {
                    return delete n[_];
                }, q = function(n, t) {
                    if (!S(n)) {
                        var e = {};
                        t.forEach((function(t) {
                            e[t] = n.getAttribute(t);
                        })), n[_] = e;
                    }
                }, H = function(n, t) {
                    if (S(n)) {
                        var e = U(n);
                        t.forEach((function(t) {
                            !function(n, t, e) {
                                e ? n.setAttribute(t, e) : n.removeAttribute(t);
                            }(n, t, e[t]);
                        }));
                    }
                }, B = function(n, t, e) {
                    N(n, t.class_loading), A(n, g), e && (R(e, 1), O(t.callback_loading, n, e));
                }, J = function(n, t, e) {
                    e && n.setAttribute(t, e);
                }, K = function(n, t) {
                    J(n, f, I(n, t.data_sizes)), J(n, s, I(n, t.data_srcset)), J(n, l, I(n, t.data_src));
                }, Q = {
                    IMG: function(n, t) {
                        D(n, (function(n) {
                            q(n, P), K(n, t);
                        })), q(n, P), K(n, t);
                    },
                    IFRAME: function(n, t) {
                        q(n, F), J(n, l, I(n, t.data_src));
                    },
                    VIDEO: function(n, t) {
                        V(n, (function(n) {
                            q(n, F), J(n, l, I(n, t.data_src));
                        })), q(n, j), J(n, d, I(n, t.data_poster)), J(n, l, I(n, t.data_src)), n.load();
                    }
                }, W = [ "IMG", "IFRAME", "VIDEO" ], X = function(n, t) {
                    !t || function(n) {
                        return n.loadingCount > 0;
                    }(t) || function(n) {
                        return n.toLoadCount > 0;
                    }(t) || O(n.callback_finish, t);
                }, Y = function(n, t, e) {
                    n.addEventListener(t, e), n.llEvLisnrs[t] = e;
                }, Z = function(n, t, e) {
                    n.removeEventListener(t, e);
                }, nn = function(n) {
                    return !!n.llEvLisnrs;
                }, tn = function(n) {
                    if (nn(n)) {
                        var t = n.llEvLisnrs;
                        for (var e in t) {
                            var i = t[e];
                            Z(n, e, i);
                        }
                        delete n.llEvLisnrs;
                    }
                }, en = function(n, t, e) {
                    !function(n) {
                        delete n.llTempImage;
                    }(n), R(e, -1), function(n) {
                        n && (n.toLoadCount -= 1);
                    }(e), C(n, t.class_loading), t.unobserve_completed && z(n, e);
                }, on = function(n, t, e) {
                    var i = M(n) || n;
                    nn(i) || function(n, t, e) {
                        nn(n) || (n.llEvLisnrs = {});
                        var i = "VIDEO" === n.tagName ? "loadeddata" : "load";
                        Y(n, i, t), Y(n, "error", e);
                    }(i, (function(o) {
                        !function(n, t, e, i) {
                            var o = w(t);
                            en(t, e, i), N(t, e.class_loaded), A(t, v), O(e.callback_loaded, t, i), o || X(e, i);
                        }(0, n, t, e), tn(i);
                    }), (function(o) {
                        !function(n, t, e, i) {
                            var o = w(t);
                            en(t, e, i), N(t, e.class_error), A(t, p), O(e.callback_error, t, i), o || X(e, i);
                        }(0, n, t, e), tn(i);
                    }));
                }, an = function(n, t, e) {
                    !function(n) {
                        n.llTempImage = document.createElement("IMG");
                    }(n), on(n, t, e), function(n) {
                        S(n) || (n[_] = {
                            backgroundImage: n.style.backgroundImage
                        });
                    }(n), function(n, t, e) {
                        var i = I(n, t.data_bg), o = I(n, t.data_bg_hidpi), r = a && o ? o : i;
                        r && (n.style.backgroundImage = 'url("'.concat(r, '")'), M(n).setAttribute(l, r), 
                        B(n, t, e));
                    }(n, t, e), function(n, t, e) {
                        var i = I(n, t.data_bg_multi), o = I(n, t.data_bg_multi_hidpi), r = a && o ? o : i;
                        r && (n.style.backgroundImage = r, function(n, t, e) {
                            N(n, t.class_applied), A(n, b), e && (t.unobserve_completed && z(n, t), O(t.callback_applied, n, e));
                        }(n, t, e));
                    }(n, t, e);
                }, rn = function(n, t, e) {
                    !function(n) {
                        return W.indexOf(n.tagName) > -1;
                    }(n) ? an(n, t, e) : function(n, t, e) {
                        on(n, t, e), function(n, t, e) {
                            var i = Q[n.tagName];
                            i && (i(n, t), B(n, t, e));
                        }(n, t, e);
                    }(n, t, e);
                }, cn = function(n) {
                    n.removeAttribute(l), n.removeAttribute(s), n.removeAttribute(f);
                }, un = function(n) {
                    D(n, (function(n) {
                        H(n, P);
                    })), H(n, P);
                }, ln = {
                    IMG: un,
                    IFRAME: function(n) {
                        H(n, F);
                    },
                    VIDEO: function(n) {
                        V(n, (function(n) {
                            H(n, F);
                        })), H(n, j), n.load();
                    }
                }, sn = function(n, t) {
                    (function(n) {
                        var t = ln[n.tagName];
                        t ? t(n) : function(n) {
                            if (S(n)) {
                                var t = U(n);
                                n.style.backgroundImage = t.backgroundImage;
                            }
                        }(n);
                    })(n), function(n, t) {
                        L(n) || w(n) || (C(n, t.class_entered), C(n, t.class_exited), C(n, t.class_applied), 
                        C(n, t.class_loading), C(n, t.class_loaded), C(n, t.class_error));
                    }(n, t), k(n), $(n);
                }, fn = [ "IMG", "IFRAME", "VIDEO" ], dn = function(n) {
                    return n.use_native && "loading" in HTMLImageElement.prototype;
                }, _n = function(n, t, e) {
                    n.forEach((function(n) {
                        return function(n) {
                            return n.isIntersecting || n.intersectionRatio > 0;
                        }(n) ? function(n, t, e, i) {
                            var o = function(n) {
                                return x.indexOf(y(n)) >= 0;
                            }(n);
                            A(n, "entered"), N(n, e.class_entered), C(n, e.class_exited), function(n, t, e) {
                                t.unobserve_entered && z(n, e);
                            }(n, e, i), O(e.callback_enter, n, t, i), o || rn(n, e, i);
                        }(n.target, n, t, e) : function(n, t, e, i) {
                            L(n) || (N(n, e.class_exited), function(n, t, e, i) {
                                e.cancel_on_exit && function(n) {
                                    return y(n) === g;
                                }(n) && "IMG" === n.tagName && (tn(n), function(n) {
                                    D(n, (function(n) {
                                        cn(n);
                                    })), cn(n);
                                }(n), un(n), C(n, e.class_loading), R(i, -1), k(n), O(e.callback_cancel, n, t, i));
                            }(n, t, e, i), O(e.callback_exit, n, t, i));
                        }(n.target, n, t, e);
                    }));
                }, gn = function(n) {
                    return Array.prototype.slice.call(n);
                }, vn = function(n) {
                    return n.container.querySelectorAll(n.elements_selector);
                }, bn = function(n) {
                    return function(n) {
                        return y(n) === p;
                    }(n);
                }, pn = function(n, t) {
                    return function(n) {
                        return gn(n).filter(L);
                    }(n || vn(t));
                }, hn = function(n, e) {
                    var o = c(n);
                    this._settings = o, this.loadingCount = 0, function(n, t) {
                        i && !dn(n) && (t._observer = new IntersectionObserver((function(e) {
                            _n(e, n, t);
                        }), function(n) {
                            return {
                                root: n.container === document ? null : n.container,
                                rootMargin: n.thresholds || n.threshold + "px"
                            };
                        }(n)));
                    }(o, this), function(n, e) {
                        t && window.addEventListener("online", (function() {
                            !function(n, t) {
                                var e;
                                (e = vn(n), gn(e).filter(bn)).forEach((function(t) {
                                    C(t, n.class_error), k(t);
                                })), t.update();
                            }(n, e);
                        }));
                    }(o, this), this.update(e);
                };
                return hn.prototype = {
                    update: function(n) {
                        var t, o, a = this._settings, r = pn(n, a);
                        T(this, r.length), !e && i ? dn(a) ? function(n, t, e) {
                            n.forEach((function(n) {
                                -1 !== fn.indexOf(n.tagName) && function(n, t, e) {
                                    n.setAttribute("loading", "lazy"), on(n, t, e), function(n, t) {
                                        var e = Q[n.tagName];
                                        e && e(n, t);
                                    }(n, t), A(n, h);
                                }(n, t, e);
                            })), T(e, 0);
                        }(r, a, this) : (o = r, function(n) {
                            n.disconnect();
                        }(t = this._observer), function(n, t) {
                            t.forEach((function(t) {
                                n.observe(t);
                            }));
                        }(t, o)) : this.loadAll(r);
                    },
                    destroy: function() {
                        this._observer && this._observer.disconnect(), vn(this._settings).forEach((function(n) {
                            $(n);
                        })), delete this._observer, delete this._settings, delete this.loadingCount, delete this.toLoadCount;
                    },
                    loadAll: function(n) {
                        var t = this, e = this._settings;
                        pn(n, e).forEach((function(n) {
                            z(n, t), rn(n, e, t);
                        }));
                    },
                    restoreAll: function() {
                        var n = this._settings;
                        vn(n).forEach((function(t) {
                            sn(t, n);
                        }));
                    }
                }, hn.load = function(n, t) {
                    var e = c(t);
                    rn(n, e);
                }, hn.resetStatus = function(n) {
                    k(n);
                }, t && function(n, t) {
                    if (t) if (t.length) for (var e, i = 0; e = t[i]; i += 1) u(n, e); else u(n, t);
                }(hn, window.lazyLoadOptions), hn;
            }));
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        return module.exports;
    }
    (() => {
        "use strict";
        const flsModules = {};
        function isWebp() {
            function testWebP(callback) {
                const webP = new Image;
                webP.onload = webP.onerror = function() {
                    callback(2 == webP.height);
                };
                webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
            }
            testWebP((function(support) {
                const className = true === support ? "webp" : "no-webp";
                document.documentElement.classList.add(className);
            }));
        }
        function fullVHfix() {
            const fullScreens = document.querySelectorAll("[data-fullscreen]");
            if (fullScreens.length) {
                window.addEventListener("resize", fixHeight);
                function fixHeight() {
                    const vh = .01 * window.innerHeight;
                    document.documentElement.style.setProperty("--vh", `${vh}px`);
                }
                fixHeight();
            }
        }
        let bodyLockStatus = true;
        const bodyLockToggle = (delay = 500) => {
            if (document.documentElement.classList.contains("lock")) {
                bodyUnlock(delay);
                iconMenu.setAttribute("aria-expanded", "false");
            } else {
                bodyLock(delay);
                iconMenu.setAttribute("aria-expanded", "true");
            }
        };
        const bodyUnlock = (delay = 500) => {
            const body = document.querySelector("body");
            if (bodyLockStatus) {
                const lock_padding = document.querySelectorAll("[data-lp]");
                setTimeout((() => {
                    for (let index = 0; index < lock_padding.length; index++) {
                        const el = lock_padding[index];
                        el.style.paddingRight = "0px";
                    }
                    body.style.paddingRight = "0px";
                    document.documentElement.classList.remove("lock");
                }), delay);
                bodyLockStatus = false;
                setTimeout((function() {
                    bodyLockStatus = true;
                }), delay);
            }
        };
        const bodyLock = (delay = 500) => {
            const body = document.querySelector("body");
            if (bodyLockStatus) {
                const lock_padding = document.querySelectorAll("[data-lp]");
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = window.innerWidth - document.querySelector(".site-wrapper").offsetWidth + "px";
                }
                body.style.paddingRight = window.innerWidth - document.querySelector(".site-wrapper").offsetWidth + "px";
                document.documentElement.classList.add("lock");
                bodyLockStatus = false;
                setTimeout((function() {
                    bodyLockStatus = true;
                }), delay);
            }
        };
        const iconMenu = document.querySelector(".icon-menu");
        function menuInit() {
            if (iconMenu) iconMenu.addEventListener("click", (function(e) {
                if (bodyLockStatus) {
                    bodyLockToggle();
                    document.documentElement.classList.toggle("menu-open");
                }
            }));
        }
        var lazyload_min = __webpack_require__(732);
        new lazyload_min({
            elements_selector: "[data-src],[data-srcset]",
            class_loaded: "_lazy-loaded",
            use_native: true
        });
        /*!
 * lightgallery | 2.4.0 | January 29th 2022
 * http://www.lightgalleryjs.com/
 * Copyright (c) 2020 Sachin Neravath;
 * @license GPLv3
 */
        /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
        var __assign = function() {
            __assign = Object.assign || function __assign(t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                }
                return t;
            };
            return __assign.apply(this, arguments);
        };
        function __spreadArrays() {
            for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
            var r = Array(s), k = 0;
            for (i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, 
            k++) r[k] = a[j];
            return r;
        }
        var lGEvents = {
            afterAppendSlide: "lgAfterAppendSlide",
            init: "lgInit",
            hasVideo: "lgHasVideo",
            containerResize: "lgContainerResize",
            updateSlides: "lgUpdateSlides",
            afterAppendSubHtml: "lgAfterAppendSubHtml",
            beforeOpen: "lgBeforeOpen",
            afterOpen: "lgAfterOpen",
            slideItemLoad: "lgSlideItemLoad",
            beforeSlide: "lgBeforeSlide",
            afterSlide: "lgAfterSlide",
            posterClick: "lgPosterClick",
            dragStart: "lgDragStart",
            dragMove: "lgDragMove",
            dragEnd: "lgDragEnd",
            beforeNextSlide: "lgBeforeNextSlide",
            beforePrevSlide: "lgBeforePrevSlide",
            beforeClose: "lgBeforeClose",
            afterClose: "lgAfterClose",
            rotateLeft: "lgRotateLeft",
            rotateRight: "lgRotateRight",
            flipHorizontal: "lgFlipHorizontal",
            flipVertical: "lgFlipVertical",
            autoplay: "lgAutoplay",
            autoplayStart: "lgAutoplayStart",
            autoplayStop: "lgAutoplayStop"
        };
        var lightGalleryCoreSettings = {
            mode: "lg-slide",
            easing: "ease",
            speed: 400,
            licenseKey: "0000-0000-000-0000",
            height: "100%",
            width: "100%",
            addClass: "",
            startClass: "lg-start-zoom",
            backdropDuration: 300,
            container: "",
            startAnimationDuration: 400,
            zoomFromOrigin: true,
            hideBarsDelay: 0,
            showBarsAfter: 1e4,
            slideDelay: 0,
            supportLegacyBrowser: true,
            allowMediaOverlap: false,
            videoMaxSize: "1280-720",
            loadYouTubePoster: true,
            defaultCaptionHeight: 0,
            ariaLabelledby: "",
            ariaDescribedby: "",
            closable: true,
            swipeToClose: true,
            closeOnTap: true,
            showCloseIcon: true,
            showMaximizeIcon: false,
            loop: true,
            escKey: true,
            keyPress: true,
            controls: true,
            slideEndAnimation: true,
            hideControlOnEnd: false,
            mousewheel: false,
            getCaptionFromTitleOrAlt: true,
            appendSubHtmlTo: ".lg-sub-html",
            subHtmlSelectorRelative: false,
            preload: 2,
            numberOfSlideItemsInDom: 10,
            selector: "",
            selectWithin: "",
            nextHtml: "",
            prevHtml: "",
            index: 0,
            iframeWidth: "100%",
            iframeHeight: "100%",
            iframeMaxWidth: "100%",
            iframeMaxHeight: "100%",
            download: true,
            counter: true,
            appendCounterTo: ".lg-toolbar",
            swipeThreshold: 50,
            enableSwipe: true,
            enableDrag: true,
            dynamic: false,
            dynamicEl: [],
            extraProps: [],
            exThumbImage: "",
            isMobile: void 0,
            mobileSettings: {
                controls: false,
                showCloseIcon: false,
                download: false
            },
            plugins: [],
            strings: {
                closeGallery: "Close gallery",
                toggleMaximize: "Toggle maximize",
                previousSlide: "Previous slide",
                nextSlide: "Next slide",
                download: "Download",
                playVideo: "Play video"
            }
        };
        function initLgPolyfills() {
            (function() {
                if ("function" === typeof window.CustomEvent) return false;
                function CustomEvent(event, params) {
                    params = params || {
                        bubbles: false,
                        cancelable: false,
                        detail: null
                    };
                    var evt = document.createEvent("CustomEvent");
                    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                    return evt;
                }
                window.CustomEvent = CustomEvent;
            })();
            (function() {
                if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
            })();
        }
        var lgQuery = function() {
            function lgQuery(selector) {
                this.cssVenderPrefixes = [ "TransitionDuration", "TransitionTimingFunction", "Transform", "Transition" ];
                this.selector = this._getSelector(selector);
                this.firstElement = this._getFirstEl();
                return this;
            }
            lgQuery.generateUUID = function() {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function(c) {
                    var r = 16 * Math.random() | 0, v = "x" == c ? r : 3 & r | 8;
                    return v.toString(16);
                }));
            };
            lgQuery.prototype._getSelector = function(selector, context) {
                if (void 0 === context) context = document;
                if ("string" !== typeof selector) return selector;
                context = context || document;
                var fl = selector.substring(0, 1);
                if ("#" === fl) return context.querySelector(selector); else return context.querySelectorAll(selector);
            };
            lgQuery.prototype._each = function(func) {
                if (!this.selector) return this;
                if (void 0 !== this.selector.length) [].forEach.call(this.selector, func); else func(this.selector, 0);
                return this;
            };
            lgQuery.prototype._setCssVendorPrefix = function(el, cssProperty, value) {
                var property = cssProperty.replace(/-([a-z])/gi, (function(s, group1) {
                    return group1.toUpperCase();
                }));
                if (-1 !== this.cssVenderPrefixes.indexOf(property)) {
                    el.style[property.charAt(0).toLowerCase() + property.slice(1)] = value;
                    el.style["webkit" + property] = value;
                    el.style["moz" + property] = value;
                    el.style["ms" + property] = value;
                    el.style["o" + property] = value;
                } else el.style[property] = value;
            };
            lgQuery.prototype._getFirstEl = function() {
                if (this.selector && void 0 !== this.selector.length) return this.selector[0]; else return this.selector;
            };
            lgQuery.prototype.isEventMatched = function(event, eventName) {
                var eventNamespace = eventName.split(".");
                return event.split(".").filter((function(e) {
                    return e;
                })).every((function(e) {
                    return -1 !== eventNamespace.indexOf(e);
                }));
            };
            lgQuery.prototype.attr = function(attr, value) {
                if (void 0 === value) {
                    if (!this.firstElement) return "";
                    return this.firstElement.getAttribute(attr);
                }
                this._each((function(el) {
                    el.setAttribute(attr, value);
                }));
                return this;
            };
            lgQuery.prototype.find = function(selector) {
                return $LG(this._getSelector(selector, this.selector));
            };
            lgQuery.prototype.first = function() {
                if (this.selector && void 0 !== this.selector.length) return $LG(this.selector[0]); else return $LG(this.selector);
            };
            lgQuery.prototype.eq = function(index) {
                return $LG(this.selector[index]);
            };
            lgQuery.prototype.parent = function() {
                return $LG(this.selector.parentElement);
            };
            lgQuery.prototype.get = function() {
                return this._getFirstEl();
            };
            lgQuery.prototype.removeAttr = function(attributes) {
                var attrs = attributes.split(" ");
                this._each((function(el) {
                    attrs.forEach((function(attr) {
                        return el.removeAttribute(attr);
                    }));
                }));
                return this;
            };
            lgQuery.prototype.wrap = function(className) {
                if (!this.firstElement) return this;
                var wrapper = document.createElement("div");
                wrapper.className = className;
                this.firstElement.parentNode.insertBefore(wrapper, this.firstElement);
                this.firstElement.parentNode.removeChild(this.firstElement);
                wrapper.appendChild(this.firstElement);
                return this;
            };
            lgQuery.prototype.addClass = function(classNames) {
                if (void 0 === classNames) classNames = "";
                this._each((function(el) {
                    classNames.split(" ").forEach((function(className) {
                        if (className) el.classList.add(className);
                    }));
                }));
                return this;
            };
            lgQuery.prototype.removeClass = function(classNames) {
                this._each((function(el) {
                    classNames.split(" ").forEach((function(className) {
                        if (className) el.classList.remove(className);
                    }));
                }));
                return this;
            };
            lgQuery.prototype.hasClass = function(className) {
                if (!this.firstElement) return false;
                return this.firstElement.classList.contains(className);
            };
            lgQuery.prototype.hasAttribute = function(attribute) {
                if (!this.firstElement) return false;
                return this.firstElement.hasAttribute(attribute);
            };
            lgQuery.prototype.toggleClass = function(className) {
                if (!this.firstElement) return this;
                if (this.hasClass(className)) this.removeClass(className); else this.addClass(className);
                return this;
            };
            lgQuery.prototype.css = function(property, value) {
                var _this = this;
                this._each((function(el) {
                    _this._setCssVendorPrefix(el, property, value);
                }));
                return this;
            };
            lgQuery.prototype.on = function(events, listener) {
                var _this = this;
                if (!this.selector) return this;
                events.split(" ").forEach((function(event) {
                    if (!Array.isArray(lgQuery.eventListeners[event])) lgQuery.eventListeners[event] = [];
                    lgQuery.eventListeners[event].push(listener);
                    _this.selector.addEventListener(event.split(".")[0], listener);
                }));
                return this;
            };
            lgQuery.prototype.once = function(event, listener) {
                var _this = this;
                this.on(event, (function() {
                    _this.off(event);
                    listener(event);
                }));
                return this;
            };
            lgQuery.prototype.off = function(event) {
                var _this = this;
                if (!this.selector) return this;
                Object.keys(lgQuery.eventListeners).forEach((function(eventName) {
                    if (_this.isEventMatched(event, eventName)) {
                        lgQuery.eventListeners[eventName].forEach((function(listener) {
                            _this.selector.removeEventListener(eventName.split(".")[0], listener);
                        }));
                        lgQuery.eventListeners[eventName] = [];
                    }
                }));
                return this;
            };
            lgQuery.prototype.trigger = function(event, detail) {
                if (!this.firstElement) return this;
                var customEvent = new CustomEvent(event.split(".")[0], {
                    detail: detail || null
                });
                this.firstElement.dispatchEvent(customEvent);
                return this;
            };
            lgQuery.prototype.load = function(url) {
                var _this = this;
                fetch(url).then((function(res) {
                    return res.text();
                })).then((function(html) {
                    _this.selector.innerHTML = html;
                }));
                return this;
            };
            lgQuery.prototype.html = function(html) {
                if (void 0 === html) {
                    if (!this.firstElement) return "";
                    return this.firstElement.innerHTML;
                }
                this._each((function(el) {
                    el.innerHTML = html;
                }));
                return this;
            };
            lgQuery.prototype.append = function(html) {
                this._each((function(el) {
                    if ("string" === typeof html) el.insertAdjacentHTML("beforeend", html); else el.appendChild(html);
                }));
                return this;
            };
            lgQuery.prototype.prepend = function(html) {
                this._each((function(el) {
                    el.insertAdjacentHTML("afterbegin", html);
                }));
                return this;
            };
            lgQuery.prototype.remove = function() {
                this._each((function(el) {
                    el.parentNode.removeChild(el);
                }));
                return this;
            };
            lgQuery.prototype.empty = function() {
                this._each((function(el) {
                    el.innerHTML = "";
                }));
                return this;
            };
            lgQuery.prototype.scrollTop = function(scrollTop) {
                if (void 0 !== scrollTop) {
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                    return this;
                } else return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            };
            lgQuery.prototype.scrollLeft = function(scrollLeft) {
                if (void 0 !== scrollLeft) {
                    document.body.scrollLeft = scrollLeft;
                    document.documentElement.scrollLeft = scrollLeft;
                    return this;
                } else return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
            };
            lgQuery.prototype.offset = function() {
                if (!this.firstElement) return {
                    left: 0,
                    top: 0
                };
                var rect = this.firstElement.getBoundingClientRect();
                var bodyMarginLeft = $LG("body").style().marginLeft;
                return {
                    left: rect.left - parseFloat(bodyMarginLeft) + this.scrollLeft(),
                    top: rect.top + this.scrollTop()
                };
            };
            lgQuery.prototype.style = function() {
                if (!this.firstElement) return {};
                return this.firstElement.currentStyle || window.getComputedStyle(this.firstElement);
            };
            lgQuery.prototype.width = function() {
                var style = this.style();
                return this.firstElement.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
            };
            lgQuery.prototype.height = function() {
                var style = this.style();
                return this.firstElement.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
            };
            lgQuery.eventListeners = {};
            return lgQuery;
        }();
        function $LG(selector) {
            initLgPolyfills();
            return new lgQuery(selector);
        }
        var defaultDynamicOptions = [ "src", "sources", "subHtml", "subHtmlUrl", "html", "video", "poster", "slideName", "responsive", "srcset", "sizes", "iframe", "downloadUrl", "download", "width", "facebookShareUrl", "tweetText", "iframeTitle", "twitterShareUrl", "pinterestShareUrl", "pinterestText", "fbHtml", "disqusIdentifier", "disqusUrl" ];
        function convertToData(attr) {
            if ("href" === attr) return "src";
            attr = attr.replace("data-", "");
            attr = attr.charAt(0).toLowerCase() + attr.slice(1);
            attr = attr.replace(/-([a-z])/g, (function(g) {
                return g[1].toUpperCase();
            }));
            return attr;
        }
        var utils = {
            getSize: function(el, container, spacing, defaultLgSize) {
                if (void 0 === spacing) spacing = 0;
                var LGel = $LG(el);
                var lgSize = LGel.attr("data-lg-size") || defaultLgSize;
                if (!lgSize) return;
                var isResponsiveSizes = lgSize.split(",");
                if (isResponsiveSizes[1]) {
                    var wWidth = window.innerWidth;
                    for (var i = 0; i < isResponsiveSizes.length; i++) {
                        var size_1 = isResponsiveSizes[i];
                        var responsiveWidth = parseInt(size_1.split("-")[2], 10);
                        if (responsiveWidth > wWidth) {
                            lgSize = size_1;
                            break;
                        }
                        if (i === isResponsiveSizes.length - 1) lgSize = size_1;
                    }
                }
                var size = lgSize.split("-");
                var width = parseInt(size[0], 10);
                var height = parseInt(size[1], 10);
                var cWidth = container.width();
                var cHeight = container.height() - spacing;
                var maxWidth = Math.min(cWidth, width);
                var maxHeight = Math.min(cHeight, height);
                var ratio = Math.min(maxWidth / width, maxHeight / height);
                return {
                    width: width * ratio,
                    height: height * ratio
                };
            },
            getTransform: function(el, container, top, bottom, imageSize) {
                if (!imageSize) return;
                var LGel = $LG(el).find("img").first();
                if (!LGel.get()) return;
                var containerRect = container.get().getBoundingClientRect();
                var wWidth = containerRect.width;
                var wHeight = container.height() - (top + bottom);
                var elWidth = LGel.width();
                var elHeight = LGel.height();
                var elStyle = LGel.style();
                var x = (wWidth - elWidth) / 2 - LGel.offset().left + (parseFloat(elStyle.paddingLeft) || 0) + (parseFloat(elStyle.borderLeft) || 0) + $LG(window).scrollLeft() + containerRect.left;
                var y = (wHeight - elHeight) / 2 - LGel.offset().top + (parseFloat(elStyle.paddingTop) || 0) + (parseFloat(elStyle.borderTop) || 0) + $LG(window).scrollTop() + top;
                var scX = elWidth / imageSize.width;
                var scY = elHeight / imageSize.height;
                var transform = "translate3d(" + (x *= -1) + "px, " + (y *= -1) + "px, 0) scale3d(" + scX + ", " + scY + ", 1)";
                return transform;
            },
            getIframeMarkup: function(iframeWidth, iframeHeight, iframeMaxWidth, iframeMaxHeight, src, iframeTitle) {
                var title = iframeTitle ? 'title="' + iframeTitle + '"' : "";
                return '<div class="lg-video-cont lg-has-iframe" style="width:' + iframeWidth + "; max-width:" + iframeMaxWidth + "; height: " + iframeHeight + "; max-height:" + iframeMaxHeight + '">\n                    <iframe class="lg-object" frameborder="0" ' + title + ' src="' + src + '"  allowfullscreen="true"></iframe>\n                </div>';
            },
            getImgMarkup: function(index, src, altAttr, srcset, sizes, sources) {
                var srcsetAttr = srcset ? 'srcset="' + srcset + '"' : "";
                var sizesAttr = sizes ? 'sizes="' + sizes + '"' : "";
                var imgMarkup = "<img " + altAttr + " " + srcsetAttr + "  " + sizesAttr + ' class="lg-object lg-image" data-index="' + index + '" src="' + src + '" />';
                var sourceTag = "";
                if (sources) {
                    var sourceObj = "string" === typeof sources ? JSON.parse(sources) : sources;
                    sourceTag = sourceObj.map((function(source) {
                        var attrs = "";
                        Object.keys(source).forEach((function(key) {
                            attrs += " " + key + '="' + source[key] + '"';
                        }));
                        return "<source " + attrs + "></source>";
                    }));
                }
                return "" + sourceTag + imgMarkup;
            },
            getResponsiveSrc: function(srcItms) {
                var rsWidth = [];
                var rsSrc = [];
                var src = "";
                for (var i = 0; i < srcItms.length; i++) {
                    var _src = srcItms[i].split(" ");
                    if ("" === _src[0]) _src.splice(0, 1);
                    rsSrc.push(_src[0]);
                    rsWidth.push(_src[1]);
                }
                var wWidth = window.innerWidth;
                for (var j = 0; j < rsWidth.length; j++) if (parseInt(rsWidth[j], 10) > wWidth) {
                    src = rsSrc[j];
                    break;
                }
                return src;
            },
            isImageLoaded: function(img) {
                if (!img) return false;
                if (!img.complete) return false;
                if (0 === img.naturalWidth) return false;
                return true;
            },
            getVideoPosterMarkup: function(_poster, dummyImg, videoContStyle, playVideoString, _isVideo) {
                var videoClass = "";
                if (_isVideo && _isVideo.youtube) videoClass = "lg-has-youtube"; else if (_isVideo && _isVideo.vimeo) videoClass = "lg-has-vimeo"; else videoClass = "lg-has-html5";
                return '<div class="lg-video-cont ' + videoClass + '" style="' + videoContStyle + '">\n                <div class="lg-video-play-button">\n                <svg\n                    viewBox="0 0 20 20"\n                    preserveAspectRatio="xMidYMid"\n                    focusable="false"\n                    aria-labelledby="' + playVideoString + '"\n                    role="img"\n                    class="lg-video-play-icon"\n                >\n                    <title>' + playVideoString + '</title>\n                    <polygon class="lg-video-play-icon-inner" points="1,0 20,10 1,20"></polygon>\n                </svg>\n                <svg class="lg-video-play-icon-bg" viewBox="0 0 50 50" focusable="false">\n                    <circle cx="50%" cy="50%" r="20"></circle></svg>\n                <svg class="lg-video-play-icon-circle" viewBox="0 0 50 50" focusable="false">\n                    <circle cx="50%" cy="50%" r="20"></circle>\n                </svg>\n            </div>\n            ' + (dummyImg || "") + '\n            <img class="lg-object lg-video-poster" src="' + _poster + '" />\n        </div>';
            },
            getDynamicOptions: function(items, extraProps, getCaptionFromTitleOrAlt, exThumbImage) {
                var dynamicElements = [];
                var availableDynamicOptions = __spreadArrays(defaultDynamicOptions, extraProps);
                [].forEach.call(items, (function(item) {
                    var dynamicEl = {};
                    for (var i = 0; i < item.attributes.length; i++) {
                        var attr = item.attributes[i];
                        if (attr.specified) {
                            var dynamicAttr = convertToData(attr.name);
                            var label = "";
                            if (availableDynamicOptions.indexOf(dynamicAttr) > -1) label = dynamicAttr;
                            if (label) dynamicEl[label] = attr.value;
                        }
                    }
                    var currentItem = $LG(item);
                    var alt = currentItem.find("img").first().attr("alt");
                    var title = currentItem.attr("title");
                    var thumb = exThumbImage ? currentItem.attr(exThumbImage) : currentItem.find("img").first().attr("src");
                    dynamicEl.thumb = thumb;
                    if (getCaptionFromTitleOrAlt && !dynamicEl.subHtml) dynamicEl.subHtml = title || alt || "";
                    dynamicEl.alt = alt || title || "";
                    dynamicElements.push(dynamicEl);
                }));
                return dynamicElements;
            },
            isMobile: function() {
                return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            },
            isVideo: function(src, isHTML5VIdeo, index) {
                if (!src) if (isHTML5VIdeo) return {
                    html5: true
                }; else {
                    console.error("lightGallery :- data-src is not provided on slide item " + (index + 1) + ". Please make sure the selector property is properly configured. More info - https://www.lightgalleryjs.com/demos/html-markup/");
                    return;
                }
                var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com|be-nocookie\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)([\&|?][\S]*)*/i);
                var vimeo = src.match(/\/\/(?:www\.)?(?:player\.)?vimeo.com\/(?:video\/)?([0-9a-z\-_]+)(.*)?/i);
                var wistia = src.match(/https?:\/\/(.+)?(wistia\.com|wi\.st)\/(medias|embed)\/([0-9a-z\-_]+)(.*)/);
                if (youtube) return {
                    youtube
                }; else if (vimeo) return {
                    vimeo
                }; else if (wistia) return {
                    wistia
                };
            }
        };
        var lgId = 0;
        var LightGallery = function() {
            function LightGallery(element, options) {
                this.lgOpened = false;
                this.index = 0;
                this.plugins = [];
                this.lGalleryOn = false;
                this.lgBusy = false;
                this.currentItemsInDom = [];
                this.prevScrollTop = 0;
                this.isDummyImageRemoved = false;
                this.dragOrSwipeEnabled = false;
                this.mediaContainerPosition = {
                    top: 0,
                    bottom: 0
                };
                if (!element) return this;
                lgId++;
                this.lgId = lgId;
                this.el = element;
                this.LGel = $LG(element);
                this.generateSettings(options);
                this.buildModules();
                if (this.settings.dynamic && void 0 !== this.settings.dynamicEl && !Array.isArray(this.settings.dynamicEl)) throw "When using dynamic mode, you must also define dynamicEl as an Array.";
                this.galleryItems = this.getItems();
                this.normalizeSettings();
                this.init();
                this.validateLicense();
                return this;
            }
            LightGallery.prototype.generateSettings = function(options) {
                this.settings = __assign(__assign({}, lightGalleryCoreSettings), options);
                if (this.settings.isMobile && "function" === typeof this.settings.isMobile ? this.settings.isMobile() : utils.isMobile()) {
                    var mobileSettings = __assign(__assign({}, this.settings.mobileSettings), this.settings.mobileSettings);
                    this.settings = __assign(__assign({}, this.settings), mobileSettings);
                }
            };
            LightGallery.prototype.normalizeSettings = function() {
                if (this.settings.slideEndAnimation) this.settings.hideControlOnEnd = false;
                if (!this.settings.closable) this.settings.swipeToClose = false;
                this.zoomFromOrigin = this.settings.zoomFromOrigin;
                if (this.settings.dynamic) this.zoomFromOrigin = false;
                if (!this.settings.container) this.settings.container = document.body;
                this.settings.preload = Math.min(this.settings.preload, this.galleryItems.length);
            };
            LightGallery.prototype.init = function() {
                var _this = this;
                this.addSlideVideoInfo(this.galleryItems);
                this.buildStructure();
                this.LGel.trigger(lGEvents.init, {
                    instance: this
                });
                if (this.settings.keyPress) this.keyPress();
                setTimeout((function() {
                    _this.enableDrag();
                    _this.enableSwipe();
                    _this.triggerPosterClick();
                }), 50);
                this.arrow();
                if (this.settings.mousewheel) this.mousewheel();
                if (!this.settings.dynamic) this.openGalleryOnItemClick();
            };
            LightGallery.prototype.openGalleryOnItemClick = function() {
                var _this = this;
                var _loop_1 = function(index) {
                    var element = this_1.items[index];
                    var $element = $LG(element);
                    var uuid = lgQuery.generateUUID();
                    $element.attr("data-lg-id", uuid).on("click.lgcustom-item-" + uuid, (function(e) {
                        e.preventDefault();
                        var currentItemIndex = _this.settings.index || index;
                        _this.openGallery(currentItemIndex, element);
                    }));
                };
                var this_1 = this;
                for (var index = 0; index < this.items.length; index++) _loop_1(index);
            };
            LightGallery.prototype.buildModules = function() {
                var _this = this;
                this.settings.plugins.forEach((function(plugin) {
                    _this.plugins.push(new plugin(_this, $LG));
                }));
            };
            LightGallery.prototype.validateLicense = function() {
                if (!this.settings.licenseKey) console.error("Please provide a valid license key"); else if ("0000-0000-000-0000" === this.settings.licenseKey) console.warn("lightGallery: " + this.settings.licenseKey + " license key is not valid for production use");
            };
            LightGallery.prototype.getSlideItem = function(index) {
                return $LG(this.getSlideItemId(index));
            };
            LightGallery.prototype.getSlideItemId = function(index) {
                return "#lg-item-" + this.lgId + "-" + index;
            };
            LightGallery.prototype.getIdName = function(id) {
                return id + "-" + this.lgId;
            };
            LightGallery.prototype.getElementById = function(id) {
                return $LG("#" + this.getIdName(id));
            };
            LightGallery.prototype.manageSingleSlideClassName = function() {
                if (this.galleryItems.length < 2) this.outer.addClass("lg-single-item"); else this.outer.removeClass("lg-single-item");
            };
            LightGallery.prototype.buildStructure = function() {
                var _this = this;
                var container = this.$container && this.$container.get();
                if (container) return;
                var controls = "";
                var subHtmlCont = "";
                if (this.settings.controls) controls = '<button type="button" id="' + this.getIdName("lg-prev") + '" aria-label="' + this.settings.strings["previousSlide"] + '" class="lg-prev lg-icon"> ' + this.settings.prevHtml + ' </button>\n                <button type="button" id="' + this.getIdName("lg-next") + '" aria-label="' + this.settings.strings["nextSlide"] + '" class="lg-next lg-icon"> ' + this.settings.nextHtml + " </button>";
                if (".lg-item" !== this.settings.appendSubHtmlTo) subHtmlCont = '<div class="lg-sub-html" role="status" aria-live="polite"></div>';
                var addClasses = "";
                if (this.settings.allowMediaOverlap) addClasses += "lg-media-overlap ";
                var ariaLabelledby = this.settings.ariaLabelledby ? 'aria-labelledby="' + this.settings.ariaLabelledby + '"' : "";
                var ariaDescribedby = this.settings.ariaDescribedby ? 'aria-describedby="' + this.settings.ariaDescribedby + '"' : "";
                var containerClassName = "lg-container " + this.settings.addClass + " " + (document.body !== this.settings.container ? "lg-inline" : "");
                var closeIcon = this.settings.closable && this.settings.showCloseIcon ? '<button type="button" aria-label="' + this.settings.strings["closeGallery"] + '" id="' + this.getIdName("lg-close") + '" class="lg-close lg-icon"></button>' : "";
                var maximizeIcon = this.settings.showMaximizeIcon ? '<button type="button" aria-label="' + this.settings.strings["toggleMaximize"] + '" id="' + this.getIdName("lg-maximize") + '" class="lg-maximize lg-icon"></button>' : "";
                var template = '\n        <div class="' + containerClassName + '" id="' + this.getIdName("lg-container") + '" tabindex="-1" aria-modal="true" ' + ariaLabelledby + " " + ariaDescribedby + ' role="dialog"\n        >\n            <div id="' + this.getIdName("lg-backdrop") + '" class="lg-backdrop"></div>\n\n            <div id="' + this.getIdName("lg-outer") + '" class="lg-outer lg-use-css3 lg-css3 lg-hide-items ' + addClasses + ' ">\n\n              <div id="' + this.getIdName("lg-content") + '" class="lg-content">\n                <div id="' + this.getIdName("lg-inner") + '" class="lg-inner">\n                </div>\n                ' + controls + '\n              </div>\n                <div id="' + this.getIdName("lg-toolbar") + '" class="lg-toolbar lg-group">\n                    ' + maximizeIcon + "\n                    " + closeIcon + "\n                    </div>\n                    " + (".lg-outer" === this.settings.appendSubHtmlTo ? subHtmlCont : "") + '\n                <div id="' + this.getIdName("lg-components") + '" class="lg-components">\n                    ' + (".lg-sub-html" === this.settings.appendSubHtmlTo ? subHtmlCont : "") + "\n                </div>\n            </div>\n        </div>\n        ";
                $LG(this.settings.container).append(template);
                if (document.body !== this.settings.container) $LG(this.settings.container).css("position", "relative");
                this.outer = this.getElementById("lg-outer");
                this.$lgComponents = this.getElementById("lg-components");
                this.$backdrop = this.getElementById("lg-backdrop");
                this.$container = this.getElementById("lg-container");
                this.$inner = this.getElementById("lg-inner");
                this.$content = this.getElementById("lg-content");
                this.$toolbar = this.getElementById("lg-toolbar");
                this.$backdrop.css("transition-duration", this.settings.backdropDuration + "ms");
                var outerClassNames = this.settings.mode + " ";
                this.manageSingleSlideClassName();
                if (this.settings.enableDrag) outerClassNames += "lg-grab ";
                this.outer.addClass(outerClassNames);
                this.$inner.css("transition-timing-function", this.settings.easing);
                this.$inner.css("transition-duration", this.settings.speed + "ms");
                if (this.settings.download) this.$toolbar.append('<a id="' + this.getIdName("lg-download") + '" target="_blank" rel="noopener" aria-label="' + this.settings.strings["download"] + '" download class="lg-download lg-icon"></a>');
                this.counter();
                $LG(window).on("resize.lg.global" + this.lgId + " orientationchange.lg.global" + this.lgId, (function() {
                    _this.refreshOnResize();
                }));
                this.hideBars();
                this.manageCloseGallery();
                this.toggleMaximize();
                this.initModules();
            };
            LightGallery.prototype.refreshOnResize = function() {
                if (this.lgOpened) {
                    var currentGalleryItem = this.galleryItems[this.index];
                    var __slideVideoInfo = currentGalleryItem.__slideVideoInfo;
                    this.mediaContainerPosition = this.getMediaContainerPosition();
                    var _a = this.mediaContainerPosition, top_1 = _a.top, bottom = _a.bottom;
                    this.currentImageSize = utils.getSize(this.items[this.index], this.outer, top_1 + bottom, __slideVideoInfo && this.settings.videoMaxSize);
                    if (__slideVideoInfo) this.resizeVideoSlide(this.index, this.currentImageSize);
                    if (this.zoomFromOrigin && !this.isDummyImageRemoved) {
                        var imgStyle = this.getDummyImgStyles(this.currentImageSize);
                        this.outer.find(".lg-current .lg-dummy-img").first().attr("style", imgStyle);
                    }
                    this.LGel.trigger(lGEvents.containerResize);
                }
            };
            LightGallery.prototype.resizeVideoSlide = function(index, imageSize) {
                var lgVideoStyle = this.getVideoContStyle(imageSize);
                var currentSlide = this.getSlideItem(index);
                currentSlide.find(".lg-video-cont").attr("style", lgVideoStyle);
            };
            LightGallery.prototype.updateSlides = function(items, index) {
                if (this.index > items.length - 1) this.index = items.length - 1;
                if (1 === items.length) this.index = 0;
                if (!items.length) {
                    this.closeGallery();
                    return;
                }
                var currentSrc = this.galleryItems[index].src;
                this.galleryItems = items;
                this.updateControls();
                this.$inner.empty();
                this.currentItemsInDom = [];
                var _index = 0;
                this.galleryItems.some((function(galleryItem, itemIndex) {
                    if (galleryItem.src === currentSrc) {
                        _index = itemIndex;
                        return true;
                    }
                    return false;
                }));
                this.currentItemsInDom = this.organizeSlideItems(_index, -1);
                this.loadContent(_index, true);
                this.getSlideItem(_index).addClass("lg-current");
                this.index = _index;
                this.updateCurrentCounter(_index);
                this.LGel.trigger(lGEvents.updateSlides);
            };
            LightGallery.prototype.getItems = function() {
                this.items = [];
                if (!this.settings.dynamic) {
                    if ("this" === this.settings.selector) this.items.push(this.el); else if (this.settings.selector) if ("string" === typeof this.settings.selector) if (this.settings.selectWithin) {
                        var selectWithin = $LG(this.settings.selectWithin);
                        this.items = selectWithin.find(this.settings.selector).get();
                    } else this.items = this.el.querySelectorAll(this.settings.selector); else this.items = this.settings.selector; else this.items = this.el.children;
                    return utils.getDynamicOptions(this.items, this.settings.extraProps, this.settings.getCaptionFromTitleOrAlt, this.settings.exThumbImage);
                } else return this.settings.dynamicEl || [];
            };
            LightGallery.prototype.openGallery = function(index, element) {
                var _this = this;
                if (void 0 === index) index = this.settings.index;
                if (this.lgOpened) return;
                this.lgOpened = true;
                this.outer.get().focus();
                this.outer.removeClass("lg-hide-items");
                this.$container.addClass("lg-show");
                var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, index);
                this.currentItemsInDom = itemsToBeInsertedToDom;
                var items = "";
                itemsToBeInsertedToDom.forEach((function(item) {
                    items = items + '<div id="' + item + '" class="lg-item"></div>';
                }));
                this.$inner.append(items);
                this.addHtml(index);
                var transform = "";
                this.mediaContainerPosition = this.getMediaContainerPosition();
                var _a = this.mediaContainerPosition, top = _a.top, bottom = _a.bottom;
                if (!this.settings.allowMediaOverlap) this.setMediaContainerPosition(top, bottom);
                var __slideVideoInfo = this.galleryItems[index].__slideVideoInfo;
                if (this.zoomFromOrigin && element) {
                    this.currentImageSize = utils.getSize(element, this.outer, top + bottom, __slideVideoInfo && this.settings.videoMaxSize);
                    transform = utils.getTransform(element, this.outer, top, bottom, this.currentImageSize);
                }
                if (!this.zoomFromOrigin || !transform) {
                    this.outer.addClass(this.settings.startClass);
                    this.getSlideItem(index).removeClass("lg-complete");
                }
                var timeout = this.settings.zoomFromOrigin ? 100 : this.settings.backdropDuration;
                setTimeout((function() {
                    _this.outer.addClass("lg-components-open");
                }), timeout);
                this.index = index;
                this.LGel.trigger(lGEvents.beforeOpen);
                this.getSlideItem(index).addClass("lg-current");
                this.lGalleryOn = false;
                this.prevScrollTop = $LG(window).scrollTop();
                setTimeout((function() {
                    if (_this.zoomFromOrigin && transform) {
                        var currentSlide_1 = _this.getSlideItem(index);
                        currentSlide_1.css("transform", transform);
                        setTimeout((function() {
                            currentSlide_1.addClass("lg-start-progress lg-start-end-progress").css("transition-duration", _this.settings.startAnimationDuration + "ms");
                            _this.outer.addClass("lg-zoom-from-image");
                        }));
                        setTimeout((function() {
                            currentSlide_1.css("transform", "translate3d(0, 0, 0)");
                        }), 100);
                    }
                    setTimeout((function() {
                        _this.$backdrop.addClass("in");
                        _this.$container.addClass("lg-show-in");
                    }), 10);
                    if (!_this.zoomFromOrigin || !transform) setTimeout((function() {
                        _this.outer.addClass("lg-visible");
                    }), _this.settings.backdropDuration);
                    _this.slide(index, false, false, false);
                    _this.LGel.trigger(lGEvents.afterOpen);
                }));
                if (document.body === this.settings.container) $LG("html").addClass("lg-on");
            };
            LightGallery.prototype.getMediaContainerPosition = function() {
                if (this.settings.allowMediaOverlap) return {
                    top: 0,
                    bottom: 0
                };
                var top = this.$toolbar.get().clientHeight || 0;
                var subHtml = this.outer.find(".lg-components .lg-sub-html").get();
                var captionHeight = this.settings.defaultCaptionHeight || subHtml && subHtml.clientHeight || 0;
                var thumbContainer = this.outer.find(".lg-thumb-outer").get();
                var thumbHeight = thumbContainer ? thumbContainer.clientHeight : 0;
                var bottom = thumbHeight + captionHeight;
                return {
                    top,
                    bottom
                };
            };
            LightGallery.prototype.setMediaContainerPosition = function(top, bottom) {
                if (void 0 === top) top = 0;
                if (void 0 === bottom) bottom = 0;
                this.$content.css("top", top + "px").css("bottom", bottom + "px");
            };
            LightGallery.prototype.hideBars = function() {
                var _this = this;
                setTimeout((function() {
                    _this.outer.removeClass("lg-hide-items");
                    if (_this.settings.hideBarsDelay > 0) {
                        _this.outer.on("mousemove.lg click.lg touchstart.lg", (function() {
                            _this.outer.removeClass("lg-hide-items");
                            clearTimeout(_this.hideBarTimeout);
                            _this.hideBarTimeout = setTimeout((function() {
                                _this.outer.addClass("lg-hide-items");
                            }), _this.settings.hideBarsDelay);
                        }));
                        _this.outer.trigger("mousemove.lg");
                    }
                }), this.settings.showBarsAfter);
            };
            LightGallery.prototype.initPictureFill = function($img) {
                if (this.settings.supportLegacyBrowser) try {
                    picturefill({
                        elements: [ $img.get() ]
                    });
                } catch (e) {
                    console.warn("lightGallery :- If you want srcset or picture tag to be supported for older browser please include picturefil javascript library in your document.");
                }
            };
            LightGallery.prototype.counter = function() {
                if (this.settings.counter) {
                    var counterHtml = '<div class="lg-counter" role="status" aria-live="polite">\n                <span id="' + this.getIdName("lg-counter-current") + '" class="lg-counter-current">' + (this.index + 1) + ' </span> /\n                <span id="' + this.getIdName("lg-counter-all") + '" class="lg-counter-all">' + this.galleryItems.length + " </span></div>";
                    this.outer.find(this.settings.appendCounterTo).append(counterHtml);
                }
            };
            LightGallery.prototype.addHtml = function(index) {
                var subHtml;
                var subHtmlUrl;
                if (this.galleryItems[index].subHtmlUrl) subHtmlUrl = this.galleryItems[index].subHtmlUrl; else subHtml = this.galleryItems[index].subHtml;
                if (!subHtmlUrl) if (subHtml) {
                    var fL = subHtml.substring(0, 1);
                    if ("." === fL || "#" === fL) if (this.settings.subHtmlSelectorRelative && !this.settings.dynamic) subHtml = $LG(this.items).eq(index).find(subHtml).first().html(); else subHtml = $LG(subHtml).first().html();
                } else subHtml = "";
                if (".lg-item" !== this.settings.appendSubHtmlTo) if (subHtmlUrl) this.outer.find(".lg-sub-html").load(subHtmlUrl); else this.outer.find(".lg-sub-html").html(subHtml); else {
                    var currentSlide = $LG(this.getSlideItemId(index));
                    if (subHtmlUrl) currentSlide.load(subHtmlUrl); else currentSlide.append('<div class="lg-sub-html">' + subHtml + "</div>");
                }
                if ("undefined" !== typeof subHtml && null !== subHtml) if ("" === subHtml) this.outer.find(this.settings.appendSubHtmlTo).addClass("lg-empty-html"); else this.outer.find(this.settings.appendSubHtmlTo).removeClass("lg-empty-html");
                this.LGel.trigger(lGEvents.afterAppendSubHtml, {
                    index
                });
            };
            LightGallery.prototype.preload = function(index) {
                for (var i = 1; i <= this.settings.preload; i++) {
                    if (i >= this.galleryItems.length - index) break;
                    this.loadContent(index + i, false);
                }
                for (var j = 1; j <= this.settings.preload; j++) {
                    if (index - j < 0) break;
                    this.loadContent(index - j, false);
                }
            };
            LightGallery.prototype.getDummyImgStyles = function(imageSize) {
                if (!imageSize) return "";
                return "width:" + imageSize.width + "px;\n                margin-left: -" + imageSize.width / 2 + "px;\n                margin-top: -" + imageSize.height / 2 + "px;\n                height:" + imageSize.height + "px";
            };
            LightGallery.prototype.getVideoContStyle = function(imageSize) {
                if (!imageSize) return "";
                return "width:" + imageSize.width + "px;\n                height:" + imageSize.height + "px";
            };
            LightGallery.prototype.getDummyImageContent = function($currentSlide, index, alt) {
                var $currentItem;
                if (!this.settings.dynamic) $currentItem = $LG(this.items).eq(index);
                if ($currentItem) {
                    var _dummyImgSrc = void 0;
                    if (!this.settings.exThumbImage) _dummyImgSrc = $currentItem.find("img").first().attr("src"); else _dummyImgSrc = $currentItem.attr(this.settings.exThumbImage);
                    if (!_dummyImgSrc) return "";
                    var imgStyle = this.getDummyImgStyles(this.currentImageSize);
                    var dummyImgContent = "<img " + alt + ' style="' + imgStyle + '" class="lg-dummy-img" src="' + _dummyImgSrc + '" />';
                    $currentSlide.addClass("lg-first-slide");
                    this.outer.addClass("lg-first-slide-loading");
                    return dummyImgContent;
                }
                return "";
            };
            LightGallery.prototype.setImgMarkup = function(src, $currentSlide, index) {
                var currentGalleryItem = this.galleryItems[index];
                var alt = currentGalleryItem.alt, srcset = currentGalleryItem.srcset, sizes = currentGalleryItem.sizes, sources = currentGalleryItem.sources;
                var imgContent = "";
                var altAttr = alt ? 'alt="' + alt + '"' : "";
                if (this.isFirstSlideWithZoomAnimation()) imgContent = this.getDummyImageContent($currentSlide, index, altAttr); else imgContent = utils.getImgMarkup(index, src, altAttr, srcset, sizes, sources);
                var imgMarkup = '<picture class="lg-img-wrap"> ' + imgContent + "</picture>";
                $currentSlide.prepend(imgMarkup);
            };
            LightGallery.prototype.onSlideObjectLoad = function($slide, isHTML5VideoWithoutPoster, onLoad, onError) {
                var mediaObject = $slide.find(".lg-object").first();
                if (utils.isImageLoaded(mediaObject.get()) || isHTML5VideoWithoutPoster) onLoad(); else {
                    mediaObject.on("load.lg error.lg", (function() {
                        onLoad && onLoad();
                    }));
                    mediaObject.on("error.lg", (function() {
                        onError && onError();
                    }));
                }
            };
            LightGallery.prototype.onLgObjectLoad = function(currentSlide, index, delay, speed, isFirstSlide, isHTML5VideoWithoutPoster) {
                var _this = this;
                this.onSlideObjectLoad(currentSlide, isHTML5VideoWithoutPoster, (function() {
                    _this.triggerSlideItemLoad(currentSlide, index, delay, speed, isFirstSlide);
                }), (function() {
                    currentSlide.addClass("lg-complete lg-complete_");
                    currentSlide.html('<span class="lg-error-msg">Oops... Failed to load content...</span>');
                }));
            };
            LightGallery.prototype.triggerSlideItemLoad = function($currentSlide, index, delay, speed, isFirstSlide) {
                var _this = this;
                var currentGalleryItem = this.galleryItems[index];
                var _speed = isFirstSlide && "video" === this.getSlideType(currentGalleryItem) && !currentGalleryItem.poster ? speed : 0;
                setTimeout((function() {
                    $currentSlide.addClass("lg-complete lg-complete_");
                    _this.LGel.trigger(lGEvents.slideItemLoad, {
                        index,
                        delay: delay || 0,
                        isFirstSlide
                    });
                }), _speed);
            };
            LightGallery.prototype.isFirstSlideWithZoomAnimation = function() {
                return !!(!this.lGalleryOn && this.zoomFromOrigin && this.currentImageSize);
            };
            LightGallery.prototype.addSlideVideoInfo = function(items) {
                var _this = this;
                items.forEach((function(element, index) {
                    element.__slideVideoInfo = utils.isVideo(element.src, !!element.video, index);
                    if (element.__slideVideoInfo && _this.settings.loadYouTubePoster && !element.poster && element.__slideVideoInfo.youtube) element.poster = "//img.youtube.com/vi/" + element.__slideVideoInfo.youtube[1] + "/maxresdefault.jpg";
                }));
            };
            LightGallery.prototype.loadContent = function(index, rec) {
                var _this = this;
                var currentGalleryItem = this.galleryItems[index];
                var $currentSlide = $LG(this.getSlideItemId(index));
                var poster = currentGalleryItem.poster, srcset = currentGalleryItem.srcset, sizes = currentGalleryItem.sizes, sources = currentGalleryItem.sources;
                var src = currentGalleryItem.src;
                var video = currentGalleryItem.video;
                var _html5Video = video && "string" === typeof video ? JSON.parse(video) : video;
                if (currentGalleryItem.responsive) {
                    var srcDyItms = currentGalleryItem.responsive.split(",");
                    src = utils.getResponsiveSrc(srcDyItms) || src;
                }
                var videoInfo = currentGalleryItem.__slideVideoInfo;
                var lgVideoStyle = "";
                var iframe = !!currentGalleryItem.iframe;
                var isFirstSlide = !this.lGalleryOn;
                var delay = 0;
                if (isFirstSlide) if (this.zoomFromOrigin && this.currentImageSize) delay = this.settings.startAnimationDuration + 10; else delay = this.settings.backdropDuration + 10;
                if (!$currentSlide.hasClass("lg-loaded")) {
                    if (videoInfo) {
                        var _a = this.mediaContainerPosition, top_2 = _a.top, bottom = _a.bottom;
                        var videoSize = utils.getSize(this.items[index], this.outer, top_2 + bottom, videoInfo && this.settings.videoMaxSize);
                        lgVideoStyle = this.getVideoContStyle(videoSize);
                    }
                    if (iframe) {
                        var markup = utils.getIframeMarkup(this.settings.iframeWidth, this.settings.iframeHeight, this.settings.iframeMaxWidth, this.settings.iframeMaxHeight, src, currentGalleryItem.iframeTitle);
                        $currentSlide.prepend(markup);
                    } else if (poster) {
                        var dummyImg = "";
                        var hasStartAnimation = isFirstSlide && this.zoomFromOrigin && this.currentImageSize;
                        if (hasStartAnimation) dummyImg = this.getDummyImageContent($currentSlide, index, "");
                        markup = utils.getVideoPosterMarkup(poster, dummyImg || "", lgVideoStyle, this.settings.strings["playVideo"], videoInfo);
                        $currentSlide.prepend(markup);
                    } else if (videoInfo) {
                        markup = '<div class="lg-video-cont " style="' + lgVideoStyle + '"></div>';
                        $currentSlide.prepend(markup);
                    } else {
                        this.setImgMarkup(src, $currentSlide, index);
                        if (srcset || sources) {
                            var $img = $currentSlide.find(".lg-object");
                            this.initPictureFill($img);
                        }
                    }
                    if (poster || videoInfo) this.LGel.trigger(lGEvents.hasVideo, {
                        index,
                        src,
                        html5Video: _html5Video,
                        hasPoster: !!poster
                    });
                    this.LGel.trigger(lGEvents.afterAppendSlide, {
                        index
                    });
                    if (this.lGalleryOn && ".lg-item" === this.settings.appendSubHtmlTo) this.addHtml(index);
                }
                var _speed = 0;
                if (delay && !$LG(document.body).hasClass("lg-from-hash")) _speed = delay;
                if (this.isFirstSlideWithZoomAnimation()) {
                    setTimeout((function() {
                        $currentSlide.removeClass("lg-start-end-progress lg-start-progress").removeAttr("style");
                    }), this.settings.startAnimationDuration + 100);
                    if (!$currentSlide.hasClass("lg-loaded")) setTimeout((function() {
                        if ("image" === _this.getSlideType(currentGalleryItem)) {
                            $currentSlide.find(".lg-img-wrap").append(utils.getImgMarkup(index, src, "", srcset, sizes, currentGalleryItem.sources));
                            if (srcset || sources) {
                                var $img = $currentSlide.find(".lg-object");
                                _this.initPictureFill($img);
                            }
                        }
                        if ("image" === _this.getSlideType(currentGalleryItem) || "video" === _this.getSlideType(currentGalleryItem) && poster) {
                            _this.onLgObjectLoad($currentSlide, index, delay, _speed, true, false);
                            _this.onSlideObjectLoad($currentSlide, !!(videoInfo && videoInfo.html5 && !poster), (function() {
                                _this.loadContentOnFirstSlideLoad(index, $currentSlide, _speed);
                            }), (function() {
                                _this.loadContentOnFirstSlideLoad(index, $currentSlide, _speed);
                            }));
                        }
                    }), this.settings.startAnimationDuration + 100);
                }
                $currentSlide.addClass("lg-loaded");
                if (!this.isFirstSlideWithZoomAnimation() || "video" === this.getSlideType(currentGalleryItem) && !poster) this.onLgObjectLoad($currentSlide, index, delay, _speed, isFirstSlide, !!(videoInfo && videoInfo.html5 && !poster));
                if ((!this.zoomFromOrigin || !this.currentImageSize) && $currentSlide.hasClass("lg-complete_") && !this.lGalleryOn) setTimeout((function() {
                    $currentSlide.addClass("lg-complete");
                }), this.settings.backdropDuration);
                this.lGalleryOn = true;
                if (true === rec) if (!$currentSlide.hasClass("lg-complete_")) $currentSlide.find(".lg-object").first().on("load.lg error.lg", (function() {
                    _this.preload(index);
                })); else this.preload(index);
            };
            LightGallery.prototype.loadContentOnFirstSlideLoad = function(index, $currentSlide, speed) {
                var _this = this;
                setTimeout((function() {
                    $currentSlide.find(".lg-dummy-img").remove();
                    $currentSlide.removeClass("lg-first-slide");
                    _this.outer.removeClass("lg-first-slide-loading");
                    _this.isDummyImageRemoved = true;
                    _this.preload(index);
                }), speed + 300);
            };
            LightGallery.prototype.getItemsToBeInsertedToDom = function(index, prevIndex, numberOfItems) {
                var _this = this;
                if (void 0 === numberOfItems) numberOfItems = 0;
                var itemsToBeInsertedToDom = [];
                var possibleNumberOfItems = Math.max(numberOfItems, 3);
                possibleNumberOfItems = Math.min(possibleNumberOfItems, this.galleryItems.length);
                var prevIndexItem = "lg-item-" + this.lgId + "-" + prevIndex;
                if (this.galleryItems.length <= 3) {
                    this.galleryItems.forEach((function(_element, index) {
                        itemsToBeInsertedToDom.push("lg-item-" + _this.lgId + "-" + index);
                    }));
                    return itemsToBeInsertedToDom;
                }
                if (index < (this.galleryItems.length - 1) / 2) {
                    for (var idx = index; idx > index - possibleNumberOfItems / 2 && idx >= 0; idx--) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
                    var numberOfExistingItems = itemsToBeInsertedToDom.length;
                    for (idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index + idx + 1));
                } else {
                    for (idx = index; idx <= this.galleryItems.length - 1 && idx < index + possibleNumberOfItems / 2; idx++) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + idx);
                    numberOfExistingItems = itemsToBeInsertedToDom.length;
                    for (idx = 0; idx < possibleNumberOfItems - numberOfExistingItems; idx++) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (index - idx - 1));
                }
                if (this.settings.loop) if (index === this.galleryItems.length - 1) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + 0); else if (0 === index) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + (this.galleryItems.length - 1));
                if (-1 === itemsToBeInsertedToDom.indexOf(prevIndexItem)) itemsToBeInsertedToDom.push("lg-item-" + this.lgId + "-" + prevIndex);
                return itemsToBeInsertedToDom;
            };
            LightGallery.prototype.organizeSlideItems = function(index, prevIndex) {
                var _this = this;
                var itemsToBeInsertedToDom = this.getItemsToBeInsertedToDom(index, prevIndex, this.settings.numberOfSlideItemsInDom);
                itemsToBeInsertedToDom.forEach((function(item) {
                    if (-1 === _this.currentItemsInDom.indexOf(item)) _this.$inner.append('<div id="' + item + '" class="lg-item"></div>');
                }));
                this.currentItemsInDom.forEach((function(item) {
                    if (-1 === itemsToBeInsertedToDom.indexOf(item)) $LG("#" + item).remove();
                }));
                return itemsToBeInsertedToDom;
            };
            LightGallery.prototype.getPreviousSlideIndex = function() {
                var prevIndex = 0;
                try {
                    var currentItemId = this.outer.find(".lg-current").first().attr("id");
                    prevIndex = parseInt(currentItemId.split("-")[3]) || 0;
                } catch (error) {
                    prevIndex = 0;
                }
                return prevIndex;
            };
            LightGallery.prototype.setDownloadValue = function(index) {
                if (this.settings.download) {
                    var currentGalleryItem = this.galleryItems[index];
                    var hideDownloadBtn = false === currentGalleryItem.downloadUrl || "false" === currentGalleryItem.downloadUrl;
                    if (hideDownloadBtn) this.outer.addClass("lg-hide-download"); else {
                        var $download = this.getElementById("lg-download");
                        this.outer.removeClass("lg-hide-download");
                        $download.attr("href", currentGalleryItem.downloadUrl || currentGalleryItem.src);
                        if (currentGalleryItem.download) $download.attr("download", currentGalleryItem.download);
                    }
                }
            };
            LightGallery.prototype.makeSlideAnimation = function(direction, currentSlideItem, previousSlideItem) {
                var _this = this;
                if (this.lGalleryOn) previousSlideItem.addClass("lg-slide-progress");
                setTimeout((function() {
                    _this.outer.addClass("lg-no-trans");
                    _this.outer.find(".lg-item").removeClass("lg-prev-slide lg-next-slide");
                    if ("prev" === direction) {
                        currentSlideItem.addClass("lg-prev-slide");
                        previousSlideItem.addClass("lg-next-slide");
                    } else {
                        currentSlideItem.addClass("lg-next-slide");
                        previousSlideItem.addClass("lg-prev-slide");
                    }
                    setTimeout((function() {
                        _this.outer.find(".lg-item").removeClass("lg-current");
                        currentSlideItem.addClass("lg-current");
                        _this.outer.removeClass("lg-no-trans");
                    }), 50);
                }), this.lGalleryOn ? this.settings.slideDelay : 0);
            };
            LightGallery.prototype.slide = function(index, fromTouch, fromThumb, direction) {
                var _this = this;
                var prevIndex = this.getPreviousSlideIndex();
                this.currentItemsInDom = this.organizeSlideItems(index, prevIndex);
                if (this.lGalleryOn && prevIndex === index) return;
                var numberOfGalleryItems = this.galleryItems.length;
                if (!this.lgBusy) {
                    if (this.settings.counter) this.updateCurrentCounter(index);
                    var currentSlideItem = this.getSlideItem(index);
                    var previousSlideItem_1 = this.getSlideItem(prevIndex);
                    var currentGalleryItem = this.galleryItems[index];
                    var videoInfo = currentGalleryItem.__slideVideoInfo;
                    this.outer.attr("data-lg-slide-type", this.getSlideType(currentGalleryItem));
                    this.setDownloadValue(index);
                    if (videoInfo) {
                        var _a = this.mediaContainerPosition, top_3 = _a.top, bottom = _a.bottom;
                        var videoSize = utils.getSize(this.items[index], this.outer, top_3 + bottom, videoInfo && this.settings.videoMaxSize);
                        this.resizeVideoSlide(index, videoSize);
                    }
                    this.LGel.trigger(lGEvents.beforeSlide, {
                        prevIndex,
                        index,
                        fromTouch: !!fromTouch,
                        fromThumb: !!fromThumb
                    });
                    this.lgBusy = true;
                    clearTimeout(this.hideBarTimeout);
                    this.arrowDisable(index);
                    if (!direction) if (index < prevIndex) direction = "prev"; else if (index > prevIndex) direction = "next";
                    if (!fromTouch) this.makeSlideAnimation(direction, currentSlideItem, previousSlideItem_1); else {
                        this.outer.find(".lg-item").removeClass("lg-prev-slide lg-current lg-next-slide");
                        var touchPrev = void 0;
                        var touchNext = void 0;
                        if (numberOfGalleryItems > 2) {
                            touchPrev = index - 1;
                            touchNext = index + 1;
                            if (0 === index && prevIndex === numberOfGalleryItems - 1) {
                                touchNext = 0;
                                touchPrev = numberOfGalleryItems - 1;
                            } else if (index === numberOfGalleryItems - 1 && 0 === prevIndex) {
                                touchNext = 0;
                                touchPrev = numberOfGalleryItems - 1;
                            }
                        } else {
                            touchPrev = 0;
                            touchNext = 1;
                        }
                        if ("prev" === direction) this.getSlideItem(touchNext).addClass("lg-next-slide"); else this.getSlideItem(touchPrev).addClass("lg-prev-slide");
                        currentSlideItem.addClass("lg-current");
                    }
                    if (!this.lGalleryOn) this.loadContent(index, true); else setTimeout((function() {
                        _this.loadContent(index, true);
                        if (".lg-item" !== _this.settings.appendSubHtmlTo) _this.addHtml(index);
                    }), this.settings.speed + 50 + (fromTouch ? 0 : this.settings.slideDelay));
                    setTimeout((function() {
                        _this.lgBusy = false;
                        previousSlideItem_1.removeClass("lg-slide-progress");
                        _this.LGel.trigger(lGEvents.afterSlide, {
                            prevIndex,
                            index,
                            fromTouch,
                            fromThumb
                        });
                    }), (this.lGalleryOn ? this.settings.speed + 100 : 100) + (fromTouch ? 0 : this.settings.slideDelay));
                }
                this.index = index;
            };
            LightGallery.prototype.updateCurrentCounter = function(index) {
                this.getElementById("lg-counter-current").html(index + 1 + "");
            };
            LightGallery.prototype.updateCounterTotal = function() {
                this.getElementById("lg-counter-all").html(this.galleryItems.length + "");
            };
            LightGallery.prototype.getSlideType = function(item) {
                if (item.__slideVideoInfo) return "video"; else if (item.iframe) return "iframe"; else return "image";
            };
            LightGallery.prototype.touchMove = function(startCoords, endCoords, e) {
                var distanceX = endCoords.pageX - startCoords.pageX;
                var distanceY = endCoords.pageY - startCoords.pageY;
                var allowSwipe = false;
                if (this.swipeDirection) allowSwipe = true; else if (Math.abs(distanceX) > 15) {
                    this.swipeDirection = "horizontal";
                    allowSwipe = true;
                } else if (Math.abs(distanceY) > 15) {
                    this.swipeDirection = "vertical";
                    allowSwipe = true;
                }
                if (!allowSwipe) return;
                var $currentSlide = this.getSlideItem(this.index);
                if ("horizontal" === this.swipeDirection) {
                    null === e || void 0 === e ? void 0 : e.preventDefault();
                    this.outer.addClass("lg-dragging");
                    this.setTranslate($currentSlide, distanceX, 0);
                    var width = $currentSlide.get().offsetWidth;
                    var slideWidthAmount = 15 * width / 100;
                    var gutter = slideWidthAmount - Math.abs(10 * distanceX / 100);
                    this.setTranslate(this.outer.find(".lg-prev-slide").first(), -width + distanceX - gutter, 0);
                    this.setTranslate(this.outer.find(".lg-next-slide").first(), width + distanceX + gutter, 0);
                } else if ("vertical" === this.swipeDirection) if (this.settings.swipeToClose) {
                    null === e || void 0 === e ? void 0 : e.preventDefault();
                    this.$container.addClass("lg-dragging-vertical");
                    var opacity = 1 - Math.abs(distanceY) / window.innerHeight;
                    this.$backdrop.css("opacity", opacity);
                    var scale = 1 - Math.abs(distanceY) / (2 * window.innerWidth);
                    this.setTranslate($currentSlide, 0, distanceY, scale, scale);
                    if (Math.abs(distanceY) > 100) this.outer.addClass("lg-hide-items").removeClass("lg-components-open");
                }
            };
            LightGallery.prototype.touchEnd = function(endCoords, startCoords, event) {
                var _this = this;
                var distance;
                if ("lg-slide" !== this.settings.mode) this.outer.addClass("lg-slide");
                setTimeout((function() {
                    _this.$container.removeClass("lg-dragging-vertical");
                    _this.outer.removeClass("lg-dragging lg-hide-items").addClass("lg-components-open");
                    var triggerClick = true;
                    if ("horizontal" === _this.swipeDirection) {
                        distance = endCoords.pageX - startCoords.pageX;
                        var distanceAbs = Math.abs(endCoords.pageX - startCoords.pageX);
                        if (distance < 0 && distanceAbs > _this.settings.swipeThreshold) {
                            _this.goToNextSlide(true);
                            triggerClick = false;
                        } else if (distance > 0 && distanceAbs > _this.settings.swipeThreshold) {
                            _this.goToPrevSlide(true);
                            triggerClick = false;
                        }
                    } else if ("vertical" === _this.swipeDirection) {
                        distance = Math.abs(endCoords.pageY - startCoords.pageY);
                        if (_this.settings.closable && _this.settings.swipeToClose && distance > 100) {
                            _this.closeGallery();
                            return;
                        } else _this.$backdrop.css("opacity", 1);
                    }
                    _this.outer.find(".lg-item").removeAttr("style");
                    if (triggerClick && Math.abs(endCoords.pageX - startCoords.pageX) < 5) {
                        var target = $LG(event.target);
                        if (_this.isPosterElement(target)) _this.LGel.trigger(lGEvents.posterClick);
                    }
                    _this.swipeDirection = void 0;
                }));
                setTimeout((function() {
                    if (!_this.outer.hasClass("lg-dragging") && "lg-slide" !== _this.settings.mode) _this.outer.removeClass("lg-slide");
                }), this.settings.speed + 100);
            };
            LightGallery.prototype.enableSwipe = function() {
                var _this = this;
                var startCoords = {};
                var endCoords = {};
                var isMoved = false;
                var isSwiping = false;
                if (this.settings.enableSwipe) {
                    this.$inner.on("touchstart.lg", (function(e) {
                        _this.dragOrSwipeEnabled = true;
                        var $item = _this.getSlideItem(_this.index);
                        if (($LG(e.target).hasClass("lg-item") || $item.get().contains(e.target)) && !_this.outer.hasClass("lg-zoomed") && !_this.lgBusy && 1 === e.targetTouches.length) {
                            isSwiping = true;
                            _this.touchAction = "swipe";
                            _this.manageSwipeClass();
                            startCoords = {
                                pageX: e.targetTouches[0].pageX,
                                pageY: e.targetTouches[0].pageY
                            };
                        }
                    }));
                    this.$inner.on("touchmove.lg", (function(e) {
                        if (isSwiping && "swipe" === _this.touchAction && 1 === e.targetTouches.length) {
                            endCoords = {
                                pageX: e.targetTouches[0].pageX,
                                pageY: e.targetTouches[0].pageY
                            };
                            _this.touchMove(startCoords, endCoords, e);
                            isMoved = true;
                        }
                    }));
                    this.$inner.on("touchend.lg", (function(event) {
                        if ("swipe" === _this.touchAction) {
                            if (isMoved) {
                                isMoved = false;
                                _this.touchEnd(endCoords, startCoords, event);
                            } else if (isSwiping) {
                                var target = $LG(event.target);
                                if (_this.isPosterElement(target)) _this.LGel.trigger(lGEvents.posterClick);
                            }
                            _this.touchAction = void 0;
                            isSwiping = false;
                        }
                    }));
                }
            };
            LightGallery.prototype.enableDrag = function() {
                var _this = this;
                var startCoords = {};
                var endCoords = {};
                var isDraging = false;
                var isMoved = false;
                if (this.settings.enableDrag) {
                    this.outer.on("mousedown.lg", (function(e) {
                        _this.dragOrSwipeEnabled = true;
                        var $item = _this.getSlideItem(_this.index);
                        if ($LG(e.target).hasClass("lg-item") || $item.get().contains(e.target)) if (!_this.outer.hasClass("lg-zoomed") && !_this.lgBusy) {
                            e.preventDefault();
                            if (!_this.lgBusy) {
                                _this.manageSwipeClass();
                                startCoords = {
                                    pageX: e.pageX,
                                    pageY: e.pageY
                                };
                                isDraging = true;
                                _this.outer.get().scrollLeft += 1;
                                _this.outer.get().scrollLeft -= 1;
                                _this.outer.removeClass("lg-grab").addClass("lg-grabbing");
                                _this.LGel.trigger(lGEvents.dragStart);
                            }
                        }
                    }));
                    $LG(window).on("mousemove.lg.global" + this.lgId, (function(e) {
                        if (isDraging && _this.lgOpened) {
                            isMoved = true;
                            endCoords = {
                                pageX: e.pageX,
                                pageY: e.pageY
                            };
                            _this.touchMove(startCoords, endCoords);
                            _this.LGel.trigger(lGEvents.dragMove);
                        }
                    }));
                    $LG(window).on("mouseup.lg.global" + this.lgId, (function(event) {
                        if (!_this.lgOpened) return;
                        var target = $LG(event.target);
                        if (isMoved) {
                            isMoved = false;
                            _this.touchEnd(endCoords, startCoords, event);
                            _this.LGel.trigger(lGEvents.dragEnd);
                        } else if (_this.isPosterElement(target)) _this.LGel.trigger(lGEvents.posterClick);
                        if (isDraging) {
                            isDraging = false;
                            _this.outer.removeClass("lg-grabbing").addClass("lg-grab");
                        }
                    }));
                }
            };
            LightGallery.prototype.triggerPosterClick = function() {
                var _this = this;
                this.$inner.on("click.lg", (function(event) {
                    if (!_this.dragOrSwipeEnabled && _this.isPosterElement($LG(event.target))) _this.LGel.trigger(lGEvents.posterClick);
                }));
            };
            LightGallery.prototype.manageSwipeClass = function() {
                var _touchNext = this.index + 1;
                var _touchPrev = this.index - 1;
                if (this.settings.loop && this.galleryItems.length > 2) if (0 === this.index) _touchPrev = this.galleryItems.length - 1; else if (this.index === this.galleryItems.length - 1) _touchNext = 0;
                this.outer.find(".lg-item").removeClass("lg-next-slide lg-prev-slide");
                if (_touchPrev > -1) this.getSlideItem(_touchPrev).addClass("lg-prev-slide");
                this.getSlideItem(_touchNext).addClass("lg-next-slide");
            };
            LightGallery.prototype.goToNextSlide = function(fromTouch) {
                var _this = this;
                var _loop = this.settings.loop;
                if (fromTouch && this.galleryItems.length < 3) _loop = false;
                if (!this.lgBusy) if (this.index + 1 < this.galleryItems.length) {
                    this.index++;
                    this.LGel.trigger(lGEvents.beforeNextSlide, {
                        index: this.index
                    });
                    this.slide(this.index, !!fromTouch, false, "next");
                } else if (_loop) {
                    this.index = 0;
                    this.LGel.trigger(lGEvents.beforeNextSlide, {
                        index: this.index
                    });
                    this.slide(this.index, !!fromTouch, false, "next");
                } else if (this.settings.slideEndAnimation && !fromTouch) {
                    this.outer.addClass("lg-right-end");
                    setTimeout((function() {
                        _this.outer.removeClass("lg-right-end");
                    }), 400);
                }
            };
            LightGallery.prototype.goToPrevSlide = function(fromTouch) {
                var _this = this;
                var _loop = this.settings.loop;
                if (fromTouch && this.galleryItems.length < 3) _loop = false;
                if (!this.lgBusy) if (this.index > 0) {
                    this.index--;
                    this.LGel.trigger(lGEvents.beforePrevSlide, {
                        index: this.index,
                        fromTouch
                    });
                    this.slide(this.index, !!fromTouch, false, "prev");
                } else if (_loop) {
                    this.index = this.galleryItems.length - 1;
                    this.LGel.trigger(lGEvents.beforePrevSlide, {
                        index: this.index,
                        fromTouch
                    });
                    this.slide(this.index, !!fromTouch, false, "prev");
                } else if (this.settings.slideEndAnimation && !fromTouch) {
                    this.outer.addClass("lg-left-end");
                    setTimeout((function() {
                        _this.outer.removeClass("lg-left-end");
                    }), 400);
                }
            };
            LightGallery.prototype.keyPress = function() {
                var _this = this;
                $LG(window).on("keydown.lg.global" + this.lgId, (function(e) {
                    if (_this.lgOpened && true === _this.settings.escKey && 27 === e.keyCode) {
                        e.preventDefault();
                        if (_this.settings.allowMediaOverlap && _this.outer.hasClass("lg-can-toggle") && _this.outer.hasClass("lg-components-open")) _this.outer.removeClass("lg-components-open"); else _this.closeGallery();
                    }
                    if (_this.lgOpened && _this.galleryItems.length > 1) {
                        if (37 === e.keyCode) {
                            e.preventDefault();
                            _this.goToPrevSlide();
                        }
                        if (39 === e.keyCode) {
                            e.preventDefault();
                            _this.goToNextSlide();
                        }
                    }
                }));
            };
            LightGallery.prototype.arrow = function() {
                var _this = this;
                this.getElementById("lg-prev").on("click.lg", (function() {
                    _this.goToPrevSlide();
                }));
                this.getElementById("lg-next").on("click.lg", (function() {
                    _this.goToNextSlide();
                }));
            };
            LightGallery.prototype.arrowDisable = function(index) {
                if (!this.settings.loop && this.settings.hideControlOnEnd) {
                    var $prev = this.getElementById("lg-prev");
                    var $next = this.getElementById("lg-next");
                    if (index + 1 === this.galleryItems.length) $next.attr("disabled", "disabled").addClass("disabled"); else $next.removeAttr("disabled").removeClass("disabled");
                    if (0 === index) $prev.attr("disabled", "disabled").addClass("disabled"); else $prev.removeAttr("disabled").removeClass("disabled");
                }
            };
            LightGallery.prototype.setTranslate = function($el, xValue, yValue, scaleX, scaleY) {
                if (void 0 === scaleX) scaleX = 1;
                if (void 0 === scaleY) scaleY = 1;
                $el.css("transform", "translate3d(" + xValue + "px, " + yValue + "px, 0px) scale3d(" + scaleX + ", " + scaleY + ", 1)");
            };
            LightGallery.prototype.mousewheel = function() {
                var _this = this;
                var lastCall = 0;
                this.outer.on("wheel.lg", (function(e) {
                    if (!e.deltaY || _this.galleryItems.length < 2) return;
                    e.preventDefault();
                    var now = (new Date).getTime();
                    if (now - lastCall < 1e3) return;
                    lastCall = now;
                    if (e.deltaY > 0) _this.goToNextSlide(); else if (e.deltaY < 0) _this.goToPrevSlide();
                }));
            };
            LightGallery.prototype.isSlideElement = function(target) {
                return target.hasClass("lg-outer") || target.hasClass("lg-item") || target.hasClass("lg-img-wrap");
            };
            LightGallery.prototype.isPosterElement = function(target) {
                var playButton = this.getSlideItem(this.index).find(".lg-video-play-button").get();
                return target.hasClass("lg-video-poster") || target.hasClass("lg-video-play-button") || playButton && playButton.contains(target.get());
            };
            LightGallery.prototype.toggleMaximize = function() {
                var _this = this;
                this.getElementById("lg-maximize").on("click.lg", (function() {
                    _this.$container.toggleClass("lg-inline");
                    _this.refreshOnResize();
                }));
            };
            LightGallery.prototype.invalidateItems = function() {
                for (var index = 0; index < this.items.length; index++) {
                    var element = this.items[index];
                    var $element = $LG(element);
                    $element.off("click.lgcustom-item-" + $element.attr("data-lg-id"));
                }
            };
            LightGallery.prototype.manageCloseGallery = function() {
                var _this = this;
                if (!this.settings.closable) return;
                var mousedown = false;
                this.getElementById("lg-close").on("click.lg", (function() {
                    _this.closeGallery();
                }));
                if (this.settings.closeOnTap) {
                    this.outer.on("mousedown.lg", (function(e) {
                        var target = $LG(e.target);
                        if (_this.isSlideElement(target)) mousedown = true; else mousedown = false;
                    }));
                    this.outer.on("mousemove.lg", (function() {
                        mousedown = false;
                    }));
                    this.outer.on("mouseup.lg", (function(e) {
                        var target = $LG(e.target);
                        if (_this.isSlideElement(target) && mousedown) if (!_this.outer.hasClass("lg-dragging")) _this.closeGallery();
                    }));
                }
            };
            LightGallery.prototype.closeGallery = function(force) {
                var _this = this;
                if (!this.lgOpened || !this.settings.closable && !force) return 0;
                this.LGel.trigger(lGEvents.beforeClose);
                $LG(window).scrollTop(this.prevScrollTop);
                var currentItem = this.items[this.index];
                var transform;
                if (this.zoomFromOrigin && currentItem) {
                    var _a = this.mediaContainerPosition, top_4 = _a.top, bottom = _a.bottom;
                    var _b = this.galleryItems[this.index], __slideVideoInfo = _b.__slideVideoInfo, poster = _b.poster;
                    var imageSize = utils.getSize(currentItem, this.outer, top_4 + bottom, __slideVideoInfo && poster && this.settings.videoMaxSize);
                    transform = utils.getTransform(currentItem, this.outer, top_4, bottom, imageSize);
                }
                if (this.zoomFromOrigin && transform) {
                    this.outer.addClass("lg-closing lg-zoom-from-image");
                    this.getSlideItem(this.index).addClass("lg-start-end-progress").css("transition-duration", this.settings.startAnimationDuration + "ms").css("transform", transform);
                } else {
                    this.outer.addClass("lg-hide-items");
                    this.outer.removeClass("lg-zoom-from-image");
                }
                this.destroyModules();
                this.lGalleryOn = false;
                this.isDummyImageRemoved = false;
                this.zoomFromOrigin = this.settings.zoomFromOrigin;
                clearTimeout(this.hideBarTimeout);
                this.hideBarTimeout = false;
                $LG("html").removeClass("lg-on");
                this.outer.removeClass("lg-visible lg-components-open");
                this.$backdrop.removeClass("in").css("opacity", 0);
                var removeTimeout = this.zoomFromOrigin && transform ? Math.max(this.settings.startAnimationDuration, this.settings.backdropDuration) : this.settings.backdropDuration;
                this.$container.removeClass("lg-show-in");
                setTimeout((function() {
                    if (_this.zoomFromOrigin && transform) _this.outer.removeClass("lg-zoom-from-image");
                    _this.$container.removeClass("lg-show");
                    _this.$backdrop.removeAttr("style").css("transition-duration", _this.settings.backdropDuration + "ms");
                    _this.outer.removeClass("lg-closing " + _this.settings.startClass);
                    _this.getSlideItem(_this.index).removeClass("lg-start-end-progress");
                    _this.$inner.empty();
                    if (_this.lgOpened) _this.LGel.trigger(lGEvents.afterClose, {
                        instance: _this
                    });
                    if (_this.outer.get()) _this.outer.get().blur();
                    _this.lgOpened = false;
                }), removeTimeout + 100);
                return removeTimeout + 100;
            };
            LightGallery.prototype.initModules = function() {
                this.plugins.forEach((function(module) {
                    try {
                        module.init();
                    } catch (err) {
                        console.warn("lightGallery:- make sure lightGallery module is properly initiated");
                    }
                }));
            };
            LightGallery.prototype.destroyModules = function(destroy) {
                this.plugins.forEach((function(module) {
                    try {
                        if (destroy) module.destroy(); else module.closeGallery && module.closeGallery();
                    } catch (err) {
                        console.warn("lightGallery:- make sure lightGallery module is properly destroyed");
                    }
                }));
            };
            LightGallery.prototype.refresh = function(galleryItems) {
                if (!this.settings.dynamic) this.invalidateItems();
                if (galleryItems) this.galleryItems = galleryItems; else this.galleryItems = this.getItems();
                this.updateControls();
                this.openGalleryOnItemClick();
                this.LGel.trigger(lGEvents.updateSlides);
            };
            LightGallery.prototype.updateControls = function() {
                this.addSlideVideoInfo(this.galleryItems);
                this.updateCounterTotal();
                this.manageSingleSlideClassName();
            };
            LightGallery.prototype.destroy = function() {
                var _this = this;
                var closeTimeout = this.closeGallery(true);
                setTimeout((function() {
                    _this.destroyModules(true);
                    if (!_this.settings.dynamic) _this.invalidateItems();
                    $LG(window).off(".lg.global" + _this.lgId);
                    _this.LGel.off(".lg");
                    _this.$container.remove();
                }), closeTimeout);
                return closeTimeout;
            };
            return LightGallery;
        }();
        function lightGallery(el, options) {
            return new LightGallery(el, options);
        }
        const lightgallery_es5 = lightGallery;
        var lg_thumbnail_umd = __webpack_require__(205);
        var lg_zoom_umd = __webpack_require__(578);
        const galleries = document.querySelectorAll("[data-gallery]");
        if (galleries.length) {
            const galleyItems = [];
            galleries.forEach((gallery => {
                galleyItems.push({
                    gallery,
                    galleryClass: lightgallery_es5(gallery, {
                        plugins: [ lg_zoom_umd, lg_thumbnail_umd ],
                        selector: "a",
                        licenseKey: "7EC452A9-0CFD441C-BD984C7C-17C8456E",
                        speed: 500
                    })
                });
            }));
            flsModules.gallery = galleyItems;
        }
        const bodyStyle = getComputedStyle(document.documentElement);
        const menuBreakpoint = bodyStyle.getPropertyValue("--menu-breakpoint");
        const transitionDuration = bodyStyle.getPropertyValue("--transition-duration");
        const transitionFunction = bodyStyle.getPropertyValue("--transition-function");
        const observer = new ResizeObserver((event => {
            const localWidth = Math.floor(event[0].contentRect.width);
            const menuBody = document.querySelector(".menu__body");
            menuBody.style.removeProperty("transition");
            if (localWidth <= menuBreakpoint) {
                menuBody.style.removeProperty("transition");
                setTimeout((() => {
                    menuBody.style.setProperty("transition", `transform ${transitionDuration}ms ${transitionFunction}`);
                }), transitionDuration);
            }
        }));
        observer.observe(document.body);
        const parseVal = value => value ? parseInt(value) : 0;
        const calcHeaderHeight = () => {
            const header = document.querySelector(".header");
            const headerHeight = header.offsetHeight + parseVal(header.style.paddingTop) + parseVal(header.style.paddingBottom);
            document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
        };
        calcHeaderHeight();
        window.addEventListener("resize", (() => {
            calcHeaderHeight();
        }));
        const add_lazy_loading_images = document.querySelectorAll("img");
        add_lazy_loading_images?.forEach((image => {
            image.setAttribute("loading", "lazy");
        }));
        !function(e, t) {
            "object" == typeof exports && "undefined" != typeof module ? t() : "function" == typeof define && define.amd ? define(t) : t();
        }(0, (function() {
            "use strict";
            function e(e) {
                var t = !0, n = !1, o = null, d = {
                    text: !0,
                    search: !0,
                    url: !0,
                    tel: !0,
                    email: !0,
                    password: !0,
                    number: !0,
                    date: !0,
                    month: !0,
                    week: !0,
                    time: !0,
                    datetime: !0,
                    "datetime-local": !0
                };
                function i(e) {
                    return !!(e && e !== document && "HTML" !== e.nodeName && "BODY" !== e.nodeName && "classList" in e && "contains" in e.classList);
                }
                function s(e) {
                    e.classList.contains("focus-visible") || (e.classList.add("focus-visible"), e.setAttribute("data-focus-visible-added", ""));
                }
                function u(e) {
                    t = !1;
                }
                function a() {
                    document.addEventListener("mousemove", c), document.addEventListener("mousedown", c), 
                    document.addEventListener("mouseup", c), document.addEventListener("pointermove", c), 
                    document.addEventListener("pointerdown", c), document.addEventListener("pointerup", c), 
                    document.addEventListener("touchmove", c), document.addEventListener("touchstart", c), 
                    document.addEventListener("touchend", c);
                }
                function c(e) {
                    e.target.nodeName && "html" === e.target.nodeName.toLowerCase() || (t = !1, document.removeEventListener("mousemove", c), 
                    document.removeEventListener("mousedown", c), document.removeEventListener("mouseup", c), 
                    document.removeEventListener("pointermove", c), document.removeEventListener("pointerdown", c), 
                    document.removeEventListener("pointerup", c), document.removeEventListener("touchmove", c), 
                    document.removeEventListener("touchstart", c), document.removeEventListener("touchend", c));
                }
                document.addEventListener("keydown", (function(n) {
                    n.metaKey || n.altKey || n.ctrlKey || (i(e.activeElement) && s(e.activeElement), 
                    t = !0);
                }), !0), document.addEventListener("mousedown", u, !0), document.addEventListener("pointerdown", u, !0), 
                document.addEventListener("touchstart", u, !0), document.addEventListener("visibilitychange", (function(e) {
                    "hidden" === document.visibilityState && (n && (t = !0), a());
                }), !0), a(), e.addEventListener("focus", (function(e) {
                    var n, o, u;
                    i(e.target) && (t || (n = e.target, o = n.type, "INPUT" === (u = n.tagName) && d[o] && !n.readOnly || "TEXTAREA" === u && !n.readOnly || n.isContentEditable)) && s(e.target);
                }), !0), e.addEventListener("blur", (function(e) {
                    var t;
                    i(e.target) && (e.target.classList.contains("focus-visible") || e.target.hasAttribute("data-focus-visible-added")) && (n = !0, 
                    window.clearTimeout(o), o = window.setTimeout((function() {
                        n = !1;
                    }), 100), (t = e.target).hasAttribute("data-focus-visible-added") && (t.classList.remove("focus-visible"), 
                    t.removeAttribute("data-focus-visible-added")));
                }), !0), e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && e.host ? e.host.setAttribute("data-js-focus-visible", "") : e.nodeType === Node.DOCUMENT_NODE && (document.documentElement.classList.add("js-focus-visible"), 
                document.documentElement.setAttribute("data-js-focus-visible", ""));
            }
            if ("undefined" != typeof window && "undefined" != typeof document) {
                var t;
                window.applyFocusVisiblePolyfill = e;
                try {
                    t = new CustomEvent("focus-visible-polyfill-ready");
                } catch (e) {
                    (t = document.createEvent("CustomEvent")).initCustomEvent("focus-visible-polyfill-ready", !1, !1, {});
                }
                window.dispatchEvent(t);
            }
            "undefined" != typeof document && e(document);
        }));
        window["FLS"] = false;
        isWebp();
        menuInit();
        fullVHfix();
    })();
})();