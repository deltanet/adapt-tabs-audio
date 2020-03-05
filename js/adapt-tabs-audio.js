define(function(require) {

	var ComponentView = require('coreViews/componentView');
	var Adapt = require('coreJS/adapt');

	var TabsAudio = ComponentView.extend({

		events: {
			'click .tabsAudio-navigation-item': 'onTabItemClicked'
		},

		preRender: function() {
			// Listen for text change on audio extension
      this.listenTo(Adapt, "audio:changeText", this.replaceText);
		},

		postRender: function() {
			this.setReadyStatus();
			this.setLayout();
			this.listenTo(Adapt, 'device:resize', this.setLayout);
			this.showContentItemAtIndex(0, true);
			this.setTabSelectedAtIndex(0);

			if (this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
				this.replaceText(Adapt.audio.textSize);
      }
		},

		setLayout: function() {

			this.$el.removeClass("tabAudio-layout-left tabAudio-layout-top");
			if (Adapt.device.screenSize == 'large') {
				var tabLayout = this.model.get('_tabLayout');
				this.$el.addClass("tabAudio-layout-" + tabLayout);
				if (tabLayout === 'top') {
					this.setTabLayoutTop();
				} else if (tabLayout === 'left') {
					this.setTabLayoutLeft();
				}
			} else {
				this.$el.addClass("tabAudio-layout-left");
				this.setTabLayoutLeft();
			}

			// Check if just an image or just text is used in an item
			for (var i = 0; i < this.model.get('_items').length; i++) {
				if (this.model.get('_items')[i]._graphic.src == "" || this.model.get('_items')[i].body == "") {
					this.$('.item-'+i).addClass("fullwidth");
				}
			}

		},

		setTabLayoutTop: function() {
			var itemsLength = this.model.get('_items').length;
			var itemWidth = 100 / itemsLength;

			this.$('.tabsAudio-navigation-item').css({
				width: itemWidth + '%'
			});
		},

		setTabLayoutLeft: function() {
			this.$('.tabsAudio-navigation-item').css({
				width: 100 + '%'
			});
		},

		onTabItemClicked: function(event) {
			event.preventDefault();
			var index = $(event.currentTarget).index();
			this.showContentItemAtIndex(index);
			this.setTabSelectedAtIndex(index);
			this.setVisited($(event.currentTarget).index());

			this.model.set("_stage", index);

			var currentItem = this.getCurrentItem(index);

			///// Audio /////
      if (this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status==1) {
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
			var $contentItems = this.$('.tabAudio-content');
			$contentItems.removeClass('active');

			var $contentItem = $contentItems.eq(index);
			$contentItem.addClass('active');

			if (skipFocus) return;
			$contentItem.a11y_focus();
		},

		setTabSelectedAtIndex: function(index) {
			var $navigationItem = this.$('.tabsAudio-navigation-item-inner');
			$navigationItem.removeClass('selected').eq(index).addClass('selected visited').attr('aria-label', this.model.get("_items")[index].tabTitle + ". Visited");
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
      if (this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
        // Change each items title and body
        for (var i = 0; i < this.model.get('_items').length; i++) {
          if(value == 0) {
            this.$('.tabsAudio-navigation-item-inner').eq(i).html(this.model.get('_items')[i].tabTitle);
            this.$('.tabAudio-content-item-title-inner').eq(i).html(this.model.get('_items')[i].title).a11y_text();
            this.$('.tabAudio-content-item-body-inner').eq(i).html(this.model.get('_items')[i].body).a11y_text();
          } else {
            this.$('.tabsAudio-navigation-item-inner').eq(i).html(this.model.get('_items')[i].tabTitleReduced);
            this.$('.tabAudio-content-item-title-inner').eq(i).html(this.model.get('_items')[i].titleReduced).a11y_text();
            this.$('.tabAudio-content-item-body-inner').eq(i).html(this.model.get('_items')[i].bodyReduced).a11y_text();
          }
        }
      }
    }

	});

	Adapt.register("tabs-audio", TabsAudio);

	return TabsAudio;

});
