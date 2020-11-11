define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  var TabsAudioView = ComponentView.extend({

    events: {
      'click .js-tabs-audio-navigation': 'onTabItemClicked'
    },

    preRender: function() {
      // Listen for text change on audio extension
      this.listenTo(Adapt, 'audio:changeText', this.replaceText);
    },

    postRender: function() {
      this.setReadyStatus();
      this.setLayout();
      this.listenTo(Adapt, 'device:resize', this.setLayout);
      this.showContentItemAtIndex(0, true);
      this.setTabSelectedAtIndex(0);

      if (Adapt.audio && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
        this.replaceText(Adapt.audio.textSize);
      }
    },

    setLayout: function() {

      this.$el.removeClass('tabs-audio-layout-left tabs-audio-layout-top');
      if (Adapt.device.screenSize == 'large') {
        var tabLayout = this.model.get('_tabLayout');
        this.$el.addClass('tabs-audio-layout-' + tabLayout);
        if (tabLayout === 'top') {
          this.setTabLayoutTop();
        } else if (tabLayout === 'left') {
          this.setTabLayoutLeft();
        }
      } else {
        this.$el.addClass('tabs-audio-layout-left');
        this.setTabLayoutLeft();
      }

      // Check if just an image or just text is used in an item
      for (var i = 0; i < this.model.get('_items').length; i++) {
        if (this.model.get('_items')[i]._graphic.src == "" || this.model.get('_items')[i].body == "") {
          this.$('.item-' + i).addClass("fullwidth");
        }
      }

    },

    setTabLayoutTop: function() {
      var itemsLength = this.model.get('_items').length;
      var itemWidth = 100 / itemsLength;

      this.$('.tabs-audio-navigation-item').css({
        width: itemWidth + '%'
      });

      var titleHeight = 0;
      var titlePadding = 0;

      var titleArray = [];

      var $element = this.$('.tabs-audio-navigation-item');
      // Reset
      $element.find('.tabs-audio-navigation-item-inner').css('min-height', "");

      for (var i = 0; i < itemsLength; i++) {
        titlePadding = this.$('[data-id="item-' + i + '"]').outerHeight() - this.$('[data-id="item-' + i + '"]').height();
        titleArray[i] = this.$('[data-id="item-' + i + '"]').find('.tabs-audio-navigation-item-inner').height();

        if (titleArray[i] > titleHeight) {
          titleHeight = titleArray[i];
        }
      }

      $element.find('.tabs-audio-navigation-item-inner').css('min-height', titleHeight);
    },

    setTabLayoutLeft: function() {
      this.$('.tabs-audio-navigation-item').css({
        width: 100 + '%'
      });

      this.$('.tabs-audio-navigation-item-inner').css('min-height', "");
    },

    onTabItemClicked: function(event) {
      event.preventDefault();
      var index = $(event.currentTarget).index();
      this.showContentItemAtIndex(index);
      this.setTabSelectedAtIndex(index);
      this.setVisited($(event.currentTarget).index());

      var currentItem = this.getCurrentItem(index);

      ///// Audio /////
      if (Adapt.audio && this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status == 1) {
        // Reset onscreen id
        Adapt.audio.audioClip[this.model.get('_audio')._channel].onscreenID = "";
        // Trigger audio
        Adapt.trigger('audio:playAudio', currentItem._audio.src, this.model.get('_id'), this.model.get('_audio')._channel);
      }
      ///// End of Audio /////
    },

    ///// Audio /////
    getCurrentItem: function(index) {
      return this.model.get('_items')[index];
    },
    ///// End of Audio /////

    showContentItemAtIndex: function(index, skipFocus) {
      var $contentItems = this.$('.tabs-audio-content');
      $contentItems.removeClass('is-active');

      var $contentItem = $contentItems.eq(index);
      $contentItem.addClass('is-active');

      if (skipFocus) return;
      $contentItem.a11y_focus();
    },

    setTabSelectedAtIndex: function(index) {
      var $navigationItem = this.$('.tabs-audio-navigation-item-inner');
      $navigationItem.removeClass('is-selected').eq(index).addClass('is-selected is-visited').attr('aria-label', this.model.get('_items')[index].tabTitle + '.is-visited');
      this.setVisited(index);
    },

    setVisited: function(index) {
      var item = this.model.get('_items')[index];
      item._isVisited = true;
      this.checkCompletionStatus();
    },

    getVisitedItems: function() {
      return _.filter(this.model.get('_items'), function(item) {
        return item._isVisited;
      });
    },

    checkCompletionStatus: function() {
      if (this.getVisitedItems().length == this.model.get('_items').length) {
        this.setCompletionStatus();
      }
    },

    // Reduced text
    replaceText: function(value) {
      // If enabled
      if (Adapt.audio && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
        // Change each items title and body
        for (var i = 0; i < this.model.get('_items').length; i++) {
          if (value == 0) {
            this.$('.tabs-audio-navigation-item-inner').eq(i).html(this.model.get('_items')[i].tabTitle);
            this.$('.tabs-audio-content-item-title-inner').eq(i).html(this.model.get('_items')[i].title);
            this.$('.tabs-audio-content-item-body-inner').eq(i).html(this.model.get('_items')[i].body);
          } else {
            this.$('.tabs-audio-navigation-item-inner').eq(i).html(this.model.get('_items')[i].tabTitleReduced);
            this.$('.tabs-audio-content-item-title-inner').eq(i).html(this.model.get('_items')[i].titleReduced);
            this.$('.tabs-audio-content-item-body-inner').eq(i).html(this.model.get('_items')[i].bodyReduced);
          }
        }
      }
    }

  });

  return Adapt.register('tabs-audio', {
    model: ComponentModel.extend({}), // create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: TabsAudioView
  });
});
